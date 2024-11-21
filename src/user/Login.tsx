import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import { loginUser } from "./loginApi";
import { Session } from "../model/common";
import { CustomError } from "../model/CustomError";
import { TextField, Button, Typography, Container, Box } from "@mui/material";

export function Login() {
    const [error, setError] = useState<CustomError | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const navigate = useNavigate(); // Initialize the navigate function

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const user = {
            username: formData.get('username') as string,
            password: formData.get('password') as string,
        };

        loginUser(user, 
            (result: Session) => {
                setSession(result);
                setError(null);
                // After successful login, redirect to /chat
                navigate("/chat");
            }, 
            (err: CustomError) => {
                setError(err);
                setSession(null);
            });
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ mt: 20 }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 2,
                border: '1px solid #ddd',
                borderRadius: 2,
                boxShadow: 2
            }}>
                <Typography variant="h5" gutterBottom>Login</Typography>

                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            name="username"
                            label="Username"
                            variant="outlined"
                            fullWidth
                            required
                        />
                        <TextField
                            name="password"
                            label="Password"
                            variant="outlined"
                            type="password"
                            fullWidth
                            required
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Login
                        </Button>
                    </Box>
                </form>

                {session && <Typography variant="body2" color="green" sx={{ mt: 2 }}>Welcome back, {session.username}!</Typography>}
                {error && <Typography variant="body2" color="error" sx={{ mt: 2 }}>{error.message}</Typography>}
            </Box>
        </Container>
    );
}
