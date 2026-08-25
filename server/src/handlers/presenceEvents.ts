import type { Server, Socket } from 'socket.io';

interface PresenceJoinPayload {
    userId: string;
    boardId: string;
    color: string;
}

interface CursorPayload {
    userId: string;
    boardId: string;
    x: number;
    y: number;
}

export function registerPresenceEvents(io: Server, socket: Socket): void {
    // User joins board — announce to others
    socket.on('presence:join', (payload: PresenceJoinPayload) => {
        if (!payload.boardId) return;

        socket.to(`board:${payload.boardId}`).emit('presence:join', {
            userId: socket.data.userId ?? payload.userId,
            userName: socket.data.userName ?? 'Unknown',
            avatarUrl: socket.data.avatarUrl ?? null,
            boardId: payload.boardId,
            color: payload.color,
        });
    });

    // Cursor position update — throttled on the client side already
    socket.on('presence:cursor', (payload: CursorPayload) => {
        if (!payload.boardId) return;
        socket.to(`board:${payload.boardId}`).emit('presence:cursor', {
            userId: socket.data.userId ?? payload.userId,
            x: payload.x,
            y: payload.y,
        });
    });

    // Handle disconnection — notify board members
    socket.on('disconnecting', () => {
        const userId = socket.data.userId;
        if (!userId) return;

        for (const room of socket.rooms) {
            if (room.startsWith('board:')) {
                socket.to(room).emit('presence:leave', { userId });
            }
        }
    });
}
