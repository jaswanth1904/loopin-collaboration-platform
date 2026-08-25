'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useBoardStore } from '@/stores/useBoardStore';
import { deleteCard } from '@/app/actions/board.actions';
import { CardDetailDialog } from './CardDetailDialog';
import { PRIORITY_BG, isOverdue } from '@/lib/utils';
import { Calendar, Tag, User, Trash2, AlertCircle } from 'lucide-react';
import type { KanbanCard } from '@/types/kanban.types';
import type { AuthUser } from '@/types';

interface CardItemProps {
    card: KanbanCard;
    boardId?: string;
    currentUser?: AuthUser;
    isDragOverlay?: boolean;
}

export function CardItem({ card, boardId, currentUser, isDragOverlay = false }: CardItemProps) {
    const [showDetail, setShowDetail] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { deleteCard: storeDeleteCard } = useBoardStore();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: card.id,
        data: { type: 'card', card, columnId: card.columnId },
        disabled: isDragOverlay,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!boardId) return;
        setIsDeleting(true);
        storeDeleteCard(card.id, card.columnId);
        const result = await deleteCard(card.id, boardId);
        if (!result.success) {
            toast.error('Failed to delete card');
            setIsDeleting(false);
        }
    };

    const isCardOverdue = isOverdue(card.dueDate);

    return (
        <>
            <div
                ref={setNodeRef}
                style={{
                    ...style,
                    opacity: isDragging ? 0 : 1,
                }}
                className={`group bg-white rounded-xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-indigo-300 cursor-grab active:cursor-grabbing ${isDragOverlay ? 'shadow-2xl scale-105 border-indigo-400 rotate-2' : ''}`}
                {...(isDragOverlay ? {} : attributes)}
                {...(isDragOverlay ? {} : listeners)}
                onClick={() => !isDragOverlay && setShowDetail(true)}
            >
                <div style={{ padding: '14px 16px 12px' }}>
                    {/* Priority badge */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10, gap: 8 }}>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${PRIORITY_BG[card.priority] || 'bg-gray-100 text-gray-600'}`}>
                            {card.priority}
                        </span>
                        {!isDragOverlay && (
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all rounded hover:bg-red-50 -mr-1 -mt-1"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>

                    {/* Title */}
                    <p className="text-[13px] font-bold text-gray-900 leading-snug mb-3 line-clamp-3">
                        {card.title}
                    </p>

                    {/* Labels */}
                    {card.labels.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {card.labels.slice(0, 3).map((label) => (
                                <span key={label} className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                                    <Tag size={10} />{label}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                            {card.dueDate && (
                                <span className={`flex items-center gap-1 text-[10px] font-bold ${isCardOverdue ? 'text-red-600 bg-red-50 px-1.5 py-0.5 rounded' : 'text-gray-500'}`}>
                                    {isCardOverdue && <AlertCircle size={12} />}
                                    <Calendar size={12} />
                                    {format(new Date(card.dueDate), 'MMM d')}
                                </span>
                            )}
                        </div>
                        {card.assignedTo ? (
                            <div
                                title={card.assignedTo.email}
                                className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm ring-2 ring-white cursor-help"
                            >
                                {card.assignedTo.name.charAt(0).toUpperCase()}
                            </div>
                        ) : (
                            <div className="w-6 h-6 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400">
                                <User size={12} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showDetail && boardId && currentUser && (
                <CardDetailDialog
                    card={card}
                    boardId={boardId}
                    currentUser={currentUser}
                    onClose={() => setShowDetail(false)}
                />
            )}

            <style>{`
        .kanban-card:hover .card-delete-btn {
          opacity: 1 !important;
        }
      `}</style>
        </>
    );
}
