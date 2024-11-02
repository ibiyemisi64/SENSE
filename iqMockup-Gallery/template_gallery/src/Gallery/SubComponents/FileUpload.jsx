import React, { useState } from 'react';
import { Box, Button } from '@mui/material';

const FileUpload = ({ onUpload }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // Handle file selection
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file)); // Create a preview URL for the selected image
        }
    };

    // Handle file upload
    const handleUpload = () => {
        if (selectedFile) {
            onUpload(selectedFile);
            setSelectedFile(null); // Reset the file selection
            setPreviewUrl(null); // Clear the preview
        }
    };

    return (
        <Box
            sx={{
                border: '1px solid #ddd',
                p: 2,
                textAlign: 'center',
                borderRadius: '8px',
                backgroundColor: '#f9f9f9',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            }}
        >
            {/* Styled input and label */}
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                id="file-input"
                style={{ display: 'none' }} // Hide the default input
            />
            <label htmlFor="file-input">
                <Button variant="outlined" component="span">
                    Choose File
                </Button>
            </label>

            {selectedFile && (
                <Box sx={{ mb: 2 }}>
                    <p style={{ color: '#555' }}>Selected File: {selectedFile.name}</p>
                    {previewUrl && (
                        <Box
                            component="img"
                            src={previewUrl}
                            alt="Selected Preview"
                            sx={{
                                width: '100%', // Set width to 100% of the container
                                maxWidth: '300px', // You can adjust this value for your layout
                                height: 'auto',
                                borderRadius: '4px',
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                                display: 'block',
                                margin: '0 auto 16px',
                            }}
                        />
                    )}
                </Box>
            )}

            {/* Conditionally render the Upload Image button */}
            {selectedFile && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpload}
                >
                    Upload Image
                </Button>
            )}
        </Box>
    );
};

export default FileUpload;
