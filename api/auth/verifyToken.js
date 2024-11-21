import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();  // Initialisation de Redis avec les variables d'environnement

export default async function handler(request) {
    try {
        const token = request.headers.get('Authorization')?.split(' ')[1];

        if (!token) {
            return new Response(JSON.stringify({ message: "Token required" }), {
                status: 401,
                headers: { 'content-type': 'application/json' },
            });
        }

        // Vérifier si le token est présent dans Upstash KV
        const user = await redis.get(token);

        if (!user) {
            return new Response(JSON.stringify({ message: "Invalid token" }), {
                status: 401,
                headers: { 'content-type': 'application/json' },
            });
        }

        // Le token est valide, renvoyer les informations de l'utilisateur
        return new Response(JSON.stringify({ message: "Token is valid", user: JSON.parse(user) }), {
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
