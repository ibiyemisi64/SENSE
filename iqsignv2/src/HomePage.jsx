/*
 * HomePage.jsx
 *
 * Purpose:
 *
 *
 * Copyright 2024 Brown University --
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
 */
import React, { useEffect, useState } from 'react';
import List from '@mui/material/List';
import { Box, Grid2, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CollectionsIcon from '@mui/icons-material/Collections';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LinkIcon from '@mui/icons-material/Link';
import PersonIcon from '@mui/icons-material/Person';
import  Sign from './Sign/Sign.jsx';
import TopBar from "./Topbar/TopBar.jsx";
import { Link } from 'react-router-dom';
import { getCurrentSignData } from './Sign/hooks/getSignData.jsx'

const HomeMenuHandleCopyLink = () => {
    const { signData, loadCurrentSign, signImageUrl, signPreviewUrl } = getCurrentSignData();

    useEffect(()=> {
        loadCurrentSign();
    },[])

    const handleCopyClick = () => {
      const previewLink = signImageUrl;
      navigator.clipboard.writeText(previewLink);
    };
  
    return (
      <div>
        <ListItemText
          primary="Copy Image Link"
          onClick={handleCopyClick}
        />
      </div>
    );
  };


export function HomeMenu() {

    const { signData, loadCurrentSign, signImageUrl, signPreviewUrl } = getCurrentSignData();

    useEffect(()=> {
        loadCurrentSign();
    },[])
    
    return (
        <>
            <List
                className="list-group"
            >
                <ListItemButton>
                    <ListItemText primary="Sign: Hello" />
                </ListItemButton>
                <ListItemButton component={Link} to="/edit-legacy">
                    <ListItemIcon>
                        <EditIcon />
                    </ListItemIcon>
                    <ListItemText primary="Edit" />
                </ListItemButton>
                <ListItemButton component={Link} to="/edit">
                    <ListItemIcon>
                        <EditIcon />
                    </ListItemIcon>
                    <ListItemText primary="Edit with SENSE" />
                </ListItemButton>
                <ListItemButton component={Link} to="/gallery">
                    <ListItemIcon>
                        <CollectionsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Template Gallery" />
                </ListItemButton>
                <ListItemButton  component={Link} to={signPreviewUrl} >
                    <ListItemIcon>
                        <VisibilityIcon />
                    </ListItemIcon>
                    <ListItemText primary="Preview" />
                </ListItemButton>
                <ListItemButton>
                    <ListItemIcon>
                        <LinkIcon />
                    </ListItemIcon>
                    < HomeMenuHandleCopyLink />
                </ListItemButton>
                <ListItemButton component={Link} to="/profile">
                    <ListItemIcon>
                        <PersonIcon />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                </ListItemButton>

            </List>
        </>
    );
}

export default function Home() {

    return (
        <>
            <TopBar />
            <Grid2 container
                   fullWidth
                   sx={{
                       background: 'white',
                       display: 'flex',
                       flexDirection: 'row',
                       gap: 4,
                       alignItems: 'left',
                       justifyContent: 'left',
                       marginTop: '100px'
                   }}
            >
                <Grid2 item>
                    <HomeMenu />
                </Grid2>
                <Grid2 item>
                    <Sign />
                </Grid2>

            </Grid2>
        </>
    );
};
