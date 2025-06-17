import { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, Box, Rating, CircularProgress, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { getReviews } from '../firebase/firebaseService';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const approvedReviews = await getReviews();
        setReviews(approvedReviews.filter(review => review.approved));
      } catch (error) {
        console.error('Error loading reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (reviews.length === 0) {
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
          <RateReviewIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No Reviews Yet
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Be the first to share your experience with us!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/leave-review')}
          >
            Write a Review
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h3" component="h1">
          Customer Reviews
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/leave-review')}
        >
          Write a Review
        </Button>
      </Box>

      <Grid container spacing={4}>
        {reviews.map((review) => (
          <Grid item key={review.id} xs={12} md={6}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: 3
                }
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" component="h2">
                    {review.name}
                  </Typography>
                  <Rating value={review.rating} readOnly precision={0.5} />
                </Box>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {review.comment}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(review.timestamp).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Reviews; 