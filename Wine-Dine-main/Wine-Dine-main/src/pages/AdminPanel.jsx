import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Button,
  Rating,
  CircularProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  IconButton,
  Tooltip,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import LogoutIcon from '@mui/icons-material/Logout';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import RateReviewIcon from '@mui/icons-material/RateReview';
import MessageIcon from '@mui/icons-material/Message';
import {
  getPendingReviews,
  getMenuItems,
  addMenuItem,
  deleteMenuItem,
  approveReview,
  rejectReview,
  getContactMessages,
  markMessageAsRead,
  deleteMessage,
  updateUserEmail,
  updateUserPassword,
  deleteCurrentUser,
} from '../firebase/firebaseService';
import ImageUpload from '../components/ImageUpload';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [selectedTab, setSelectedTab] = useState(0);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState({
    open: false,
    itemId: null,
    itemName: '',
    type: '', // 'menu', 'review', or 'message'
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [accountDialog, setAccountDialog] = useState({
    open: false,
    type: '', // 'password' only now
  });
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const categories = [
    'Salads',
    'Sandwiches',
    'Fries',
    'Burgers',
    'Sliders',
    'Pizza',
    'Pasta',
    'Garlic Bread',
    'Wraps',
    'Dumpling',
    'Chinese',
    'Deserts',
    'CheeseCake'
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [reviews, items, messages] = await Promise.all([
        getPendingReviews(),
        getMenuItems(),
        getContactMessages(),
      ]);
      setPendingReviews(reviews);
      setMenuItems(items);
      setContactMessages(messages);
    } catch (error) {
      console.error('Error loading data:', error);
      showSnackbar('Error loading data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleApproveReview = async (reviewId) => {
    try {
      await approveReview(reviewId);
      showSnackbar('Review approved successfully');
      const reviews = await getPendingReviews();
      setPendingReviews(reviews);
    } catch (error) {
      console.error('Error approving review:', error);
      showSnackbar('Error approving review', 'error');
    }
  };

  const handleRejectReview = async (reviewId) => {
    try {
      await rejectReview(reviewId);
      showSnackbar('Review rejected successfully');
      const reviews = await getPendingReviews();
      setPendingReviews(reviews);
    } catch (error) {
      console.error('Error rejecting review:', error);
      showSnackbar('Error rejecting review', 'error');
    }
  };

  const handleMarkMessageAsRead = async (messageId) => {
    try {
      await markMessageAsRead(messageId);
      const messages = await getContactMessages();
      setContactMessages(messages);
    } catch (error) {
      console.error('Error marking message as read:', error);
      showSnackbar('Error marking message as read', 'error');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMessage(messageId);
      showSnackbar('Message deleted successfully');
      const messages = await getContactMessages();
      setContactMessages(messages);
    } catch (error) {
      console.error('Error deleting message:', error);
      showSnackbar('Error deleting message', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleAddMenuItem = async () => {
    try {
      // Validate required fields
      if (!newMenuItem.name || !newMenuItem.description || !newMenuItem.price || !newMenuItem.category) {
        showSnackbar('Please fill in all required fields', 'error');
        return;
      }

      // Validate price is a positive number
      const price = parseFloat(newMenuItem.price);
      if (isNaN(price) || price <= 0) {
        showSnackbar('Please enter a valid price', 'error');
        return;
      }

      await addMenuItem(newMenuItem);
      showSnackbar('Menu item added successfully');
      
      // Reset form and close dialog
      setNewMenuItem({
        name: '',
        description: '',
        price: '',
        category: '',
        imageUrl: '',
      });
      setOpenDialog(false);
      
      // Reload menu items
      const items = await getMenuItems();
      setMenuItems(items);
    } catch (error) {
      console.error('Error adding menu item:', error);
      showSnackbar('Error adding menu item', 'error');
    }
  };

  const handleDeleteClick = (item) => {
    setDeleteConfirmDialog({
      open: true,
      itemId: item.id,
      itemName: item.name,
      type: item.type || 'menu',
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteMenuItem(deleteConfirmDialog.itemId);
      showSnackbar('Menu item deleted successfully');
      
      // Reload menu items
      const items = await getMenuItems();
      setMenuItems(items);
    } catch (error) {
      console.error('Error deleting menu item:', error);
      showSnackbar('Error deleting menu item', 'error');
    } finally {
      setDeleteConfirmDialog({
        open: false,
        itemId: null,
        itemName: '',
        type: '',
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin-login');
    } catch (error) {
      console.error('Error logging out:', error);
      showSnackbar('Error logging out', 'error');
    }
  };

  const handleUpdateEmail = async () => {
    try {
      if (!newEmail || !newEmail.includes('@')) {
        showSnackbar('Please enter a valid email address', 'error');
        return;
      }

      if (!currentPassword) {
        showSnackbar('Please enter your current password', 'error');
        return;
      }

      setLoading(true);
      await updateUserEmail(newEmail, currentPassword);
      showSnackbar('Email updated. Please check your inbox for a verification email to complete the process.', 'info');
      setAccountDialog({ open: false, type: '' });
      setNewEmail('');
      setCurrentPassword('');
    } catch (error) {
      console.error('Error updating email:', error);
      if (error.code === 'auth/email-already-in-use') {
        showSnackbar('This email is already in use by another account', 'error');
      } else if (error.code === 'auth/invalid-email') {
        showSnackbar('Please enter a valid email address', 'error');
      } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        showSnackbar('Current password is incorrect', 'error');
      } else if (error.code === 'auth/requires-recent-login') {
        showSnackbar('Please log out and log in again before changing your email', 'error');
      } else {
        showSnackbar('Error updating email. Please try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      if (newPassword !== confirmPassword) {
        showSnackbar('Passwords do not match', 'error');
        return;
      }
      await updateUserPassword(newPassword);
      showSnackbar('Password updated successfully');
      setAccountDialog({ open: false, type: '' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      showSnackbar('Error updating password', 'error');
    }
  };

  const NoDataMessage = ({ icon: Icon, message }) => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        textAlign: 'center',
      }}
    >
      <Icon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {message}
      </Typography>
    </Box>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: 2,
        mb: 3
      }}>
        <Typography variant="h4" component="h1" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
          Admin Panel
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: 1,
          flexWrap: 'wrap',
          width: { xs: '100%', sm: 'auto' }
        }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setAccountDialog({ open: true, type: 'password' })}
            fullWidth={false}
            sx={{ flex: { xs: 1, sm: 'none' } }}
          >
            Change Password
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            fullWidth={false}
            sx={{ flex: { xs: 1, sm: 'none' } }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      <Box sx={{ 
        borderBottom: 1, 
        borderColor: 'divider', 
        mb: 3,
        overflowX: 'auto',
        '& .MuiTabs-root': {
          minWidth: { xs: '100%', sm: 'auto' }
        }
      }}>
        <Tabs
          value={selectedTab}
          onChange={(e, newValue) => setSelectedTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            '& .MuiTab-root': {
              minWidth: { xs: 'auto', sm: 160 },
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }
          }}
        >
          <Tab label="Pending Reviews" />
          <Tab label="Menu Management" />
          <Tab label="Contact Messages" />
        </Tabs>
      </Box>

      {selectedTab === 0 && (
        <Box sx={{ width: '100%' }}>
          {pendingReviews.length === 0 ? (
            <NoDataMessage
              icon={RateReviewIcon}
              message="No pending reviews to display"
            />
          ) : (
            <Grid container spacing={{ xs: 2, md: 4 }}>
              {pendingReviews.map((review) => (
                <Grid item key={review.id} xs={12} sm={6} md={6}>
                  <Card>
                    <CardContent>
                      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} mb={2} gap={1}>
                        <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>{review.name}</Typography>
                        <Rating value={review.rating} readOnly size="small" />
                      </Box>
                      <Typography variant="body1" paragraph sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                        {review.comment}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                        {new Date(review.timestamp).toLocaleDateString()}
                      </Typography>
                      <Box display="flex" gap={1} flexWrap="wrap">
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => handleApproveReview(review.id)}
                          size="small"
                          fullWidth={false}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleRejectReview(review.id)}
                          size="small"
                          fullWidth={false}
                        >
                          Reject
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {selectedTab === 1 && (
        <>
          <Box mb={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenDialog(true)}
              fullWidth={false}
            >
              Add New Menu Item
            </Button>
          </Box>

          <Box sx={{ width: '100%' }}>
            {menuItems.length === 0 ? (
              <NoDataMessage
                icon={RestaurantMenuIcon}
                message="No menu items available. Add your first menu item!"
              />
            ) : (
              <Paper 
                elevation={0} 
                sx={{ 
                  p: { xs: 2, md: 4 },
                  backgroundColor: 'background.paper',
                  borderRadius: 2
                }}
              >
                {Object.entries(menuItems.reduce((acc, item) => {
                  if (!acc[item.category]) {
                    acc[item.category] = [];
                  }
                  acc[item.category].push(item);
                  return acc;
                }, {})).map(([category, items]) => (
                  <Box key={category} sx={{ mb: 6 }}>
                    <Typography 
                      variant="h4" 
                      component="h2" 
                      sx={{ 
                        fontFamily: 'Playfair Display',
                        color: 'primary.main',
                        mb: 3,
                        textAlign: 'center',
                        fontSize: { xs: '1.5rem', md: '2rem' }
                      }}
                    >
                      {category}
                    </Typography>
                    <Divider sx={{ mb: 4 }} />
                    <Grid container spacing={3}>
                      {items.map((item) => (
                        <Grid item key={item.id} xs={12} md={6}>
                          <Box 
                            sx={{ 
                              display: 'flex',
                              flexDirection: { xs: 'column', sm: 'row' },
                              gap: 2,
                              mb: 3,
                              p: 2,
                              borderRadius: 2,
                              backgroundColor: 'background.paper',
                              boxShadow: 1,
                              '&:hover': {
                                transform: 'translateX(8px)',
                                transition: 'transform 0.2s ease-in-out'
                              }
                            }}
                          >
                            {item.imageUrl && (
                              <Box 
                                sx={{ 
                                  width: { xs: '100%', sm: '120px' },
                                  height: { xs: '200px', sm: '120px' },
                                  flexShrink: 0,
                                  borderRadius: 2,
                                  overflow: 'hidden',
                                  boxShadow: 1
                                }}
                              >
                                <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                  }}
                                />
                              </Box>
                            )}
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ 
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                mb: 1
                              }}>
                                <Typography 
                                  variant="h6" 
                                  component="h3"
                                  sx={{ 
                                    fontFamily: 'Playfair Display',
                                    fontWeight: 600,
                                    fontSize: { xs: '1.1rem', md: '1.25rem' }
                                  }}
                                >
                                  {item.name}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography 
                                    variant="h6" 
                                    color="primary"
                                    sx={{ 
                                      fontWeight: 600,
                                      whiteSpace: 'nowrap',
                                      ml: 2,
                                      fontSize: { xs: '1.1rem', md: '1.25rem' }
                                    }}
                                  >
                                    ₹{item.price.toFixed(2)}
                                  </Typography>
                                  <Tooltip title="Delete Item">
                                    <IconButton
                                      color="error"
                                      onClick={() => handleDeleteClick(item)}
                                      size="small"
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </Box>
                              <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{ 
                                  fontSize: { xs: '0.875rem', md: '1rem' },
                                  lineHeight: 1.5
                                }}
                              >
                                {item.description}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                ))}
              </Paper>
            )}
          </Box>
        </>
      )}

      {selectedTab === 2 && (
        <Box sx={{ width: '100%' }}>
          {contactMessages.length === 0 ? (
            <NoDataMessage
              icon={MessageIcon}
              message="No contact messages to display"
            />
          ) : (
            <Grid container spacing={2}>
              {contactMessages.map((message) => (
                <Grid item xs={12} key={message.id}>
                  <Card 
                    sx={{ 
                      mb: 2,
                      backgroundColor: message.read ? 'inherit' : 'action.hover',
                      transition: 'background-color 0.3s ease'
                    }}
                  >
                    <CardContent>
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', sm: 'row' }, 
                        gap: 2 
                      }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                            {message.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {message.email}
                          </Typography>
                          <Typography variant="body1" sx={{ mt: 1, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                            {message.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                            {new Date(message.timestamp).toLocaleString()}
                          </Typography>
                        </Box>
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: { xs: 'row', sm: 'column' },
                          gap: 1,
                          justifyContent: { xs: 'flex-end', sm: 'flex-start' },
                          mt: { xs: 2, sm: 0 }
                        }}>
                          {!message.read && (
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleMarkMessageAsRead(message.id)}
                              fullWidth={false}
                            >
                              Mark as Read
                            </Button>
                          )}
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => handleDeleteClick(message)}
                            fullWidth={false}
                          >
                            Delete
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Menu Item</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              value={newMenuItem.name}
              onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={newMenuItem.description}
              onChange={(e) => setNewMenuItem({ ...newMenuItem, description: e.target.value })}
              margin="normal"
              multiline
              rows={3}
              required
            />
            <TextField
              fullWidth
              label="Price"
              value={newMenuItem.price}
              onChange={(e) => setNewMenuItem({ ...newMenuItem, price: e.target.value })}
              margin="normal"
              type="number"
              inputProps={{ min: 0, step: 0.01 }}
              required
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Category</InputLabel>
              <Select
                value={newMenuItem.category}
                label="Category"
                onChange={(e) => setNewMenuItem({ ...newMenuItem, category: e.target.value })}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {/* Image Upload Section */}
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Item Image
              </Typography>
              <ImageUpload
                onImageUpload={(url) => setNewMenuItem({ ...newMenuItem, imageUrl: url })}
                maxSizeMB={5}
              />
              {newMenuItem.imageUrl && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <img
                    src={newMenuItem.imageUrl}
                    alt="Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '200px',
                      objectFit: 'contain',
                      borderRadius: '8px',
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddMenuItem} variant="contained" color="primary">
            Add Item
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteConfirmDialog.open}
        onClose={() => setDeleteConfirmDialog({ ...deleteConfirmDialog, open: false })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this {deleteConfirmDialog.type}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmDialog({ ...deleteConfirmDialog, open: false })}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (deleteConfirmDialog.type === 'message') {
                handleDeleteMessage(deleteConfirmDialog.itemId);
              } else {
                handleDeleteConfirm();
              }
            }}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={accountDialog.open} 
        onClose={() => {
          if (!loading) {
            setAccountDialog({ open: false, type: '' });
            setNewEmail('');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
          }
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            width: { xs: '95%', sm: 'auto' },
            maxWidth: '500px'
          }
        }}
      >
        <DialogTitle>
          {accountDialog.type === 'email' ? 'Change Email' : 'Change Password'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {accountDialog.type === 'email' ? (
              <>
                <TextField
                  fullWidth
                  label="New Email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  margin="normal"
                  required
                  disabled={loading}
                />
                <TextField
                  fullWidth
                  label="Current Password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  margin="normal"
                  required
                  disabled={loading}
                />
              </>
            ) : (
              <>
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  margin="normal"
                  required
                />
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              if (!loading) {
                setAccountDialog({ open: false, type: '' });
                setNewEmail('');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
              }
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={accountDialog.type === 'email' ? handleUpdateEmail : handleUpdatePassword}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminPanel; 