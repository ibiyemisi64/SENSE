import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Link, Box, Checkbox, FormControlLabel } from '@mui/material';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch('https://sherpa.cs.brown.edu:3336/rest', {
        //https://localhost:3336/rest'
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for session tracking?
        body: JSON.stringify({ username, password, rememberMe }),
      });

      const data = await response.json();

      if (response.ok) {
        // Handle successful login (e.g., redirect or show success message)
        alert(data.message);
        window.location.href = '/home'; // Redirect to home page
      } else {
        // Handle server-side error
        setError(data.error || 'Login failed.');
      }
    } catch (err) {
      // Handle network or unexpected errors
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h3" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
            IQSign
          </Typography>

          <Box component="form" onSubmit={handleLogin} sx={{ mt: 3 }}>
            <TextField
                fullWidth
                label="Username"
                variant="outlined"
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <FormControlLabel
                control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />}
                label="Remember Me"
            />
            <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, backgroundColor: 'black', color: 'white' }}
                type="submit"
            >
              Log in
            </Button>
            {error && (
                <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                  {error}
                </Typography>
            )}
            <Box sx={{ mt: 2 }}>
              <Link href="#" underline="hover" sx={{ color: 'black' }}>
                Forgot password?
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
  );
};

export default LoginPage;
