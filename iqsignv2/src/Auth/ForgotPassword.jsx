import React from "react";
import {Box, TextField, Button, Typography, Toolbar, Link} from "@mui/material";
import TopBar from "../Topbar/TopBar.jsx";
import {useNavigate} from "react-router-dom";

export default function ForgotPassword() {
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
                    label="Email"
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
                    onClick={()=>navigate("/resetpw")}
                >
                    Continue
                </Button>

            </Box>
        </div>
    );
}
