import React, { useState, useEffect } from "react";
import { Box, List, ListItem, ListItemButton, Typography, Divider } from "@mui/material";

export default function UserListAndChatList({ onSelectChat }) {
    const [users, setUsers] = useState([]);
    const [chats, setChats] = useState([]);

    useEffect(() => {
        // Simulate user and chat data (you would likely fetch this from an API)
        setUsers([
            { id: 1, name: "John Doe" },
            { id: 2, name: "Jane Smith" },
        ]);
        setChats([
            { id: 1, name: "Salon 1" },
            { id: 2, name: "Salon 2" },
        ]);
    }, []);

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h6">Utilisateurs</Typography>
            <List>
                {users.length > 0 ? (
                    users.map(user => (
                        <ListItem key={user.id}>
                            <ListItemButton onClick={() => onSelectChat(user)}>
                                <Typography>{user.name}</Typography>
                            </ListItemButton>
                        </ListItem>
                    ))
                ) : (
                    <Typography>No users available</Typography>
                )}
            </List>

            <Divider sx={{ marginY: 2 }} />

            <Typography variant="h6">Salons de discussion</Typography>
            <List>
                {chats.length > 0 ? (
                    chats.map(chat => (
                        <ListItem key={chat.id}>
                            <ListItemButton onClick={() => onSelectChat(chat)}>
                                <Typography>{chat.name}</Typography>
                            </ListItemButton>
                        </ListItem>
                    ))
                ) : (
                    <Typography>No chats available</Typography>
                )}
            </List>
        </Box>
    );
}
