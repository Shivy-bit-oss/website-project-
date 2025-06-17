import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  CircularProgress, 
  Divider, 
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Chip
} from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { getMenuItems } from '../firebase/firebaseService';

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);

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
    const loadMenuItems = async () => {
      try {
        const items = await getMenuItems();
        setMenuItems(items);
      } catch (error) {
        console.error('Error loading menu items:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMenuItems();
  }, []);

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Filter and search logic
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);
    return matchesSearch && matchesCategory;
  });

  // Group menu items by category
  const groupedMenuItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (menuItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
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
          <RestaurantMenuIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Menu Coming Soon
          </Typography>
          <Typography variant="body1" color="text.secondary">
            We're currently updating our menu. Please check back later!
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography 
        variant="h3" 
        component="h1" 
        gutterBottom 
        align="center"
        sx={{ 
          fontFamily: 'Playfair Display',
          mb: 6,
          color: 'primary.main',
          fontSize: { xs: '2rem', md: '2.5rem' }
        }}
      >
        Our Menu
      </Typography>

      {/* Search and Filter Section */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'background.paper',
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={handleFilterClick}
              fullWidth
              sx={{ height: '56px', borderRadius: 2 }}
            >
              Filter Categories
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleFilterClose}
              PaperProps={{
                sx: {
                  maxHeight: 300,
                  width: '250px',
                  mt: 1
                }
              }}
            >
              {categories.map((category) => (
                <MenuItem
                  key={category}
                  onClick={() => handleCategoryToggle(category)}
                  selected={selectedCategories.includes(category)}
                >
                  {category}
                </MenuItem>
              ))}
            </Menu>
          </Grid>
        </Grid>

        {/* Active Filters */}
        {selectedCategories.length > 0 && (
          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {selectedCategories.map((category) => (
              <Chip
                key={category}
                label={category}
                onDelete={() => handleCategoryToggle(category)}
                color="primary"
                variant="outlined"
              />
            ))}
            <Chip
              label="Clear All"
              onClick={() => setSelectedCategories([])}
              color="primary"
              variant="outlined"
            />
          </Box>
        )}
      </Box>
      
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 2, md: 4 },
          backgroundColor: 'background.paper',
          borderRadius: 2
        }}
      >
        {Object.entries(groupedMenuItems).map(([category, items]) => (
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
    </Container>
  );
};

export default MenuPage; 