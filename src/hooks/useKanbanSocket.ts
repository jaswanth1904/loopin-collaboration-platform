'use client';

import { useEffect, useRef } from 'react';
import { getSocket } from '@/lib/socket';
import { useBoardStore } from '@/stores/useBoardStore';
import type {
    SocketCardMovedPayload,
    SocketColumnMovedPayload,
    SocketPresencePayload,
} from '@/types/kanban.types';

const PRESENCE_COLORS = [
    '#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#10b981',
];

export function useKanbanSocket(boardId: string, userId: string) {
    const { moveCard, moveColumn, addPresence, removePresence, updateCursor } = useBoardStore();
    const socketRef = useRef(getSocket());

    useEffect(() => {
        const socket = socketRef.current;
        const color = PRESENCE_COLORS[Math.floor(Math.random() * PRESENCE_COLORS.length)];

        socket.connect();

        socket.emit('join:board', { boardId, userId });

        socket.on('card:moved', (payload: SocketCardMovedPayload) => {
            if (payload.movedBy !== userId) {
                moveCard(payload.cardId, payload.fromColumnId, payload.toColumnId, payload.newOrderIndex);
            }
        });

        socket.on('column:moved', (payload: SocketColumnMovedPayload) => {
            if (payload.movedBy !== userId) {
                // Handled by board refetch
            }
        });

        socket.on('presence:join', (payload: SocketPresencePayload) => {
            if (payload.userId !== userId) {
                addPresence({
                    userId: payload.userId,
                    userName: payload.userName,
                    avatarUrl: payload.avatarUrl,
                    x: 0,
                    y: 0,
                    color: payload.color,
                });
            }
        });

        socket.on('presence:leave', (payload: { userId: string }) => {
            removePresence(payload.userId);
        });

        socket.on('presence:cursor', (payload: { userId: string; x: number; y: number }) => {
            if (payload.userId !== userId) {
                updateCursor(payload.userId, payload.x, payload.y);
            }
        });

        // Broadcast own presence
        const userColor = color;
        socket.emit('presence:join', {
            userId,
            boardId,
            color: userColor,
        });

        // Cursor tracking with debounce
        let cursorTimer: ReturnType<typeof setTimeout>;
        const handleMouseMove = (e: MouseEvent) => {
            clearTimeout(cursorTimer);
            cursorTimer = setTimeout(() => {
                socket.emit('presence:cursor', {
                    userId,
                    boardId,
                    x: e.clientX,
                    y: e.clientY,
                });
            }, 50);
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            clearTimeout(cursorTimer);
            window.removeEventListener('mousemove', handleMouseMove);
            socket.emit('leave:board', { boardId, userId });
            socket.off('card:moved');
            socket.off('column:moved');
            socket.off('presence:join');
            socket.off('presence:leave');
            socket.off('presence:cursor');
            socket.disconnect();
        };
    }, [boardId, userId, moveCard, moveColumn, addPresence, removePresence, updateCursor]);

    const emitCardMoved = (payload: SocketCardMovedPayload) => {
        socketRef.current.emit('card:moved', { ...payload, boardId });
    };

    const emitColumnMoved = (payload: SocketColumnMovedPayload) => {
        socketRef.current.emit('column:moved', { ...payload, boardId });
    };

    return { emitCardMoved, emitColumnMoved };
}
