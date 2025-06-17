import { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Rating, Alert, Snackbar } from '@mui/material';
import { addReview } from '../firebase/firebaseService';

const LeaveReview = () => {
  const [formData, setFormData] = useState({
    name: '',
    rating: 0,
    comment: '',
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

  const handleRatingChange = (event, newValue) => {
    setFormData(prev => ({
      ...prev,
      rating: newValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await addReview(formData);
      setSnackbar({
        open: true,
        message: 'Thank you for your review! It will be visible after approval.',
        severity: 'success'
      });
      setFormData({
        name: '',
        rating: 0,
        comment: '',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error submitting review. Please try again.',
        severity: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        Leave a Review
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
        <TextField
          fullWidth
          label="Your Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          margin="normal"
        />
        
        <Box sx={{ my: 2 }}>
          <Typography component="legend">Rating</Typography>
          <Rating
            name="rating"
            value={formData.rating}
            onChange={handleRatingChange}
            precision={0.5}
            size="large"
          />
        </Box>

        <TextField
          fullWidth
          label="Your Review"
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          required
          multiline
          rows={4}
          margin="normal"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          disabled={submitting}
          sx={{ mt: 3 }}
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LeaveReview; 