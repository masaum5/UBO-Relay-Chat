import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import UserListAndChatList from "./UserListAndChatList";
import MessageList from "./MessageList";

export default function ChatApp() {
    const [selectedChat, setSelectedChat] = useState(null);

    const handleSelectChat = (chat) => {
        setSelectedChat(chat); // Update the selected chat
    };

    // Mark handleLogout as async to use await inside it
    const handleLogout = async () => {
        try {
            // Make a request to the logout API endpoint
            const response = await fetch("/api/auth/logout", {
                method: "POST", // POST or GET depending on your API
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`, // If token is stored in localStorage
                },
            });

            const data = await response.json();

            if (response.ok) {
                // Handle successful logout (e.g., redirect to login page, clear user data)
                console.log("Logout success:", data.message);
                // You can redirect the user to the login page or clear the user data from the state
                window.location.href = "/login"; // Redirect to login page
            } else {
                console.error("Logout failed:", data.message);
                alert(data.message || "Logout failed");
            }
        } catch (error) {
            console.error("Error logging out:", error);
            alert("An error occurred while logging out.");
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            {/* Navbar */}
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        UBO Relay Chat
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>
                        Déconnexion
                    </Button>
                </Toolbar>
            </AppBar>

            <Box sx={{ display: "flex", flex: 1 }}>
                <div className="sidebar" style={{ width: "300px" }}>
                    <UserListAndChatList onSelectChat={handleSelectChat} />
                </div>
                <div className="main-content" style={{ flex: 1 }}>
                    {selectedChat ? (
                        <MessageList selectedChat={selectedChat} />
                    ) : (
                        <p>Sélectionnez un utilisateur ou un salon pour commencer la conversation.</p>
                    )}
                </div>
            </Box>
        </Box>
    );
}
