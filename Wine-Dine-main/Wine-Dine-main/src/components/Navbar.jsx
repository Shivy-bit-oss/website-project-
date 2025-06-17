import { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink } from 'react-router-dom';

const pages = [
  { name: 'Menu', path: '/menu' },
  { name: 'Reviews', path: '/reviews' },
  { name: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography
        variant="h6"
        component={RouterLink}
        to="/"
        sx={{
          my: 2,
          display: 'block',
          fontFamily: 'Playfair Display',
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        Wine & Dine
      </Typography>
      <List>
        {pages.map((page) => (
          <ListItem
            key={page.name}
            component={RouterLink}
            to={page.path}
            sx={{ 
              textAlign: 'center',
              color: 'inherit',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <ListItemText primary={page.name} />
          </ListItem>
        ))}
        <ListItem
          component={RouterLink}
          to="/leave-review"
          sx={{ 
            textAlign: 'center',
            color: 'inherit',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <ListItemText primary="Leave a Review" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        backgroundColor: 'rgba(139, 69, 19, 0.95)',
        color: 'white',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* Logo for desktop */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'Playfair Display',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Wine & Dine
          </Typography>

          {/* Mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleDrawerToggle}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              variant="temporary"
              anchor="left"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true,
              }}
              sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiDrawer-paper': { 
                  boxSizing: 'border-box', 
                  width: 240,
                  backgroundColor: 'rgba(139, 69, 19, 0.95)',
                  color: 'white',
                },
              }}
            >
              {drawer}
            </Drawer>
          </Box>

          {/* Logo for mobile */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'Playfair Display',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Wine & Dine
          </Typography>

          {/* Desktop menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                component={RouterLink}
                to={page.path}
                onClick={handleCloseNavMenu}
                sx={{ 
                  my: 2, 
                  color: 'inherit', 
                  display: 'block', 
                  mx: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {/* Leave Review button */}
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button
              component={RouterLink}
              to="/leave-review"
              variant="contained"
              color="secondary"
              sx={{ 
                ml: 2,
                '&:hover': {
                  backgroundColor: 'secondary.dark',
                },
              }}
            >
              Leave a Review
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 