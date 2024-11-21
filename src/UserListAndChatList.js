import React, { useState, useEffect } from "react";
import { Box, List, ListItem, ListItemButton, Typography, Divider } from "@mui/material";

export default function UserListAndChatList({ onSelectChat }) {
    const [users, setUsers] = useState([]);
    const [chats, setChats] = useState([]);

    useEffect(() => {
        // Load users and chat rooms (API call can be made here)
        setUsers([
            { id: 1, name: "John Doe" },
            { id: 2, name: "Jane Smith" },
            // Add users dynamically or via an API
        ]);
        setChats([
            { id: 1, name: "Salon 1" },
            { id: 2, name: "Salon 2" },
            // Add chat rooms dynamically or via an API
        ]);
    }, []);

    return (
        <Box sx={{ padding: 2, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>Utilisateurs</Typography>
            <List sx={{ marginBottom: 3 }}>
                {users.map(user => (
                    <ListItem key={user.id} disablePadding>
                        <ListItemButton onClick={() => onSelectChat(user)}>
                            <Typography variant="body1">{user.name}</Typography>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Divider />

            <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 2 }}>Salons de discussion</Typography>
            <List>
                {chats.map(chat => (
                    <ListItem key={chat.id} disablePadding>
                        <ListItemButton onClick={() => onSelectChat(chat)}>
                            <Typography variant="body1">{chat.name}</Typography>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}
