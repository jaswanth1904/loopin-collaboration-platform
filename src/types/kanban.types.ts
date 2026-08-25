export interface KanbanColumn {
    id: string;
    title: string;
    orderIndex: number;
    boardId: string;
    cards: KanbanCard[];
}

export interface KanbanCard {
    id: string;
    title: string;
    description: string | null;
    orderIndex: number;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    columnId: string;
    assignedToId: string | null;
    dueDate: string | null;
    labels: string[];
    assignedTo?: {
        id: string;
        name: string;
        email: string;
        avatarUrl: string | null;
    } | null;
    createdAt?: Date;
}

export interface DragItem {
    id: string;
    type: 'column' | 'card';
    columnId?: string;
}

export interface DragState {
    activeId: string | null;
    activeType: 'column' | 'card' | null;
    activeCard: KanbanCard | null;
    activeColumn: KanbanColumn | null;
}

export interface PresenceCursor {
    userId: string;
    userName: string;
    avatarUrl: string | null;
    x: number;
    y: number;
    color: string;
}

export interface SocketCardMovedPayload {
    cardId: string;
    fromColumnId: string;
    toColumnId: string;
    newOrderIndex: number;
    movedBy: string;
}

export interface SocketColumnMovedPayload {
    columnId: string;
    newOrderIndex: number;
    movedBy: string;
}

export interface SocketPresencePayload {
    userId: string;
    userName: string;
    avatarUrl: string | null;
    boardId: string;
    color: string;
}

export type SocketEvent =
    | 'join:board'
    | 'leave:board'
    | 'card:moved'
    | 'column:moved'
    | 'presence:cursor'
    | 'presence:join'
    | 'presence:leave'
    | 'board:updated';
