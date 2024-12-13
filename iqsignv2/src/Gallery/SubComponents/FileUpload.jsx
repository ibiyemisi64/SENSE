import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
/*
 *      FileUpload.jsx
 *
 *   Handles file uploads
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
