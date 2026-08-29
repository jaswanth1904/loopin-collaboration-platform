import { z } from 'zod';

export const createColumnSchema = z.object({
    title: z.string().min(1, 'Title is required').max(80),
    boardId: z.string().cuid(),
});

export const updateColumnSchema = z.object({
    title: z.string().min(1).max(80).optional(),
    orderIndex: z.number().optional(),
});

export const reorderColumnsSchema = z.object({
    boardId: z.string().cuid(),
    columnOrders: z.array(
        z.object({
            id: z.string().cuid(),
            orderIndex: z.number(),
        })
    ),
});

export const createCardSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200),
    description: z.string().max(5000).optional(),
    columnId: z.string().cuid(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
    assignedToId: z.string().cuid().nullable().optional(),
    assigneeEmail: z.string().email().optional().or(z.literal('')),
    dueDate: z.string().datetime().nullable().optional(),
    labels: z.array(z.string().max(30)).max(10).optional(),
});

export const updateCardSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(5000).nullable().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
    assignedToId: z.string().cuid().nullable().optional(),
    dueDate: z.string().datetime().nullable().optional(),
    labels: z.array(z.string().max(30)).max(10).optional(),
});

export const moveCardSchema = z.object({
    cardId: z.string().cuid(),
    toColumnId: z.string().cuid(),
    newOrderIndex: z.number(),
});

export const socketCardMovedSchema = z.object({
    cardId: z.string(),
    fromColumnId: z.string(),
    toColumnId: z.string(),
    newOrderIndex: z.number(),
    boardId: z.string(),
});

export const socketColumnMovedSchema = z.object({
    columnId: z.string(),
    newOrderIndex: z.number(),
    boardId: z.string(),
});

export type CreateCardInput = z.infer<typeof createCardSchema>;
export type UpdateCardInput = z.infer<typeof updateCardSchema>;
export type MoveCardInput = z.infer<typeof moveCardSchema>;
