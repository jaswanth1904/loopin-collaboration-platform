'use client';

import { create } from 'zustand';
import type { DragState, KanbanCard, KanbanColumn, PresenceCursor } from '@/types/kanban.types';

interface BoardStore extends DragState {
    columns: KanbanColumn[];
    activePresentUsers: PresenceCursor[];

    // Drag actions
    setDragActive: (
        id: string,
        type: 'column' | 'card',
        card?: KanbanCard | null,
        column?: KanbanColumn | null
    ) => void;
    clearDrag: () => void;

    // Column actions
    setColumns: (columns: KanbanColumn[]) => void;
    moveColumn: (columnId: string, newIndex: number) => void;
    addColumn: (column: KanbanColumn) => void;
    updateColumn: (columnId: string, title: string) => void;
    deleteColumn: (columnId: string) => void;

    // Card actions
    moveCard: (cardId: string, fromColumnId: string, toColumnId: string, newOrderIndex: number) => void;
    addCard: (card: KanbanCard) => void;
    updateCard: (cardId: string, updates: Partial<KanbanCard>) => void;
    deleteCard: (cardId: string, columnId: string) => void;

    // Presence
    setPresence: (cursors: PresenceCursor[]) => void;
    addPresence: (cursor: PresenceCursor) => void;
    removePresence: (userId: string) => void;
    updateCursor: (userId: string, x: number, y: number) => void;
}

export const useBoardStore = create<BoardStore>((set) => ({
    activeId: null,
    activeType: null,
    activeCard: null,
    activeColumn: null,
    columns: [],
    activePresentUsers: [],

    setDragActive: (id, type, card = null, column = null) =>
        set({ activeId: id, activeType: type, activeCard: card, activeColumn: column }),

    clearDrag: () =>
        set({ activeId: null, activeType: null, activeCard: null, activeColumn: null }),

    setColumns: (columns) => set({ columns }),

    moveColumn: (columnId, newIndex) =>
        set((state) => {
            const sorted = [...state.columns].sort((a, b) => a.orderIndex - b.orderIndex);
            const from = sorted.findIndex((c) => c.id === columnId);
            if (from === -1) return state;
            const [col] = sorted.splice(from, 1);
            sorted.splice(newIndex, 0, col);
            const updated = sorted.map((c, i) => ({ ...c, orderIndex: (i + 1) * 1000 }));
            return { columns: updated };
        }),

    addColumn: (column) =>
        set((state) => ({ columns: [...state.columns, column] })),

    updateColumn: (columnId, title) =>
        set((state) => ({
            columns: state.columns.map((c) => (c.id === columnId ? { ...c, title } : c)),
        })),

    deleteColumn: (columnId) =>
        set((state) => ({ columns: state.columns.filter((c) => c.id !== columnId) })),

    moveCard: (cardId, fromColumnId, toColumnId, newOrderIndex) =>
        set((state) => {
            const newColumns = state.columns.map((col) => {
                if (col.id === fromColumnId) {
                    return { ...col, cards: col.cards.filter((c) => c.id !== cardId) };
                }
                if (col.id === toColumnId) {
                    const card = state.columns
                        .find((c) => c.id === fromColumnId)
                        ?.cards.find((c) => c.id === cardId);
                    if (!card) return col;
                    const updatedCard = { ...card, columnId: toColumnId, orderIndex: newOrderIndex };
                    const cards = [...col.cards.filter((c) => c.id !== cardId), updatedCard].sort(
                        (a, b) => a.orderIndex - b.orderIndex
                    );
                    return { ...col, cards };
                }
                return col;
            });
            return { columns: newColumns };
        }),

    addCard: (card) =>
        set((state) => ({
            columns: state.columns.map((col) =>
                col.id === card.columnId ? { ...col, cards: [...col.cards, card] } : col
            ),
        })),

    updateCard: (cardId, updates) =>
        set((state) => ({
            columns: state.columns.map((col) => ({
                ...col,
                cards: col.cards.map((c) => (c.id === cardId ? { ...c, ...updates } : c)),
            })),
        })),

    deleteCard: (cardId, columnId) =>
        set((state) => ({
            columns: state.columns.map((col) =>
                col.id === columnId
                    ? { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
                    : col
            ),
        })),

    setPresence: (cursors) => set({ activePresentUsers: cursors }),

    addPresence: (cursor) =>
        set((state) => ({
            activePresentUsers: [
                ...state.activePresentUsers.filter((u) => u.userId !== cursor.userId),
                cursor,
            ],
        })),

    removePresence: (userId) =>
        set((state) => ({
            activePresentUsers: state.activePresentUsers.filter((u) => u.userId !== userId),
        })),

    updateCursor: (userId, x, y) =>
        set((state) => ({
            activePresentUsers: state.activePresentUsers.map((u) =>
                u.userId === userId ? { ...u, x, y } : u
            ),
        })),
}));
