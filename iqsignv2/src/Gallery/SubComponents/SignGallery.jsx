import React, {useEffect, useState} from 'react';
import { Box, Grid, IconButton, Modal, Tabs, Tab, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useGalleryStore } from '../hooks/galleryStore.jsx';
import FileUpload from './FileUpload.jsx';
import {useNavigate} from "react-router-dom";

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
                <Grid item xs={4} sx={{ display: 'flex', flexGrow: 1 }}>
                    <Box
                        sx={{
                            width: '100%',
                            height: '200px',
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
                                    width: '100%',
                                    height: '200px',
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
                                        width: '50%',
                                        height: 'auto',
                                        ml: 'auto',
                                        mr: 'auto',
                                        mb: 1,
                                        borderRadius: 1,
                                        objectFit: 'cover',
                                    }}
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
