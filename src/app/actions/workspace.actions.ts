'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from './auth.actions';
import {
    createWorkspaceSchema,
    createBoardSchema,
    inviteMemberSchema,
} from '@/lib/validations/board.schema';
import { generateSlug } from '@/lib/utils';
import type { ApiResponse, Workspace, Board } from '@/types';

export async function createWorkspace(
    formData: FormData
): Promise<ApiResponse<Workspace>> {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' } };

    const parsed = createWorkspaceSchema.safeParse({ name: formData.get('name') });
    if (!parsed.success) {
        return { success: false, error: { code: 'VALIDATION_ERROR', message: parsed.error.errors[0].message } };
    }

    const { name } = parsed.data;
    let slug = generateSlug(name);
    const existing = await prisma.workspace.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    const workspace = await prisma.workspace.create({
        data: {
            name,
            slug,
            ownerId: user.id,
            members: {
                create: { userId: user.id, role: 'ADMIN' },
            },
        },
        include: { owner: { select: { id: true, name: true, email: true, avatarUrl: true } } },
    });

    revalidatePath('/dashboard');
    return { success: true, data: workspace as unknown as Workspace };
}

export async function getWorkspaces(): Promise<ApiResponse<Workspace[]>> {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' } };

    const workspaces = await prisma.workspace.findMany({
        where: {
            members: { some: { userId: user.id } },
        },
        include: {
            owner: { select: { id: true, name: true, email: true, avatarUrl: true } },
            _count: { select: { members: true, boards: true } },
        },
        orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: workspaces as unknown as Workspace[] };
}

export async function getWorkspace(workspaceId: string): Promise<ApiResponse<Workspace>> {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' } };

    const workspace = await prisma.workspace.findFirst({
        where: {
            id: workspaceId,
            members: { some: { userId: user.id } },
        },
        include: {
            owner: { select: { id: true, name: true, email: true, avatarUrl: true } },
            members: {
                include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } },
                orderBy: { createdAt: 'asc' },
            },
            boards: { orderBy: { createdAt: 'desc' } },
        },
    });

    if (!workspace) {
        return { success: false, error: { code: 'NOT_FOUND', message: 'Workspace not found.' } };
    }

    return { success: true, data: workspace as unknown as Workspace };
}

export async function createBoard(
    formData: FormData
): Promise<ApiResponse<Board>> {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' } };

    const parsed = createBoardSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
    });
    if (!parsed.success) {
        return { success: false, error: { code: 'VALIDATION_ERROR', message: parsed.error.errors[0].message } };
    }

    const workspaceId = formData.get('workspaceId') as string;
    const member = await prisma.workspaceMember.findFirst({
        where: { workspaceId, userId: user.id, role: { in: ['ADMIN', 'MEMBER'] } },
    });

    if (!member) {
        return { success: false, error: { code: 'FORBIDDEN', message: 'Insufficient permissions.' } };
    }

    const board = await prisma.board.create({
        data: {
            title: parsed.data.title,
            description: parsed.data.description,
            workspaceId,
            columns: {
                createMany: {
                    data: [
                        { title: 'To Do', orderIndex: 1000 },
                        { title: 'In Progress', orderIndex: 2000 },
                        { title: 'In Review', orderIndex: 3000 },
                        { title: 'Done', orderIndex: 4000 },
                    ],
                },
            },
        },
    });

    revalidatePath(`/dashboard/workspaces/${workspaceId}`);
    return { success: true, data: board as unknown as Board };
}

export async function inviteMember(
    workspaceId: string,
    formData: FormData
): Promise<ApiResponse<void>> {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' } };

    const parsed = inviteMemberSchema.safeParse({
        email: formData.get('email'),
        role: formData.get('role'),
    });
    if (!parsed.success) {
        return { success: false, error: { code: 'VALIDATION_ERROR', message: parsed.error.errors[0].message } };
    }

    const adminCheck = await prisma.workspaceMember.findFirst({
        where: { workspaceId, userId: user.id, role: 'ADMIN' },
    });
    if (!adminCheck) {
        return { success: false, error: { code: 'FORBIDDEN', message: 'Only admins can invite members.' } };
    }

    const invitee = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (!invitee) {
        return { success: false, error: { code: 'USER_NOT_FOUND', message: 'No user with that email exists.' } };
    }

    const existingMember = await prisma.workspaceMember.findUnique({
        where: { workspaceId_userId: { workspaceId, userId: invitee.id } },
    });
    if (existingMember) {
        return { success: false, error: { code: 'ALREADY_MEMBER', message: 'User is already a member.' } };
    }

    await prisma.workspaceMember.create({
        data: { workspaceId, userId: invitee.id, role: parsed.data.role },
    });

    revalidatePath(`/dashboard/workspaces/${workspaceId}`);
    return { success: true };
}
