import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Divider
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const ProfilePage = () => {
  const [username, setUsername] = useState("Myusername");
  const [email, setEmail] = useState("username@gmail.com");
  const [password, setPassword] = useState("********");
  const [loginCode, setLoginCode] = useState("");

  const handleGenerateCode = () => {
    const generatedCode = Math.random().toString(36).substring(2, 12).toUpperCase();
    setLoginCode(generatedCode);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(loginCode);
  };

  return (
    <Container maxWidth="lg" sx={{ paddingTop: "20px", color: "black" }}>
      {/* Header with Search and Profile Icon */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">IQSign</Typography>
        <Box display="flex" alignItems="center" sx={{ gap: "10px" }}>
          <TextField
            variant="outlined"
            placeholder="Value"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ width: "400px" }}
          />
          <IconButton>
            <AccountCircleIcon sx={{ fontSize: 40 }} />
          </IconButton>
        </Box>
      </Box>

      <Divider sx={{ marginBottom: "20px" }} />

      {/* Profile Section */}
      <Box>
        <Typography variant="h5" mb={3}>
          Profile
        </Typography>

        {/* Username */}
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="body1" sx={{ width: "120px" }}>
            Username
          </Typography>
          <Typography>{username}</Typography>
          <IconButton sx={{ marginLeft: "auto" }}>
            <EditIcon />
          </IconButton>
        </Box>

        {/* Email */}
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="body1" sx={{ width: "120px" }}>
            Email
          </Typography>
          <Typography>{email}</Typography>
          <IconButton sx={{ marginLeft: "auto" }}>
            <EditIcon />
          </IconButton>
        </Box>

        {/* Password */}
        <Box display="flex" alignItems="center" mb={4}>
          <Typography variant="body1" sx={{ width: "120px" }}>
            Password
          </Typography>
          <Typography>{password}</Typography>
          <IconButton sx={{ marginLeft: "auto" }}>
            <EditIcon />
          </IconButton>
        </Box>

        {/* Generate Login Code Section */}
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="body1" sx={{ width: "160px" }}>
            Generate Login Code
          </Typography>
          <TextField
            variant="outlined"
            value={loginCode}
            //placeholder="[RANDOMGENERATEDCODE]"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleCopyCode}>
                    <ContentCopyIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ width: "300px" }}
          />
          <Button
            variant="contained"
            onClick={handleGenerateCode}
            sx={{ marginLeft: "20px", backgroundColor: 'black', color: 'white' }}
          >
            Generate
          </Button>
        </Box>

        <Typography variant="caption">
          *Please save this code as you will not be able to revisit it.
        </Typography>
      </Box>
    </Container>
  );
};

export default ProfilePage;
