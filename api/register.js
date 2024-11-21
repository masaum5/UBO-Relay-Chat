import { db } from '@vercel/postgres';
import { Redis } from '@upstash/redis';
import { arrayBufferToBase64, stringToArrayBuffer } from "../lib/base64";  // Utilisez votre lib pour la conversion

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    try {
        const { username, email, password } = await request.json();

        // Database and Redis setup
        const client = await db.connect();
        const redis = Redis.fromEnv();

        // Check if user exists
        const existingUser = await client.sql`SELECT * FROM users WHERE username = ${username} OR email = ${email}`;
        if (existingUser.rowCount > 0) {
            return new Response(JSON.stringify({ code: "USER_EXISTS", message: "Username or email already exists" }), {
                status: 409,
                headers: { 'content-type': 'application/json' },
            });
        }

        // Hash password and create user
        const hash = await crypto.subtle.digest('SHA-256', stringToArrayBuffer(username + password));
        const hashed64 = arrayBufferToBase64(hash);
        const externalId = crypto.randomUUID().toString();

        // Insert user into DB
        await client.sql`
        INSERT INTO users (username, email, password, external_id, created_on)
        VALUES (${username}, ${email}, ${hashed64}, ${externalId}, CURRENT_TIMESTAMP)
    `;
    

        // Generate a session token and store it in Upstash Redis
        const token = crypto.randomUUID().toString();
        const newUser = { username, email, externalId };

        // Store session in Redis with a TTL of 1 hour
        await redis.set(token, JSON.stringify(newUser), { ex: 3600 });

        return new Response(JSON.stringify({ token, username, externalId , redirectUrl: "/chat" }), {
            status: 201,
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
