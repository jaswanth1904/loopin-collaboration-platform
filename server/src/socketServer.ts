import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { authSocketMiddleware } from './middlewares/authSocketMiddleware';
import { registerBoardEvents } from './handlers/boardEvents';
import { registerPresenceEvents } from './handlers/presenceEvents';

const app = express();
const httpServer = createServer(app);

const NEXT_APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

app.use(cors({ origin: NEXT_APP_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const io = new Server(httpServer, {
    cors: {
        origin: NEXT_APP_URL,
        credentials: true,
        methods: ['GET', 'POST'],
    },
    pingTimeout: 60000,
    pingInterval: 25000,
});

// Auth middleware on socket connection
io.use(authSocketMiddleware);

// Socket connection handler
io.on('connection', (socket) => {
    console.log(`[Socket] Connected: ${socket.id} | User: ${socket.data.userId}`);

    registerBoardEvents(io, socket);
    registerPresenceEvents(io, socket);

    socket.on('disconnect', (reason) => {
        console.log(`[Socket] Disconnected: ${socket.id} | Reason: ${reason}`);
    });

    socket.on('error', (error) => {
        console.error(`[Socket] Error: ${socket.id}`, error);
    });
});

const PORT = parseInt(process.env.PORT ?? '3001', 10);
httpServer.listen(PORT, () => {
    console.log(`⚡ Socket.io server running on http://localhost:${PORT}`);
});

export { io };
