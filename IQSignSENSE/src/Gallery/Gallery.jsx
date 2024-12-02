import React from 'react';
import {Box, Grid, IconButton, Stack} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { create } from 'zustand';

import {useGalleryStore} from "./hooks/galleryStore.jsx";
import SignGallery from "./SubComponents/SignGallery.jsx";
import TopBar from "../Topbar/TopBar.jsx";


const Gallery = () => {
    return <Stack sx={{overflowY:'hidden', overflowX:'hidden'}} gap={2}>
        <TopBar showSearchBox={true}></TopBar>
        <SignGallery></SignGallery>
    </Stack>
}

export default Gallery;
