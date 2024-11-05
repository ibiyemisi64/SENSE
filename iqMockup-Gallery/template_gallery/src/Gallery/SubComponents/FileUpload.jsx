import React, { useState } from 'react';
import { Box, Button } from '@mui/material';

const FileUpload = ({ onUpload }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };


    const handleUpload = () => {
        if (selectedFile) {
            onUpload(selectedFile);
            setSelectedFile(null);
            setPreviewUrl(null);
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

            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                id="file-input"
                style={{ display: 'none' }}
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
                                width: '100%',
                                maxWidth: '300px',
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
