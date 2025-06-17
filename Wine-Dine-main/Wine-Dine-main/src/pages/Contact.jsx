import { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Grid, Paper, Alert, Snackbar } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { addContactMessage } from '../firebase/firebaseService';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await addContactMessage(formData);
      setSnackbar({
        open: true,
        message: 'Thank you for your message! We will get back to you soon.',
        severity: 'success'
      });
      setFormData({
        name: '',
        email: '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting message:', error);
      setSnackbar({
        open: true,
        message: 'Error sending message. Please try again.',
        severity: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="xl" sx={{ flex: 1, py: { xs: 4, md: 8 } }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          align="center" 
          sx={{ 
            fontFamily: 'Playfair Display',
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            mb: { xs: 3, md: 6 }
          }}
        >
          Contact Us
        </Typography>

        <Grid container spacing={{ xs: 3, md: 6 }} sx={{ height: '100%' }}>
          {/* Contact Information */}
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: { xs: 3, md: 4 }, 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  fontFamily: 'Playfair Display',
                  fontSize: { xs: '1.5rem', md: '1.75rem' }
                }}
              >
                Get in Touch
              </Typography>
              
              <Box sx={{ mt: { xs: 2, md: 4 } }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <LocationOnIcon sx={{ mr: 2, color: 'primary.main', mt: 0.5 }} />
                  <Typography variant="body1">
                    123 Wine Street<br />
                    Downtown, City<br />
                    Country
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PhoneIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="body1">
                    +1 (555) 123-4567
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EmailIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="body1">
                    info@wineanddine.com
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <AccessTimeIcon sx={{ mr: 2, color: 'primary.main', mt: 0.5 }} />
                  <Typography variant="body1">
                    Mon - Fri: 11:00 AM - 10:00 PM<br />
                    Sat - Sun: 10:00 AM - 11:00 PM
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} md={8}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: { xs: 3, md: 4 },
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  fontFamily: 'Playfair Display',
                  fontSize: { xs: '1.5rem', md: '1.75rem' }
                }}
              >
                Send us a Message
              </Typography>

              <Box 
                component="form" 
                onSubmit={handleSubmit} 
                sx={{ 
                  mt: { xs: 2, md: 4 },
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Your Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      size="medium"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      size="medium"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      multiline
                      rows={6}
                      size="medium"
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ mt: 'auto' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      fullWidth
                      disabled={submitting}
                      sx={{ 
                        py: 1.5,
                        fontSize: { xs: '1rem', md: '1.1rem' }
                      }}
                    >
                      {submitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

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
    </Box>
  );
};

export default Contact; 