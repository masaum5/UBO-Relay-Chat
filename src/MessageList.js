import React, { useState } from "react";
import { Box, TextField, Button, List, ListItem, Typography } from "@mui/material";

export default function MessageList({ selectedChat }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    const handleSendMessage = async () => {
        if (newMessage.trim()) {
            const messageData = {
                sender: "You", 
                text: newMessage,
                // Assuming selectedChat has the ID or some identifier
                chatId: selectedChat.id, 
                date: new Date().toISOString(), // You can format this as needed
            };
            
            try {
                // Send message to the serverless function
                const response = await fetch('/api/messages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(messageData),
                });
   
                const data = await response.json();
                
                if (response.ok) {
                    // Add the message to the local state after successful sending
                    setMessages([...messages, { id: messages.length + 1, ...messageData }]);
                    setNewMessage(""); // Reset message input
                } else {
                    console.error("Error sending message:", data.message);
                }
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
    };
   

    return (
        <Box>
            <List sx={{ maxHeight: 400, overflowY: 'auto', marginBottom: 2 }}>
                {messages.map((message) => (
                    <ListItem key={message.id}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{message.sender}:</Typography>
                        <Typography variant="body1">{message.text}</Typography>
                    </ListItem>
                ))}
            </List>

            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                    variant="outlined"
                    fullWidth
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Écrivez un message..."
                    sx={{ flexGrow: 1 }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSendMessage}
                    sx={{ height: '100%' }}
                >
                    Envoyer
                </Button>
            </Box>
        </Box>
    );
}
