'use client';

import { useState, useRef, useEffect } from 'react';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useBoardStore } from '@/stores/useBoardStore';
import { CardItem } from './Card';
import { NewTaskDialog } from './NewTaskDialog';
import { createColumn } from '@/app/actions/board.actions';
import { toast } from 'sonner';
import { MoreHorizontal, Plus, GripVertical, Pencil, Trash2, Check, X } from 'lucide-react';
import type { KanbanColumn } from '@/types/kanban.types';
import type { AuthUser } from '@/types';

interface ColumnProps {
    column: KanbanColumn;
    boardId: string;
    currentUser: AuthUser;
    isDragOverlay?: boolean;
}

export function Column({ column, boardId, currentUser, isDragOverlay = false }: ColumnProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(column.title);
    const [showMenu, setShowMenu] = useState(false);
    const [showNewTask, setShowNewTask] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const { updateColumn, deleteColumn } = useBoardStore();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: column.id,
        data: { type: 'column', column },
        disabled: isDragOverlay,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    useEffect(() => {
        if (isEditing) inputRef.current?.select();
    }, [isEditing]);

    const handleSaveTitle = () => {
        if (editTitle.trim() && editTitle !== column.title) {
            updateColumn(column.id, editTitle.trim());
        } else {
            setEditTitle(column.title);
        }
        setIsEditing(false);
    };

    const sortedCards = [...(column.cards ?? [])].sort((a, b) => a.orderIndex - b.orderIndex);

    return (
        <div
            ref={setNodeRef}
            style={{
                ...style,
                width: 300,
                minWidth: 300,
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
                maxHeight: 'calc(100vh - 180px)',
            }}
        >
            <div
                className="bg-gray-50 border border-gray-200 rounded-2xl shadow-sm"
                style={{ display: 'flex', flexDirection: 'column', maxHeight: '100%' }}
            >
                {/* Column header */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '16px 14px 12px 12px',
                        borderBottom: '1px solid #e5e7eb',
                    }}
                >
                    <button
                        {...attributes}
                        {...listeners}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#9ca3af',
                            cursor: 'grab',
                            display: 'flex',
                            padding: 2,
                            borderRadius: 4,
                            flexShrink: 0,
                        }}
                    >
                        <GripVertical size={16} className="active:cursor-grabbing hover:text-indigo-600 transition-colors" />
                    </button>

                    {isEditing ? (
                        <div style={{ flex: 1, display: 'flex', gap: 4 }}>
                            <input
                                ref={inputRef}
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveTitle();
                                    if (e.key === 'Escape') { setEditTitle(column.title); setIsEditing(false); }
                                }}
                                style={{ flex: 1, background: '#fff', border: '2px solid #6366f1', borderRadius: 8, padding: '4px 8px', color: '#111827', fontSize: 13, fontWeight: 700, outline: 'none' }}
                            />
                            <button onClick={handleSaveTitle} style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', display: 'flex' }}><Check size={16} /></button>
                            <button onClick={() => { setEditTitle(column.title); setIsEditing(false); }} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex' }}><X size={16} /></button>
                        </div>
                    ) : (
                        <span
                            style={{ flex: 1, fontSize: 14, fontWeight: 700, color: '#111827', cursor: 'default', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                            onDoubleClick={() => setIsEditing(true)}
                        >
                            {column.title}
                        </span>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#4f46e5', background: '#e0e7ff', borderRadius: '12px', padding: '2px 8px' }}>
                            {sortedCards.length}
                        </span>
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex', padding: 2, borderRadius: 4 }}
                                onBlur={() => setTimeout(() => setShowMenu(false), 150)}
                            >
                                <MoreHorizontal size={14} />
                            </button>
                            {showMenu && (
                                <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: 4, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 6, zIndex: 50, minWidth: 140, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                                    <button
                                        onClick={() => { setShowMenu(false); setIsEditing(true); }}
                                        style={{ width: '100%', background: 'none', border: 'none', color: '#4b5563', fontSize: 13, fontWeight: 600, padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, borderRadius: 8, textAlign: 'left' }}
                                    >
                                        <Pencil size={14} /> Rename
                                    </button>
                                    <button
                                        onClick={() => { deleteColumn(column.id); setShowMenu(false); }}
                                        style={{ width: '100%', background: 'none', border: 'none', color: '#ef4444', fontSize: 13, fontWeight: 600, padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, borderRadius: 8, textAlign: 'left' }}
                                    >
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Cards */}
                <div
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                        minHeight: 80,
                    }}
                    className="no-scrollbar"
                >
                    <SortableContext items={sortedCards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                        {sortedCards.map((card) => (
                            <CardItem
                                key={card.id}
                                card={card}
                                boardId={boardId}
                                currentUser={currentUser}
                            />
                        ))}
                    </SortableContext>

                    {sortedCards.length === 0 && (
                        <div style={{
                            height: 80,
                            border: '2px dashed #e5e7eb',
                            borderRadius: 12,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 13,
                            fontWeight: 600,
                            color: '#9ca3af',
                            background: '#fafafa'
                        }}>
                            Drop cards here
                        </div>
                    )}
                </div>

                {currentUser.email === 'hello@kanban.com' && (
                    <button
                        onClick={() => setShowNewTask(true)}
                        style={{
                            margin: 12,
                            padding: '10px 14px',
                            background: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: 10,
                            color: '#6b7280',
                            fontSize: 13,
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            transition: 'all 0.15s ease',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#6366f1'; (e.currentTarget as HTMLElement).style.color = '#4f46e5'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 6px -1px rgba(99,102,241,0.1)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#e5e7eb'; (e.currentTarget as HTMLElement).style.color = '#6b7280'; (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'; }}
                    >
                        <Plus size={16} /> Add card
                    </button>
                )}
            </div>

            {showNewTask && (
                <NewTaskDialog
                    columnId={column.id}
                    onClose={() => setShowNewTask(false)}
                />
            )}
        </div>
    );
}

void toast;
void createColumn;
