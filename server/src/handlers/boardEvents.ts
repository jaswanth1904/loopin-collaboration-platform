import type { Server, Socket } from 'socket.io';
import { z } from 'zod';

const socketCardMovedSchema = z.object({
    cardId: z.string(),
    fromColumnId: z.string(),
    toColumnId: z.string(),
    newOrderIndex: z.number(),
    boardId: z.string(),
});

const socketColumnMovedSchema = z.object({
    columnId: z.string(),
    newOrderIndex: z.number(),
    boardId: z.string(),
});

const socketMeetingStartedSchema = z.object({
    boardId: z.string(),
    userName: z.string(),
    roomName: z.string(),
});

const socketChatMessageSchema = z.object({
    boardId: z.string(),
    message: z.object({
        id: z.string(),
        user: z.string(),
        avatar: z.string(),
        content: z.string(),
        timestamp: z.string(),
        isMe: z.boolean().optional(),
    }),
});

export function registerBoardEvents(io: Server, socket: Socket): void {
    // Join a board room
    socket.on('join:board', (payload: { boardId: string; userId: string }) => {
        if (!payload.boardId) return;
        socket.join(`board:${payload.boardId}`);
        console.log(`[Board] User ${payload.userId} joined board:${payload.boardId}`);
    });

    // Leave a board room
    socket.on('leave:board', (payload: { boardId: string; userId: string }) => {
        if (!payload.boardId) return;
        socket.leave(`board:${payload.boardId}`);
        console.log(`[Board] User ${payload.userId} left board:${payload.boardId}`);
    });

    // Card moved event — validate and broadcast
    socket.on('card:moved', (payload: unknown, ack?: (res: { ok: boolean; error?: string }) => void) => {
        const parsed = socketCardMovedSchema.safeParse(payload);
        if (!parsed.success) {
            ack?.({ ok: false, error: 'Invalid payload' });
            return;
        }
        // Broadcast to all OTHER clients in the board room
        socket.to(`board:${parsed.data.boardId}`).emit('card:moved', {
            ...parsed.data,
            movedBy: socket.data.userId,
        });
        ack?.({ ok: true });
    });

    // Column moved/reordered event
    socket.on('column:moved', (payload: unknown, ack?: (res: { ok: boolean; error?: string }) => void) => {
        const parsed = socketColumnMovedSchema.safeParse(payload);
        if (!parsed.success) {
            ack?.({ ok: false, error: 'Invalid payload' });
            return;
        }
        socket.to(`board:${parsed.data.boardId}`).emit('column:moved', {
            ...parsed.data,
            movedBy: socket.data.userId,
        });
        ack?.({ ok: true });
    });

    // Board-level event (generic broadcast for future use)
    socket.on('board:updated', (payload: { boardId: string }) => {
        if (!payload.boardId) return;
        socket.to(`board:${payload.boardId}`).emit('board:updated', { boardId: payload.boardId });
    });

    // Meeting started event
    socket.on('meeting:started', (payload: unknown) => {
        const parsed = socketMeetingStartedSchema.safeParse(payload);
        if (!parsed.success) return;

        socket.to(`board:${parsed.data.boardId}`).emit('meeting:started', parsed.data);
    });

    // Real-time Chat event
    socket.on('chat:message', (payload: unknown) => {
        const parsed = socketChatMessageSchema.safeParse(payload);
        if (!parsed.success) return;

        socket.to(`board:${parsed.data.boardId}`).emit('chat:message', parsed.data.message);
    });
}
