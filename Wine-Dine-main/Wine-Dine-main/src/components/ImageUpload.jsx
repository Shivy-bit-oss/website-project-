import { useState } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { uploadImage } from '../services/cloudinaryService';

const ImageUpload = ({ onImageUpload, maxSizeMB = 5 }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const imageUrl = await uploadImage(file);
      onImageUpload(imageUrl);
    } catch (error) {
      setError('Error uploading image. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="image-upload"
        type="file"
        onChange={handleFileChange}
        disabled={uploading}
      />
      <label htmlFor="image-upload">
        <Button
          variant="contained"
          component="span"
          startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
          disabled={uploading}
          sx={{ mb: 2 }}
        >
          {uploading ? 'Uploading...' : 'Upload Image'}
        </Button>
      </label>
      
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
      
      <Typography variant="caption" display="block" color="text.secondary">
        Max file size: {maxSizeMB}MB
      </Typography>
    </Box>
  );
};

export default ImageUpload; 