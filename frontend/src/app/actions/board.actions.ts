'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from './auth.actions';
import { createCardSchema, updateCardSchema, moveCardSchema, createColumnSchema } from '@/lib/validations/task.schema';
import { getMidpoint } from '@/lib/utils';
import type { ApiResponse, Card, Column } from '@/types';

async function getBoardAccess(boardId: string, userId: string, role?: 'ADMIN' | 'MEMBER') {
    const board = await prisma.board.findFirst({
        where: {
            id: boardId,
            workspace: {
                members: {
                    some: role
                        ? { userId, role: { in: role === 'ADMIN' ? ['ADMIN'] : ['ADMIN', 'MEMBER'] } }
                        : { userId },
                },
            },
        },
    });
    return board;
}

export async function getBoardData(boardId: string) {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' } };

    const board = await prisma.board.findFirst({
        where: {
            id: boardId,
            workspace: { members: { some: { userId: user.id } } },
        },
        include: {
            columns: {
                orderBy: { orderIndex: 'asc' },
                include: {
                    cards: {
                        orderBy: { orderIndex: 'asc' },
                        include: {
                            assignedTo: { select: { id: true, name: true, email: true, avatarUrl: true } },
                        },
                    },
                },
            },
            workspace: { select: { id: true, name: true, slug: true } },
        },
    });

    if (!board) return { success: false, error: { code: 'NOT_FOUND', message: 'Board not found.' } };

    return { success: true, data: board };
}

export async function createColumn(boardId: string, formData: FormData): Promise<ApiResponse<Column>> {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' } };

    const access = await getBoardAccess(boardId, user.id, 'MEMBER');
    if (!access) return { success: false, error: { code: 'FORBIDDEN', message: 'Access denied.' } };

    const parsed = createColumnSchema.safeParse({ title: formData.get('title'), boardId });
    if (!parsed.success) return { success: false, error: { code: 'VALIDATION_ERROR', message: parsed.error?.issues?.[0]?.message ?? 'Validation error' } };

    const lastCol = await prisma.column.findFirst({ where: { boardId }, orderBy: { orderIndex: 'desc' } });
    const orderIndex = lastCol ? lastCol.orderIndex + 1000 : 1000;

    const column = await prisma.column.create({ data: { title: parsed.data.title, boardId, orderIndex } });

    revalidatePath(`/dashboard/workspaces/[workspaceId]/boards/${boardId}`);
    return { success: true, data: column as unknown as Column };
}

export async function createCard(formData: FormData): Promise<ApiResponse<Card>> {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' } };

    let payloadDueDate = formData.get('dueDate') as string;
    if (payloadDueDate) {
        // Ensure valid ISO-8601 for Zod (append :00Z if its a datetime-local without seconds)
        if (payloadDueDate.length === 16) payloadDueDate += ':00.000Z';
        else if (!payloadDueDate.endsWith('Z')) payloadDueDate = new Date(payloadDueDate).toISOString();
    }

    const labels = formData.getAll('labels') as string[];

    const rawEmail = (formData.get('assigneeEmail') as string || '').trim();
    const parsed = createCardSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description') || undefined,
        columnId: formData.get('columnId'),
        priority: formData.get('priority') || 'MEDIUM',
        assigneeEmail: rawEmail || undefined,
        assignedToId: formData.get('assignedToId') || undefined,
        dueDate: payloadDueDate || undefined,
        labels: labels.length > 0 ? labels : undefined,
    });

    if (!parsed.success) return { success: false, error: { code: 'VALIDATION_ERROR', message: parsed.error?.issues?.[0]?.message ?? 'Validation failed' } };

    const column = await prisma.column.findFirst({
        where: {
            id: parsed.data.columnId,
            board: { workspace: { members: { some: { userId: user.id } } } },
        },
        include: { board: true },
    });

    if (!column) return { success: false, error: { code: 'FORBIDDEN', message: 'Access denied: Could not find column or you lack workspace membership.' } };

    const lastCard = await prisma.card.findFirst({ where: { columnId: parsed.data.columnId }, orderBy: { orderIndex: 'desc' } });
    const orderIndex = lastCard ? lastCard.orderIndex + 1000 : 1000;

    let finalAssignedToId = parsed.data.assignedToId || null;

    if (parsed.data.assigneeEmail) {
        const assignedUser = await prisma.user.findUnique({
            where: { email: parsed.data.assigneeEmail.toLowerCase() },
            select: { id: true }
        });
        if (assignedUser) {
            finalAssignedToId = assignedUser.id;
        } else {
            return { success: false, error: { code: 'NOT_FOUND', message: 'No registered user found with that email' } };
        }
    }

    const card = await prisma.card.create({
        data: {
            title: parsed.data.title,
            description: parsed.data.description,
            columnId: parsed.data.columnId,
            priority: parsed.data.priority ?? 'MEDIUM',
            assignedToId: finalAssignedToId,
            dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
            labels: parsed.data.labels || [],
            orderIndex,
        },
        include: { assignedTo: { select: { id: true, name: true, email: true, avatarUrl: true } } },
    });

    await prisma.activityLog.create({
        data: {
            action: 'CARD_CREATED',
            metadata: { cardId: card.id, cardTitle: card.title, columnId: parsed.data.columnId },
            boardId: column.boardId,
            userId: user.id,
        },
    });

    revalidatePath(`/dashboard/workspaces/[workspaceId]/boards/${column.boardId}`);
    return { success: true, data: card as unknown as Card };
}

export async function moveCard(payload: {
    cardId: string;
    toColumnId: string;
    newOrderIndex: number;
    boardId: string;
}): Promise<ApiResponse<void>> {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' } };

    const parsed = moveCardSchema.safeParse({
        cardId: payload.cardId,
        toColumnId: payload.toColumnId,
        newOrderIndex: payload.newOrderIndex,
    });
    if (!parsed.success) return { success: false, error: { code: 'VALIDATION_ERROR', message: parsed.error?.issues?.[0]?.message ?? 'Validation error' } };

    const card = await prisma.card.findFirst({
        where: { id: parsed.data.cardId, column: { board: { workspace: { members: { some: { userId: user.id } } } } } },
        include: { column: true },
    });
    if (!card) return { success: false, error: { code: 'NOT_FOUND', message: 'Card not found.' } };

    const fromColumnId = card.columnId;

    await prisma.$transaction([
        prisma.card.update({
            where: { id: parsed.data.cardId },
            data: { columnId: parsed.data.toColumnId, orderIndex: parsed.data.newOrderIndex },
        }),
        prisma.activityLog.create({
            data: {
                action: 'CARD_MOVED',
                metadata: {
                    cardId: card.id,
                    cardTitle: card.title,
                    fromColumnId,
                    toColumnId: parsed.data.toColumnId,
                },
                boardId: payload.boardId,
                userId: user.id,
            },
        }),
    ]);

    return { success: true };
}

export async function updateCard(cardId: string, formData: FormData): Promise<ApiResponse<Card>> {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' } };

    const parsed = updateCardSchema.safeParse({
        title: formData.get('title') || undefined,
        description: formData.get('description') || undefined,
        priority: formData.get('priority') || undefined,
        assignedToId: formData.get('assignedToId') || undefined,
        dueDate: formData.get('dueDate') || undefined,
    });
    if (!parsed.success) return { success: false, error: { code: 'VALIDATION_ERROR', message: parsed.error?.issues?.[0]?.message ?? 'Validation error' } };

    const card = await prisma.card.findFirst({
        where: { id: cardId, column: { board: { workspace: { members: { some: { userId: user.id } } } } } },
    });
    if (!card) return { success: false, error: { code: 'NOT_FOUND', message: 'Card not found.' } };

    const updated = await prisma.card.update({
        where: { id: cardId },
        data: {
            ...parsed.data,
            dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : undefined,
        },
        include: { assignedTo: { select: { id: true, name: true, email: true, avatarUrl: true } } },
    });

    return { success: true, data: updated as unknown as Card };
}

export async function deleteCard(cardId: string, boardId: string): Promise<ApiResponse<void>> {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' } };

    const card = await prisma.card.findFirst({
        where: { id: cardId, column: { board: { workspace: { members: { some: { userId: user.id, role: { in: ['ADMIN', 'MEMBER'] } } } } } } },
    });
    if (!card) return { success: false, error: { code: 'NOT_FOUND', message: 'Card not found.' } };

    await prisma.$transaction([
        prisma.card.delete({ where: { id: cardId } }),
        prisma.activityLog.create({
            data: {
                action: 'CARD_DELETED',
                metadata: { cardId, cardTitle: card.title },
                boardId,
                userId: user.id,
            },
        }),
    ]);

    return { success: true };
}

export async function reorderColumns(boardId: string, columnOrders: { id: string; orderIndex: number }[]): Promise<ApiResponse<void>> {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' } };

    const access = await getBoardAccess(boardId, user.id, 'MEMBER');
    if (!access) return { success: false, error: { code: 'FORBIDDEN', message: 'Access denied.' } };

    await prisma.$transaction(
        columnOrders.map((col) =>
            prisma.column.update({ where: { id: col.id }, data: { orderIndex: col.orderIndex } })
        )
    );

    return { success: true };
}

export async function getActivityLog(boardId: string) {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' } };

    const logs = await prisma.activityLog.findMany({
        where: {
            boardId,
            board: { workspace: { members: { some: { userId: user.id } } } },
        },
        include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } },
        orderBy: { createdAt: 'desc' },
        take: 50,
    });

    return { success: true, data: logs };
}

export async function getWorkspaceMembers(boardId: string) {
    const user = await getCurrentUser();
    if (!user) return [];
    const board = await prisma.board.findUnique({
        where: { id: boardId },
        include: { workspace: { include: { members: { include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } } } } } }
    });
    if (!board) return [];
    return board.workspace.members.map((m: any) => m.user);
}
