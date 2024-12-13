/***
 * SignGallery.jsx
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
 ***/
import React, {useEffect, useState} from 'react';
import { Box, Grid, IconButton, Modal, Tabs, Tab, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useGalleryStore } from '../hooks/galleryStore.jsx';
import FileUpload from './FileUpload.jsx';
import {useNavigate} from "react-router-dom";

/*
 *      SignGallery.jsx
 *
 *    Main logic for the sign gallery, includes all images, logic
 *      for creating new signs, and logic for fetching images
 *
 */
/*	Copyright 2024 Brown University -- Jason S. Silva			*/
/// *******************************************************************************
///  Copyright 2024, Brown University, Providence, RI.				 *
///										 *
///			  All Rights Reserved					 *
///										 *
///  Permission to use, copy, modify, and distribute this software and its	 *
///  documentation for any purpose other than its incorporation into a		 *
///  commercial product is hereby granted without fee, provided that the 	 *
///  above copyright notice appear in all copies and that both that		 *
///  copyright notice and this permission notice appear in supporting		 *
///  documentation, and that the name of Brown University not be used in 	 *
///  advertising or publicity pertaining to distribution of the software 	 *
///  without specific, written prior permission. 				 *
///										 *
///  BROWN UNIVERSITY DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS		 *
///  SOFTWARE, INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND		 *
///  FITNESS FOR ANY PARTICULAR PURPOSE.  IN NO EVENT SHALL BROWN UNIVERSITY	 *
///  BE LIABLE FOR ANY SPECIAL, INDIRECT OR CONSEQUENTIAL DAMAGES OR ANY 	 *
///  DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS,		 *
///  WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS		 *
///  ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE 	 *
///  OF THIS SOFTWARE.								 *
///										 *
///******************************************************************************


// styles
const scrollStyles = {
    '&::-webkit-scrollbar': {
        width: '6px',
    },
    '&::-webkit-scrollbar-track': {
        backgroundColor: '#f0f0f0',
        borderRadius: '10px',
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#c0c0c0',
        borderRadius: '10px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
        backgroundColor: '#a0a0a0',
    },
};

const SignGallery = () => {
    const { namedSignMock, images, addImage,loadImages, loadMockImages,names, filter } = useGalleryStore();
    const [open, setOpen] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);
    const navigate = useNavigate();
    useEffect(()=> {
        loadImages();
        namedSignMock();
    },[])
    console.log(images);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleTabChange = (event, newValue) => setTabIndex(newValue);

    const handleImageUpload = (file) => {
        const fileUrl = URL.createObjectURL(file);
        addImage(fileUrl);
        handleClose();
    };


    const filteredImages = images.filter((_, index) =>
        names[index]?.toLowerCase().includes(filter.toLowerCase())
    );

    console.log("FILTERED IMAGES", filteredImages);
    console.log("NAMES", names);

    return (
        <Box
            sx={{
                width: '100%',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Grid
                container
                columnSpacing={2}
                rowSpacing={2}
                sx={{
                    width: '75%',
                    maxHeight: '75%',
                    overflowY: 'auto',
                    ...scrollStyles,
                }}
            >
                <Grid item xs={4} sx={{ display: 'flex', flexDirection:'column', alignItems:'center' }}>
                    <Box
                        sx={{
                            width: '300px',
                            height: '150px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px dotted black',
                            borderRadius: 1,
                            cursor: 'pointer',
                        }}
                        onClick={handleOpen}
                    >
                        <IconButton aria-label="add new sign">
                            <AddIcon fontSize="large" />
                        </IconButton>
                    </Box>
                    <Box
                        component="span"
                        sx={{
                            mt: 1,
                        }}
                    >
                        <Typography>
                            Add Sign
                        </Typography>
                    </Box>
                </Grid>
                {filteredImages.map((image, index) => (
                    <Grid item xs={4} key={index}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            {/* Image */}
                            <Box
                                component="img"
                                src={image}
                                alt={`${names[index]}`}
                                sx={{
                                    width: '300px',
                                    height: '150px',
                                    borderRadius: 1,
                                    objectFit: 'cover',
                                    boxShadow: 3,
                                }}
                                onClick={() => navigate("/edit")}
                            />

                            {/* Label */}
                            <Box
                                component="span"
                                sx={{
                                    mt: 1,
                                    fontSize: '24px',
                                    color: 'text.primary',
                                    textAlign: 'center',
                                    wordWrap: 'break-word',
                                    width: '100%',
                                }}
                            >
                                <Typography>
                                {names[index]}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                ))}
            </Grid>

            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '50%',
                        maxHeight: '80vh',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 2,
                        borderRadius: 2,
                        overflow: 'scroll',
                        ...scrollStyles,
                    }}
                >
                    <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        <Tabs value={tabIndex} onChange={handleTabChange}>
                            <Tab label="Upload Image" />
                            <Tab label="Image List" />
                        </Tabs>
                    </Box>

                    {tabIndex === 0 && (
                        <Box sx={{ mt: 2 }}>
                            <FileUpload onUpload={handleImageUpload} />
                        </Box>
                    )}

                    {tabIndex === 1 && (
                        <Stack
                            direction="column"
                            sx={{
                                mt: 2,
                                overflowY: 'hidden',
                                width: '100%',
                            }}
                        >
                            {images.map((image, index) => (
                                <Box
                                    key={index}
                                    component="img"
                                    src={image}
                                    alt={`Image ${index + 1}`}
                                    sx={{
                                        width: '300px',
                                        height: '150px',
                                        ml: 'auto',
                                        mr: 'auto',
                                        mb: 1,
                                        borderRadius: 1,
                                        objectFit: 'cover',
                                    }}
                                    onClick={()=> navigate("/edit")}
                                />
                            ))}
                        </Stack>
                    )}
                </Box>
            </Modal>
        </Box>
    );
};

export default SignGallery;
