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
