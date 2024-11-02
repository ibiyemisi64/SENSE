import React from 'react';
import { AppBar, Toolbar, Typography, Box, InputBase, Container } from '@mui/material';
import { alpha } from '@mui/material/styles';

const TopBar = () => {
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
                {/* Logo/Text */}
                <Typography variant="h6" component="div" sx={{ flexGrow: 0 }}>
                    IQSign
                </Typography>

                {/* Centered Search Bar */}
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
                        <InputBase
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                            sx={{
                                color: 'inherit',
                                padding: '6px 12px',
                                width: '100%',
                            }}
                        />
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;
