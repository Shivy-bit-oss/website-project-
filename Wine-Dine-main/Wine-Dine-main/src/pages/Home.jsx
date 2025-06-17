import { Container, Typography, Box, Button, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import WineBarIcon from '@mui/icons-material/WineBar';
import EventIcon from '@mui/icons-material/Event';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <RestaurantIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Fine Dining',
      description: 'Experience our carefully curated menu featuring the finest ingredients and culinary expertise. Our chefs create memorable dishes that blend traditional techniques with modern innovation.',
    },
    {
      icon: <WineBarIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Wine Selection',
      description: 'Explore our extensive collection of wines from around the world. Our sommeliers are ready to help you find the perfect pairing for your meal, whether you prefer bold reds or crisp whites.',
    },
    {
      icon: <EventIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Special Events',
      description: 'Host your special occasions in our elegant private dining rooms. From intimate gatherings to corporate events, we provide exceptional service and unforgettable experiences.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          height: { xs: '60vh', md: '80vh' },
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontFamily: 'Playfair Display',
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
              fontWeight: 700,
            }}
          >
            Welcome to Wine & Dine
          </Typography>
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ 
              mb: 4,
              fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            Experience the perfect blend of fine dining and exquisite wines in an elegant atmosphere
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate('/menu')}
            sx={{ 
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              '&:hover': {
                backgroundColor: 'secondary.dark',
              }
            }}
          >
            View Our Menu
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: { xs: 6, md: 10 } }}>
        <Typography 
          variant="h3" 
          component="h2" 
          align="center" 
          gutterBottom 
          sx={{ 
            fontFamily: 'Playfair Display',
            mb: 6,
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}
        >
          Why Choose Us
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item key={index} xs={12} md={4}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography 
                    variant="h5" 
                    component="h3" 
                    gutterBottom 
                    sx={{ 
                      fontFamily: 'Playfair Display',
                      fontWeight: 600,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home; 