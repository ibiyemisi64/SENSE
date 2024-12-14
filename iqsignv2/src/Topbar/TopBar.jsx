/***
 * TopBar.jsx
 *
 * Purpose: Visual clarity with a logo, search bar functionality for potential filtering.
 * Logo serves as a link to get back to the home page.
 *
 *
 * Copyright 2024 Brown University -- Jason Silva
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
import React from 'react';
import {AppBar, Toolbar, Typography, Box, InputBase, Container, Button} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Link } from 'react-router-dom';

import {useGalleryStore} from "../Gallery/hooks/galleryStore.jsx";

import iqsignlogo from '../assets/icon/iqsignlogo-white.png';


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
