import React from 'react';
import {Container, TextField, Button, Typography, Box, Link} from '@mui/material';
import {useNavigate} from "react-router-dom";

const RegistrationPage = () => {
  const navigate = useNavigate();
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
            onClick={()=>navigate("/home")}
          >
            Register
          </Button>
          <Box sx={{ mt: 2 }}>
            <Typography>Already have an account?<Link href="#" onClick={()=> navigate("/")} underline="hover" sx={{ color: 'black' }}> Sign in </Link></Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default RegistrationPage;
