/***
 * ProfilePage.jsx
 *
 * Purpose: Lets user see and edit their information, generate login code, and log out of iqsign.
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
import Cookies from "js-cookie";
import EditIcon from "@mui/icons-material/Edit";
//import SearchIcon from "@mui/icons-material/Search";
//import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import TopBar from "./Topbar/TopBar.jsx";
import {useNavigate} from "react-router-dom";
import useUserStore from "./Auth/hooks/userStore.js";

const ProfilePage = () => {
  const navigate = useNavigate();
  const {username, setUsername} = useUserStore();
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
      <Container maxWidth="lg" sx={{paddingTop: "20px", color: "black"}}>

        <TopBar></TopBar>

        <link rel="icon" href="./assets/icon/favicon.png" type="image/png"/>

        {/* Profile Section */}
        <Box sx={{marginBottom: "20px", marginTop: '100px'}}>
          <Typography variant="h5" mb={3}>
            Profile
          </Typography>

          {/* Username */}
          <Box display="flex" alignItems="center" mb={2}>
            <Typography variant="body1" sx={{width: "120px"}}>
              Username
            </Typography>
            <Typography>{username}</Typography>
            <IconButton sx={{marginLeft: "auto"}}>
              <EditIcon/>
            </IconButton>
          </Box>


          {/* Email */}
          {/*<Box display="flex" alignItems="center" mb={2}>*/}
          {/*  <Typography variant="body1" sx={{width: "120px"}}>*/}
          {/*    Email*/}
          {/*  </Typography>*/}
          {/*  <Typography>{email}</Typography>*/}
          {/*  <IconButton sx={{marginLeft: "auto"}}>*/}
          {/*    <EditIcon/>*/}
          {/*  </IconButton>*/}
          {/*</Box>*/}

          {/* Password */}
          <Box display="flex" alignItems="center" mb={4}>
            <Typography variant="body1" sx={{width: "120px"}}>
              Password
            </Typography>
            <Typography>{password}</Typography>
            <IconButton sx={{marginLeft: "auto"}} onClick={()=>navigate("/resetpw")}>
              <EditIcon/>
            </IconButton>
          </Box>

          {/* Generate Login Code Section */}
          <Box display="flex" alignItems="center" mb={2}>
            <Typography variant="body1" sx={{width: "160px"}}>
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
                          <ContentCopyIcon/>
                        </IconButton>
                      </InputAdornment>
                  ),
                }}
                sx={{width: "300px"}}
            />
            <Button
                variant="contained"
                onClick={handleGenerateCode}
                sx={{marginLeft: "20px", backgroundColor: 'black', color: 'white'}}
            >
              Generate
            </Button>
          </Box>

          <Typography variant="caption">
            *Please save this code as you will not be able to revisit it.
          </Typography>
        </Box>
        <Button sx={{backgroundColor: 'black', color: 'white'}} variant="contained" onClick={()=> {
          Cookies.remove("session")
          navigate("/")
        }}> Logout </Button>
      </Container>
  );
};

export default ProfilePage;
