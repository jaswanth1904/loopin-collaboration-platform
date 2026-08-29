'use client';

import { useEffect, useCallback, useState } from 'react';
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
    DragOverEvent,
    closestCorners,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { toast } from 'sonner';
import { useBoardStore } from '@/stores/useBoardStore';
import { useKanbanSocket } from '@/hooks/useKanbanSocket';
import { Column } from './Column';
import { CardItem } from './Card';
import { DragOverlayWrapper } from './DragOverlayWrapper';
import { NewColumnButton } from './NewColumnButton';
import { ActivityFeed } from '@/components/shared/ActivityFeed';
import ChatSidebar from '@/components/kanban/ChatSidebar';
import VideoCall from '@/components/kanban/VideoCall';
import { moveCard, reorderColumns } from '@/app/actions/board.actions';
import { getOrderIndex } from '@/lib/utils';
import type { AuthUser } from '@/types';
import type { KanbanColumn, KanbanCard } from '@/types/kanban.types';
import { LayoutGrid, Activity, PanelRight, MessageSquare, Video } from 'lucide-react';

interface BoardProps {
    board: {
        id: string;
        title: string;
        description?: string | null;
        workspaceId: string;
        columns: (KanbanColumn & { cards: KanbanCard[] })[];
        workspace?: { id: string; name: string; slug: string };
    };
    currentUser: AuthUser;
}

export function Board({ board, currentUser }: BoardProps) {
    const { columns, setColumns, setDragActive, clearDrag, activeType, activeCard, activeColumn, activePresentUsers, moveCard: storeMoveCard } = useBoardStore();
    const [showActivity, setShowActivity] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isVideoActive, setIsVideoActive] = useState(false);

    // Real-time chat messages
    const [messages, setMessages] = useState<any[]>([]);

    const handleInboundMeeting = useCallback((callerName: string) => {
        toast(`${callerName} started a Team Video Call.`, {
            action: {
                label: 'Join Meeting',
                onClick: () => setIsVideoActive(true),
            },
            duration: 10000,
        });
    }, []);

    const handleInboundChat = useCallback((message: any) => {
        setMessages((prev) => [...prev, message]);
    }, []);

    const { emitCardMoved, emitColumnMoved, emitMeetingStarted, emitChatMessage } = useKanbanSocket({
        boardId: board.id,
        userId: currentUser.id,
        onMeetingTriggered: handleInboundMeeting,
        onChatMessage: handleInboundChat
    });

    useEffect(() => {
        setColumns(board.columns as KanbanColumn[]);
    }, [board.columns, setColumns]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    );

    const handleDragStart = useCallback((event: DragStartEvent) => {
        const { active } = event;
        const type = active.data.current?.type as 'column' | 'card';
        if (type === 'column') {
            const col = columns.find((c) => c.id === active.id);
            setDragActive(String(active.id), 'column', null, col ?? null);
        } else {
            const card = columns.flatMap((c) => c.cards).find((c) => c.id === active.id);
            setDragActive(String(active.id), 'card', card ?? null, null);
        }
    }, [columns, setDragActive]);

    const handleDragOver = useCallback((event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeType = active.data.current?.type;
        const overType = over.data.current?.type;

        if (activeType !== 'card') return;

        const activeCardId = String(active.id);
        const activeColumnId = active.data.current?.columnId as string;

        let targetColumnId: string;
        if (overType === 'column') {
            targetColumnId = String(over.id);
        } else if (overType === 'card') {
            targetColumnId = over.data.current?.columnId as string;
        } else return;

        if (activeColumnId === targetColumnId) return;

        // Optimistic cross-column move
        const fromCol = columns.find((c) => c.id === activeColumnId);
        const card = fromCol?.cards.find((c) => c.id === activeCardId);
        if (!card) return;

        const toCol = columns.find((c) => c.id === targetColumnId);
        if (!toCol) return;

        const newOrderIndex = getOrderIndex(toCol.cards, toCol.cards.length);
        storeMoveCard(activeCardId, activeColumnId, targetColumnId, newOrderIndex);
    }, [columns, storeMoveCard]);

    const handleDragEnd = useCallback(async (event: DragEndEvent) => {
        const { active, over } = event;
        clearDrag();

        if (!over || active.id === over.id) return;

        const activeType = active.data.current?.type as 'column' | 'card';

        if (activeType === 'column') {
            const oldIndex = columns.findIndex((c) => c.id === active.id);
            const newIndex = columns.findIndex((c) => c.id === over.id);
            if (oldIndex === newIndex || oldIndex === -1 || newIndex === -1) return;

            const reordered = arrayMove(columns, oldIndex, newIndex);
            const columnOrders = reordered.map((col, i) => ({ id: col.id, orderIndex: (i + 1) * 1000 }));
            setColumns(reordered.map((col, i) => ({ ...col, orderIndex: (i + 1) * 1000 })));

            const result = await reorderColumns(board.id, columnOrders);
            if (!result.success) {
                toast.error('Failed to reorder columns');
                setColumns(board.columns as KanbanColumn[]);
            } else {
                emitColumnMoved({ columnId: String(active.id), newOrderIndex: newIndex * 1000, movedBy: currentUser.id });
            }
            return;
        }

        // Card move
        const activeCardId = String(active.id);
        const overType = over.data.current?.type;
        let toColumnId: string;
        let targetCards: KanbanCard[];

        if (overType === 'column') {
            toColumnId = String(over.id);
            targetCards = columns.find((c) => c.id === toColumnId)?.cards ?? [];
        } else {
            toColumnId = over.data.current?.columnId as string;
            targetCards = columns.find((c) => c.id === toColumnId)?.cards ?? [];
        }

        const fromColumnId = active.data.current?.columnId as string;
        const targetIndex = overType === 'card'
            ? targetCards.findIndex((c) => c.id === over.id)
            : targetCards.length;

        const newOrderIndex = getOrderIndex(targetCards.filter((c) => c.id !== activeCardId), targetIndex);

        const result = await moveCard({ cardId: activeCardId, toColumnId, newOrderIndex, boardId: board.id });
        if (!result.success) {
            toast.error('Failed to move card');
            setColumns(board.columns as KanbanColumn[]);
        } else {
            emitCardMoved({ cardId: activeCardId, fromColumnId, toColumnId, newOrderIndex, movedBy: currentUser.id });
        }
    }, [columns, board, clearDrag, setColumns, emitCardMoved, emitColumnMoved, currentUser.id]);

    const sortedColumns = [...columns].sort((a, b) => a.orderIndex - b.orderIndex);

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 0 }}>
            {/* Board header */}
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4 px-2">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                            <LayoutGrid size={20} className="text-indigo-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{board.title}</h1>
                    </div>
                    {board.description && (
                        <p className="text-sm font-medium text-gray-500 mt-2">{board.description}</p>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => {
                            setIsVideoActive(true);
                            emitMeetingStarted(currentUser.name || currentUser.email, board.workspaceId);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl text-sm font-bold text-indigo-700 transition-colors shadow-sm"
                    >
                        <Video size={16} />
                        Team Meeting
                    </button>
                    <button
                        onClick={() => setIsChatOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors shadow-sm"
                    >
                        <MessageSquare size={16} />
                        Team Chat
                    </button>
                    <button
                        onClick={() => setShowActivity(!showActivity)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors shadow-sm"
                    >
                        <Activity size={16} />
                        Activity
                    </button>
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', gap: 16, overflow: 'hidden' }}>
                {/* Kanban board */}
                <div style={{ flex: 1, overflow: 'auto', paddingBottom: 16 }}>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCorners}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={sortedColumns.map((c) => c.id)}
                            strategy={horizontalListSortingStrategy}
                        >
                            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', minHeight: '100%', paddingBottom: 8 }}>
                                {sortedColumns.map((column) => (
                                    <Column
                                        key={column.id}
                                        column={column}
                                        boardId={board.id}
                                        currentUser={currentUser}
                                    />
                                ))}
                                {currentUser.email === 'hello@kanban.com' && (
                                    <NewColumnButton boardId={board.id} />
                                )}
                            </div>
                        </SortableContext>

                        <DragOverlay>
                            {activeType === 'card' && activeCard && (
                                <DragOverlayWrapper>
                                    <CardItem card={activeCard} isDragOverlay />
                                </DragOverlayWrapper>
                            )}
                            {activeType === 'column' && activeColumn && (
                                <DragOverlayWrapper isColumn>
                                    <Column column={activeColumn} boardId={board.id} currentUser={currentUser} isDragOverlay />
                                </DragOverlayWrapper>
                            )}
                        </DragOverlay>
                    </DndContext>
                </div>

                {/* Activity panel */}
                {showActivity && (
                    <div className="w-[320px] flex-shrink-0 bg-white border border-gray-200 rounded-2xl flex flex-col overflow-hidden shadow-lg slide-in-right">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Activity Feed</h3>
                            <button onClick={() => setShowActivity(false)} className="text-gray-400 hover:text-gray-900 p-1.5 -mr-1.5 rounded-lg hover:bg-gray-200 transition-colors">
                                <PanelRight size={18} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <ActivityFeed boardId={board.id} />
                        </div>
                    </div>
                )}
            </div>

            {isVideoActive && (
                <VideoCall
                    roomName={board.workspaceId}
                    userName={currentUser.name || currentUser.email}
                    onClose={() => setIsVideoActive(false)}
                />
            )}

            <ChatSidebar
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                onStartVideoCall={() => setIsVideoActive(true)}
                currentUser={currentUser}
                channelName={board.workspace?.name || 'Workspace'}
                messages={messages}
                onSendMessage={(msg) => {
                    setMessages((prev) => [...prev, { ...msg, isMe: true }]);
                    emitChatMessage(msg);
                }}
            />
        </div >
    );
}
