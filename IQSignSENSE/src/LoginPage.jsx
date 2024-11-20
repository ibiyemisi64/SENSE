import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Link, Box, Checkbox, FormControlLabel } from '@mui/material';
import { hasher } from './utils/utils';


const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');

    try {
      // retrieve padding and session info
      const preLoginResponse = await fetch('https://sherpa.cs.brown.edu:3336/rest/login', {
        method: 'GET',
        credentials: 'include',
      });

      if (!preLoginResponse.ok) {
        setError('Failed to initialize login.');
        return;
      }

      const preLoginData = await preLoginResponse.json();
      const { code: curPadding, session: curSession } = preLoginData;

      // Hash credentials with padding and session
      const lowerCaseUsername = username.toLowerCase();
      const hashedPassword = hasher(password);
      const hashedUsername = hasher(lowerCaseUsername);
      const paddedHash = hasher(hashedUsername + curPadding);
      const finalHash = hasher(hashedPassword + paddedHash);

      // POST request with hashed credentials
      const body = {
        username: lowerCaseUsername,
        padding: curPadding,
        password: finalHash,
        iqsignSession: curSession,
      };

      const loginResponse = await fetch('https://sherpa.cs.brown.edu:3336/rest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      const loginData = await loginResponse.json();

      if (loginResponse.ok && loginData.status === 'OK') {

        localStorage.setItem('iqsignSession', loginData.session);

        // Redirect or display success
        alert('Login successful!');
        window.location.href = '/home';
      } else if (loginData.TEMPORARY) {
        alert('Temporary session detected. Redirecting to password reset...');
        window.location.href = '/reset-password';
      } else {
        setError(loginData.error || 'Invalid login credentials.');
      }
    } catch (err) {
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
