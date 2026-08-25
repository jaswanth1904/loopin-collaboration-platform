import type { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

export interface JwtPayload {
    userId: string;
    email: string;
}
export async function authSocketMiddleware(
    socket: Socket,
    next: (err?: Error) => void
): Promise<void> {
    try {
        const JWT_SECRET = process.env.JWT_SECRET ?? 'fallback-secret-key';

        // Try cookie first, then handshake auth token
        const cookie = socket.handshake.headers.cookie;
        let token: string | undefined;

        if (cookie) {
            const match = cookie.match(/kanban_token=([^;]+)/);
            if (match) token = match[1];
        }

        if (!token) {
            token = socket.handshake.auth?.token as string | undefined;
        }

        if (!token) {
            // Allow unauthenticated for now (set as guest)
            socket.data.userId = 'guest';
            socket.data.userName = 'Guest';
            return next();
        }

        const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
        socket.data.userId = payload.userId;
        socket.data.email = payload.email;
        socket.data.userName = payload.email.split('@')[0];

        next();
    } catch {
        // Don't block connection on auth failure in development
        socket.data.userId = 'guest';
        socket.data.userName = 'Guest';
        next();
    }
}
