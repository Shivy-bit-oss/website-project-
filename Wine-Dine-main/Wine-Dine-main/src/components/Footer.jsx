import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'rgba(139, 69, 19, 0.95)',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* About Section */}
          <Grid xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Wine & Dine offers an exquisite dining experience with carefully curated menus and exceptional service.
            </Typography>
          </Grid>

          {/* Contact Section */}
          <Grid xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" color="text.secondary">
              123 Restaurant Street<br />
              City, State 12345<br />
              Phone: (123) 456-7890<br />
              Email: info@wineanddine.com
            </Typography>
          </Grid>

          {/* Quick Links Section */}
          <Grid xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/menu" color="inherit" underline="hover">Menu</Link>
              <Link href="/reviews" color="inherit" underline="hover">Reviews</Link>
              <Link href="/contact" color="inherit" underline="hover">Contact</Link>
              <Link href="/admin" color="inherit" underline="hover">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AdminPanelSettingsIcon fontSize="small" />
                  Admin Panel
                </Box>
              </Link>
            </Box>
          </Grid>
        </Grid>

        {/* Social Media and Copyright */}
        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © {new Date().getFullYear()} Wine & Dine. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              color="inherit"
              aria-label="Facebook"
              component="a"
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ '&:hover': { opacity: 0.8 } }}
            >
              <FacebookIcon />
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="Instagram"
              component="a"
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ '&:hover': { opacity: 0.8 } }}
            >
              <InstagramIcon />
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="Twitter"
              component="a"
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ '&:hover': { opacity: 0.8 } }}
            >
              <TwitterIcon />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 