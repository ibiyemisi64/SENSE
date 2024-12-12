import React from 'react';
import { AppBar, Toolbar, Typography, Box, InputBase, Container } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import iqsignlogo from '../assets/icon/iqsignlogo.png';
import {useGalleryStore} from "../Gallery/hooks/galleryStore.jsx";


const TopBar = ({ showSearchBox = false }) => {
    const {filter, setFilter} = useGalleryStore();
    return (
        <AppBar

            sx={{
                backgroundColor: 'black',
                width: '100vw',
                margin: 0,
                padding: 0,
            }}

        >
            <Toolbar sx={{ justifyContent: 'space-between', width: '100%' }}>

                <Typography  variant="h6" component="div" sx={{ flexGrow: 0 }}>
                    <Link to="/home" style={{textDecoration: 'none', color: 'inherit'}}>
                        <img data-testid='topbar' src={iqsignlogo} alt="Logo" style={{height: '40px'}}/>
                    </Link>
                </Typography>


                <Box
                    sx={{
                        flexGrow: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Box
                        sx={{
                            position: 'relative',
                            borderRadius: 1,
                            backgroundColor: alpha('#ffffff', 0.15),
                            '&:hover': {
                                backgroundColor: alpha('#ffffff', 0.25),
                            },
                            width: '50%',
                            maxWidth: '400px',
                        }}
                    >
                        {showSearchBox && <InputBase
                            placeholder="Filter..."
                            value={filter}
                            onChange={(e)=> setFilter(e.target.value)}
                            inputProps={{ 'aria-label': 'search' }}
                            sx={{
                                color: 'inherit',
                                padding: '6px 12px',
                                width: '100%',
                            }}
                        />}
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};


export default TopBar;
