/***
 * ResetPassword.jsx
 *
 * Purpose: Allows user to reset password, not fully implemented, needs forgot password to be implemented first.
 *
 *
 * Copyright 2024 Brown University -- Shufan He
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
import React from "react";
import { Box, TextField, Button, Typography, Toolbar } from "@mui/material";
import TopBar from "../Topbar/TopBar.jsx";
import {useNavigate} from "react-router-dom";

export default function ResetPassword() {
    const navigate = useNavigate();
    return (
        <div style={{ height: "100vh", backgroundColor: "#fff", display: "flex", flexDirection: "column" }}>
            <TopBar/>

            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                }}
            >
                <TextField
                    label="New Password"
                    variant="outlined"
                    fullWidth
                    sx={{
                        maxWidth: 400,
                        marginBottom: 3,
                        "& .MuiInputBase-input": {
                            fontSize: "1rem",
                        },
                    }}
                />

                <TextField
                    label="Re-enter Password"
                    variant="outlined"
                    fullWidth
                    sx={{
                        maxWidth: 400,
                        marginBottom: 3,
                        "& .MuiInputBase-input": {
                            fontSize: "1rem",
                        },
                    }}
                />

                <Button
                    variant="contained"
                    sx={{
                        maxWidth: 400,
                        width: "100%",
                        backgroundColor: "#000",
                        color: "#fff",
                        textTransform: "none",
                        borderRadius: 1,
                        padding: "10px 0",
                        fontSize: "1rem",
                        ":hover": {
                            backgroundColor: "#333",
                        },
                    }}
                    onClick={()=>navigate("/login")}
                >
                    Confirm
                </Button>

            </Box>
        </div>
    );
}
