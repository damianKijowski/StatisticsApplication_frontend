import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import { TextField, Button, Typography, Box, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    // Handle form input changes
    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    // Handle form submission
    const handleLogin = async (e) => {
        e.preventDefault();

        const requestData = {
            name: username,
            password: password,
        };

        try {
            console.log(requestData);
            const response = await axios.post("http://localhost:8080/user/login", requestData);

            // Handle success - assuming backend returns a token or user info
            console.log("Login successful:", response.data);
            console.log("DATA: " + response.data)
            if (response.data.id !== null) {
                const user = response.data;
                localStorage.setItem("user", JSON.stringify(user));
                console.log(user);
                onLogin(user);
                alert("Login successful!");
                navigate("/MainPage");
            }
        } catch (error) {
            // Handle error (e.g., incorrect credentials)
            console.error("Login failed:", error);
            setErrorMessage("Invalid username or password.");
        }
    };

    return (
        <Box className="login-container">
            <Paper elevation={3} className="login-paper">
                <Typography variant="h4" className="login-title">
                    Login
                </Typography>
                <form onSubmit={handleLogin} className="login-form">
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={handleUsernameChange}
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    <Button variant="contained" color="primary" type="submit" className="login-button">
                        Login
                    </Button>
                </form>
                {errorMessage && <Typography color="error">{errorMessage}</Typography>}
            </Paper>
        </Box>
    );
}

export default Login;
