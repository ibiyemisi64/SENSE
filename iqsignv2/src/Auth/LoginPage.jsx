/***
 * LoginPage.jsx
 *
 * Purpose: Allows user to login to their iqsign account. This is the defualt route for the app.
 *
 *
 * Copyright 2024 Brown University -- Shufan He
 *
 * All Rights Reserved
 *
 * Permission to use, copy, modify, and distribute this software and its
 * documentation for any purpose other than its incorporation into a
 * commercial product is hereby granted without fee, provided that the
 * above copyright notice appear in all copies and that both that
 * copyright notice and this permission notice appear in supporting
 * documentation, and that the name of Brown University not be used in
 * advertising or publicity pertaining to distribution of the software
 * without specific, written prior permission.
 *
 * BROWN UNIVERSITY DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS
 * SOFTWARE, INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS FOR ANY PARTICULAR PURPOSE. IN NO EVENT SHALL BROWN UNIVERSITY
 * BE LIABLE FOR ANY SPECIAL, INDIRECT OR CONSEQUENTIAL DAMAGES OR ANY
 * DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS,
 * WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS
 * ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE
 * OF THIS SOFTWARE.
 ***/
import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Link, Box, Checkbox, FormControlLabel } from '@mui/material';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import iqsignlogo from '../assets/icon/iqsignlogo.png';
import useUserStore from "./hooks/userStore.js";
import crypto from 'crypto';

import CryptoJS from 'crypto-js';

const hasher = (value) => {
  const hash = CryptoJS.SHA512(value);
  return CryptoJS.enc.Base64.stringify(hash);
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { username, setUsername } = useUserStore();
  const [accessToken, setAccessToken] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const serverUrl = 'https://sherpa.cs.brown.edu:3336/rest';

  const authenticateUser = async (username, accessToken) => {
    try {

      const preLoginResponse = await axios.get(`${serverUrl}/login`);
      const { code: curPadding, session: curSession } = preLoginResponse.data;

      const lowerCaseUsername = username.toLowerCase();
      const hashedToken = hasher(accessToken);
      const paddedHash = hasher(hashedToken + lowerCaseUsername);
      const finalHash = hasher(paddedHash + curPadding);

      // Authentication body
      const body = {
        username: lowerCaseUsername,
        password: finalHash,
        session: curSession,
        padding: curPadding,
      };

      const authResponse = await axios.post(`${serverUrl}/login`, body);
      return authResponse.data;
    } catch (err) {
      throw new Error('Authentication failed: ' + err.message);
    }
  };

  useEffect(() => {
    if (Cookies.get("session")) {
      navigate('/home');
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const authData = await authenticateUser(username, accessToken);

      if (authData.status === "OK") {
        Cookies.set("session", authData.session, {
          expires: rememberMe ? 7 : 1 / 24, // Remember Me for 7 days or 1 hour otherwise
        });
        navigate('/home');
      } else {
        setError(authData.error || 'Invalid login credentials.');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 0 }}>
            <Link to="/home" style={{ textDecoration: 'none', color: 'inherit' }}>
              <img data-testid='topbar' src={iqsignlogo} alt="Logo" style={{ height: '40px' }} />
            </Link>
          </Typography>

          <Box component="form" sx={{ mt: 3 }}>
            <TextField
                fullWidth
                label="username"
                variant="outlined"
                margin="normal"
                value={username}
                inputProps={{ 'data-testid': 'username-input' }}
                onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
                fullWidth
                label={"password"}
                type="password"
                variant="outlined"
                margin="normal"
                value={accessToken}
                inputProps={{ 'data-testid': 'access-token' }}
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
                onClick={handleLogin}
            >
              Log in
            </Button>
            {error && (
                <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                  {error}
                </Typography>
            )}
            <Box sx={{ mt: 2 }}>
              <Typography>
                <Link href="/forgotpw" underline="hover" sx={{ color: 'black' }}>
                  Forgot password?
                </Link>
              </Typography>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography>
                <Link href="/register" underline="hover" sx={{ color: 'black' }}>
                  Create New Account
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
  );
};

export default LoginPage;
