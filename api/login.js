import { db } from '@vercel/postgres';
import { Redis } from '@upstash/redis';
import { arrayBufferToBase64, stringToArrayBuffer } from "../lib/base64"; // Assuming this is the same lib

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    try {
        const { username, password } = await request.json();

        // Database and Redis setup
        const client = await db.connect();
        const redis = Redis.fromEnv();

        // Query for the user by username
        const result = await client.sql`SELECT * FROM users WHERE username = ${username}`;

        if (result.rowCount === 0) {
            return new Response(JSON.stringify({ message: "User not found" }), {
                status: 404,
                headers: { 'content-type': 'application/json' },
            });
        }

        const user = result.rows[0];

        // Hash the provided password and compare with the stored hash
        const hashedPassword = await crypto.subtle.digest('SHA-256', stringToArrayBuffer(username + password));
        const hashed64 = arrayBufferToBase64(hashedPassword);

        if (user.password !== hashed64) {
            return new Response(JSON.stringify({ message: "Invalid password" }), {
                status: 401,
                headers: { 'content-type': 'application/json' },
            });
        }

        // Generate a session token and store it in Upstash Redis
        const token = crypto.randomUUID().toString();
        const newUser = { username, email: user.email, externalId: user.external_id };

        // Store session in Redis with a TTL of 1 hour
        await redis.set(token, JSON.stringify(newUser), { ex: 3600 });

        return new Response(JSON.stringify({ token, username, email: user.email , redirectUrl: "/chat" }), {
            status: 200,
            headers: { 'content-type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: "Server error" }), {
            status: 500,
            headers: { 'content-type': 'application/json' },
        });
    }
}
