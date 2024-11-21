import { getConnecterUser, triggerNotConnected } from "../lib/session";
import { Redis } from '@upstash/redis';  // Redis client
// const PushNotifications = require("@pusher/push-notifications-server");

const redis = Redis.fromEnv();  // Initialize Redis from environment variables

export default async (request, response) => {
    try {
        const headers = new Headers(request.headers);
        const user = await getConnecterUser(request);
        
        if (user === undefined || user === null) {
            console.log("Not connected");
            triggerNotConnected(response);
            return;
        }

        const { senderId, receiverId, message } = await request.json(); // Parse JSON request body

        if (!senderId || !receiverId || !message) {
            return response.status(400).json({ message: 'Sender, receiver, and message content are required' });
        }

        // Create unique conversation keys
        const conversationKey1 = `conversation:${senderId}:${receiverId}`;
        const conversationKey2 = `conversation:${receiverId}:${senderId}`;

        // Store the message in Redis using LPUSH
        await redis.lpush(conversationKey1, JSON.stringify({ senderId, message, timestamp: new Date().toISOString() }));
        await redis.lpush(conversationKey2, JSON.stringify({ senderId, message, timestamp: new Date().toISOString() }));

        // Set message expiration to 24 hours
        await redis.expire(conversationKey1, 86400);  // 24 hours in seconds
        await redis.expire(conversationKey2, 86400);

        response.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error);
        response.status(500).json({ message: 'Server error' });
    }
};
