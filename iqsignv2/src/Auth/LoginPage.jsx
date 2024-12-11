import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Link, Box, Checkbox, FormControlLabel } from '@mui/material';
//import { hasher } from './utils/utils'; // our hasher
import axios from 'axios';
import {useNavigate} from "react-router-dom";
//import hasher from '../../../iqsign/web/iqsign' //original hasher
import Cookies from 'js-cookie'


const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  //const [password, setPassword] = useState('');
  const [accessToken, setAccessToken] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const serverUrl = 'https://sherpa.cs.brown.edu:3336/rest';
  //const serverUrl = 'http://csci2340.cs.brown.edu:3335'

  {/**
    const handleLogin = async (event) => {
      event.preventDefault();
      setError('');

      try {
        // retrieve padding and session info
        const url = new URL(`${serverUrl}/login`);
        const preLoginResponse = await axios.get(url.toString());

        //if (!preLoginResponse.ok) {
        //setError('Failed to initialize login.');
        //return;
        //}

        const preLoginData = await preLoginResponse.data;
        const {code: curPadding, session: curSession} = preLoginData;


        // Hash credentials with padding and session
        let lowerCaseUsername = username.toLowerCase();

        let hashedPassword = hasher(password);
        let paddedHash = hasher(hashedPassword + lowerCaseUsername);
        let finalHash = hasher(paddedHash + curPadding);

        // POST request with hashed credentials
        const body = {
          username: lowerCaseUsername,
          padding: curPadding,
          password: finalHash,
          iqsignSession: curSession,
        };

        const loginResponse = await axios.post(`${serverUrl}/login`, body, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(body),
        });

        const loginData = await loginResponse.data;

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
  **/}

  // Redirect to /home if session cookie exists
  useEffect(() => {
    if (Cookies.get("session")) {
      navigate('/home');
    }
  }, [navigate]);

  const handleLogin = async () => {
    setError('');
      try {
        // Login request
        const loginResponse = await fetch(`${serverUrl}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            accesstoken: accessToken,
          }),
        });

        const loginData = await loginResponse.json();

        if (loginData.status === "OK") {
          // Set session cookie to expire in 1 hour
          Cookies.set("session", loginData.session, {
            expires: 1 / 24, // 1 hour expiry
          });

          // Redirect or display success
          alert('Login successful!');
          navigate('/home');
        }else{
          setError(loginData.error || 'Invalid login credentials.');
        }
      } catch (err) {
        setError(err.message);
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
                label="username"
                variant="outlined"
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
                fullWidth
                //label="Password"
                label={"Access-Token"}
                type="accessToken"
                variant="outlined"
                margin="normal"
                value={accessToken}
                //onChange={(e) => setPassword(e.target.value)}
                onChange={(e) => setAccessToken(e.target.value)}
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
                //onClick={()=>navigate("/home")} // temporarily disabling backend, remove when auth is working
            >
              Log in
            </Button>
            {error && (
                <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                  {error}
                </Typography>
            )}
            <Box sx={{ mt: 2 }}>
              <Link href="/forgotpw" underline="hover" sx={{ color: 'black' }}>
                Forgot password?
              </Link>
            </Box>
            {/**
            <Box sx={{ mt: 2 }}>
              <Link href="/register" underline="hover" sx={{ color: 'black' }}>
                New Account
              </Link>
            </Box>
          **/}
          </Box>
        </Box>
      </Container>
  );
};

export default LoginPage;
