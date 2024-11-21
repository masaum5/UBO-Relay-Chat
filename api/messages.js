import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(request, response) {
    try {
        const { senderId, receiverId } = request.query;

        if (!senderId || !receiverId) {
            return response.status(400).json({ message: 'Sender and receiver are required' });
        }

        const conversationKey1 = `conversation:${senderId}:${receiverId}`;
        const conversationKey2 = `conversation:${receiverId}:${senderId}`;

        // Fetch messages from Redis
        const messages1 = await redis.lrange(conversationKey1, 0, -1);
        const messages2 = await redis.lrange(conversationKey2, 0, -1);

        // Merge and parse messages
        const messages = [...new Set([...messages1, ...messages2])].map(msg => JSON.parse(msg));

        return response.status(200).json({ messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        return response.status(500).json({ message: 'Server error' });
    }
}
