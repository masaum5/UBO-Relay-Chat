import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(request, response) {
    try {
        console.log("Logout function triggered.");

        // Get the token from the Authorization header or cookies
        const authorizationHeader = request.headers['authorization'];
        const token = authorizationHeader?.split(' ')[1] || getCookie(request, 'token');

        if (!token) {
            console.log("No token provided.");
            return response.status(401).json({ message: "Token required" });
        }

        // Delete the token from Redis
        console.log("Deleting token from Redis...");
        await redis.del(token);
        console.log("Token deleted successfully.");

        // Set the cookie to expire
        response.setHeader(
            "Set-Cookie",
            "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; HttpOnly; SameSite=Strict"
        );

        // Respond with success
        return response.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        return response.status(500).json({ message: "Server error" });
    }
}

// Helper function to get a cookie value by name
function getCookie(request, name) {
    const cookies = request.headers.cookie;
    if (!cookies) return null;

    const cookieList = cookies.split(';').map(cookie => cookie.trim());
    const cookie = cookieList.find(cookie => cookie.startsWith(name + '='));

    return cookie ? cookie.split('=')[1] : null;
}
