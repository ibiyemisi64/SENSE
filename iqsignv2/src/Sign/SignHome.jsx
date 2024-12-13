import React, { useEffect, useState } from 'react';
import List from '@mui/material/List';
import { Grid2, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CollectionsIcon from '@mui/icons-material/Collections';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LinkIcon from '@mui/icons-material/Link';
import PersonIcon from '@mui/icons-material/Person';
import Sign from './Sign.jsx';
import TopBar from "../Topbar/TopBar.jsx";
import { Link } from 'react-router-dom';
import { useSignData } from './hooks/getSignData.jsx'

export const HomeMenuHandleCopyLink = ({ signData }) => {

    const handleCopyClick = () => {
        const previewLink = signData.imageurl;
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


export const HomeMenu = ({ signData }) => {

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
                <ListItemButton component={Link} to={signData.signurl} >
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

    const { signData, isLoading } = useSignData();
    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <TopBar />
            <Grid2 container
                sx={{
                    background: 'white',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 4,
                    alignItems: 'center',
                    justifyContent: 'left',
                    marginTop: '100px'
                }}
            >
                <Grid2 sx={{ alignSelf: 'flex-start' }} item>
                    <HomeMenu signData={signData} />
                </Grid2>
                <Grid2 ml={5} item>
                    <Sign signData={signData} />
                </Grid2>

            </Grid2>
        </>
    );
};

export function HomePage() {
    return Home()
};