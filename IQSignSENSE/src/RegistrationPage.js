import React from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

const RegistrationPage = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h3" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
          IQSign
        </Typography>

        <Box component="form" sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
          />
          <TextField
            fullWidth
            label="Re-enter Password"
            type="password"
            variant="outlined"
            margin="normal"
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, backgroundColor: 'black', color: 'white' }}
          >
            Register
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default RegistrationPage;
