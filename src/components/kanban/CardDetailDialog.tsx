'use client';

import { useState, useTransition } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { updateCard } from '@/app/actions/board.actions';
import { useBoardStore } from '@/stores/useBoardStore';
import { PRIORITY_BG, isOverdue } from '@/lib/utils';
import { X, Calendar, User, Tag, Pencil, Save, AlertCircle } from 'lucide-react';
import type { KanbanCard } from '@/types/kanban.types';
import type { AuthUser } from '@/types';

interface CardDetailDialogProps {
    card: KanbanCard;
    boardId: string;
    currentUser: AuthUser;
    onClose: () => void;
}

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const;
const PRIORITY_COLORS: Record<string, string> = { LOW: '#10b981', MEDIUM: '#f59e0b', HIGH: '#f97316', URGENT: '#ef4444' };

export function CardDetailDialog({ card, currentUser, onClose }: CardDetailDialogProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(card.title);
    const [description, setDescription] = useState(card.description ?? '');
    const [priority, setPriority] = useState(card.priority);
    const [isPending, startTransition] = useTransition();
    const { updateCard: storeUpdateCard } = useBoardStore();

    const handleSave = () => {
        const formData = new FormData();
        formData.set('title', title);
        formData.set('description', description);
        formData.set('priority', priority);

        startTransition(async () => {
            const result = await updateCard(card.id, formData);
            if (result.success) {
                storeUpdateCard(card.id, { title, description, priority });
                toast.success('Card updated');
                setIsEditing(false);
            } else {
                toast.error(result.error?.message ?? 'Failed to update card');
            }
        });
    };

    const dueDateOverdue = isOverdue(card.dueDate);

    return (
        <div
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-all"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transform transition-all scale-100">
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex items-start justify-between gap-4">
                    <div className="flex-1">
                        {isEditing ? (
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            />
                        ) : (
                            <h2 className="text-xl font-bold text-gray-900 leading-tight">{title}</h2>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${isEditing
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            disabled={isPending}
                        >
                            {isEditing ? <><Save size={14} /> Save</> : <><Pencil size={14} /> Edit</>}
                        </button>
                        <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-900 bg-white hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto flex flex-col gap-6 bg-white flex-1">
                    {/* Priority */}
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">Priority</label>
                        {isEditing ? (
                            <div className="flex gap-2">
                                {PRIORITIES.map((p) => {
                                    const isSelected = priority === p;
                                    return (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => setPriority(p)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${isSelected
                                                ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm'
                                                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${PRIORITY_BG[card.priority] || 'bg-gray-100 text-gray-600'}`}>{card.priority}</span>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">Description</label>
                        {isEditing ? (
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-y"
                                rows={5}
                                placeholder="Add a detailed description..."
                            />
                        ) : (
                            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-xl border border-gray-100">
                                {description || <span className="text-gray-400 italic">No description provided. Click edit to add one.</span>}
                            </div>
                        )}
                    </div>

                    {/* Meta Info Component */}
                    <div className="flex flex-wrap gap-4 mt-2">
                        {card.dueDate && (
                            <div className="flex flex-col bg-gray-50 border border-gray-100 rounded-xl p-3 min-w-[140px]">
                                <span className="text-[10px] font-bold text-gray-400 uppercase mb-1 flex items-center gap-1">
                                    <Calendar size={12} /> Due Date
                                </span>
                                <div className={`text-sm font-bold flex items-center gap-1.5 ${dueDateOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                                    {dueDateOverdue && <AlertCircle size={14} />}
                                    {format(new Date(card.dueDate), 'PPP')}
                                </div>
                            </div>
                        )}
                        <div className="flex flex-col bg-gray-50 border border-gray-100 rounded-xl p-3 min-w-[140px]">
                            <span className="text-[10px] font-bold text-gray-400 uppercase mb-1 flex items-center gap-1">
                                <User size={12} /> Assignee
                            </span>
                            {card.assignedTo ? (
                                <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] flex-shrink-0">
                                        {card.assignedTo.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="truncate" title={card.assignedTo.email}>
                                        {card.assignedTo.email}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm font-bold text-gray-400 italic">Unassigned</div>
                            )}
                        </div>
                    </div>

                    {/* Labels */}
                    {card.labels && card.labels.length > 0 && (
                        <div className="pt-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 flex items-center gap-1">
                                <Tag size={12} /> Labels
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {card.labels.map((l) => (
                                    <span key={l} className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                                        {l}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="text-[11px] font-bold text-gray-400 border-t border-gray-100 pt-4 mt-2">
                        Created {format(new Date(card.createdAt ?? Date.now()), 'PPP')}
                    </div>
                </div>
            </div>
        </div>
    );
}
