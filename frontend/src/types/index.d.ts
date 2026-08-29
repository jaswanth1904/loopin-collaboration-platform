export type WorkspaceRole = 'ADMIN' | 'MEMBER' | 'VIEWER';
export type CardPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface User {
    id: string;
    email: string;
    name: string;
    avatarUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface Workspace {
    id: string;
    name: string;
    slug: string;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
    owner?: User;
    members?: WorkspaceMember[];
    boards?: Board[];
    _count?: { members: number; boards: number };
}

export interface WorkspaceMember {
    id: string;
    workspaceId: string;
    userId: string;
    role: WorkspaceRole;
    createdAt: Date;
    user?: User;
    workspace?: Workspace;
}

export interface Board {
    id: string;
    title: string;
    description: string | null;
    workspaceId: string;
    createdAt: Date;
    updatedAt: Date;
    columns?: Column[];
    workspace?: Workspace;
}

export interface Column {
    id: string;
    title: string;
    orderIndex: number;
    boardId: string;
    createdAt: Date;
    updatedAt: Date;
    cards?: Card[];
}

export interface Card {
    id: string;
    title: string;
    description: string | null;
    orderIndex: number;
    priority: CardPriority;
    columnId: string;
    assignedToId: string | null;
    dueDate: Date | null;
    labels: string[];
    createdAt: Date;
    updatedAt: Date;
    assignedTo?: User | null;
}

export interface ActivityLog {
    id: string;
    action: string;
    metadata: Record<string, unknown>;
    boardId: string;
    userId: string;
    createdAt: Date;
    user?: User;
}

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    avatarUrl: string | null;
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
    };
}

export interface JwtPayload {
    userId: string;
    email: string;
    iat?: number;
    exp?: number;
}
