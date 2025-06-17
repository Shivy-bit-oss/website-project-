import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Paper,
  Container,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  DialogContentText,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { sendPasswordReset } from '../firebase/firebaseService';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('chauhanshivy10@gmail.com');
  const [resetStatus, setResetStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login('chauhanshivy10@gmail.com', password);
      navigate('/admin');
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to log in. Please check your password.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    try {
      setResetStatus('Sending password reset email...');
      await sendPasswordReset('chauhanshivy10@gmail.com');
      setResetStatus('Password reset email sent! Please check your inbox.');
    } catch (error) {
      console.error('Password reset error:', error);
      setResetStatus('Failed to send password reset email. Please try again.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Admin Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            value="admin"
            disabled
            sx={{ backgroundColor: 'action.disabledBackground' }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Link
              component="button"
              variant="body2"
              onClick={() => setResetDialogOpen(true)}
            >
              Forgot password?
            </Link>
          </Box>
        </Box>
      </Box>

      <Dialog open={resetDialogOpen} onClose={() => setResetDialogOpen(false)}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            A password reset link will be sent to your email address.
          </DialogContentText>
          {resetStatus && (
            <Alert severity={resetStatus.includes('Failed') ? 'error' : 'info'} sx={{ mt: 2 }}>
              {resetStatus}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleForgotPassword} color="primary">
            Send Reset Link
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminLogin; 