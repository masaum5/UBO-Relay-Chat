import React, { useState } from "react";
import { Box, TextField, Button, List, ListItem, Typography } from "@mui/material";

export default function MessageList({ selectedChat }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    const handleSendMessage = async () => {
        if (newMessage.trim()) {
            // Ensure you are passing both sender and receiver
            const messageData = {
                sender: "You",                // The sender is hardcoded to "You", change this if you have user data
                receiver: selectedChat.receiver, // Ensure `receiver` exists in `selectedChat`
                text: newMessage,
                chatId: selectedChat.id,      // Chat ID should be from the selectedChat
                date: new Date().toISOString(),
            };

            console.log("Sending message:", messageData); // Check what you're sending

            try {
                const response = await fetch('/api/messages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(messageData),
                });

                const data = await response.json();
                console.log("Response from server:", data); // Check server response

                if (response.ok) {
                    setMessages(prevMessages => [
                        ...prevMessages,
                        { id: data.id, sender: "You", text: data.text, date: data.date }
                    ]);
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
