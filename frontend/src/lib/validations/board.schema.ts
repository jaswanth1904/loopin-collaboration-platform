import { z } from 'zod';

export const createWorkspaceSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(80),
});

export const updateWorkspaceSchema = z.object({
    name: z.string().min(2).max(80).optional(),
});

export const inviteMemberSchema = z.object({
    email: z.string().email('Invalid email'),
    role: z.enum(['ADMIN', 'MEMBER', 'VIEWER']),
});

export const updateMemberRoleSchema = z.object({
    role: z.enum(['ADMIN', 'MEMBER', 'VIEWER']),
});

export const createBoardSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100),
    description: z.string().max(500).optional(),
});

export const updateBoardSchema = z.object({
    title: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
export type CreateBoardInput = z.infer<typeof createBoardSchema>;
export type UpdateBoardInput = z.infer<typeof updateBoardSchema>;
