'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { createCard } from '@/app/actions/board.actions';
import { useBoardStore } from '@/stores/useBoardStore';
import { X, Loader2, Tag } from 'lucide-react';

interface NewTaskDialogProps {
    columnId: string;
    onClose: () => void;
}

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const;
const PRIORITY_COLORS: Record<string, string> = {
    LOW: '#10b981',
    MEDIUM: '#f59e0b',
    HIGH: '#f97316',
    URGENT: '#ef4444',
};

export function NewTaskDialog({ columnId, onClose }: NewTaskDialogProps) {
    const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
    const [labelInput, setLabelInput] = useState('');
    const [labels, setLabels] = useState<string[]>([]);
    const [isPending, startTransition] = useTransition();
    const { addCard } = useBoardStore();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.set('columnId', columnId);
        formData.set('priority', priority);
        labels.forEach(l => formData.append('labels', l));

        startTransition(async () => {
            const result = await createCard(formData);
            if (result.success && result.data) {
                addCard({
                    id: result.data.id,
                    title: result.data.title,
                    description: result.data.description,
                    orderIndex: result.data.orderIndex,
                    priority: result.data.priority,
                    columnId: result.data.columnId,
                    assignedToId: result.data.assignedToId,
                    dueDate: result.data.dueDate ? String(result.data.dueDate) : null,
                    labels: result.data.labels,
                    assignedTo: result.data.assignedTo as KanbanCardAssignee | null,
                });
                toast.success('Card created!');
                onClose();
            } else {
                toast.error(result.error?.message ?? 'Failed to create card');
            }
        });
    };

    const addLabel = () => {
        if (labelInput.trim() && !labels.includes(labelInput.trim()) && labels.length < 5) {
            setLabels([...labels, labelInput.trim()]);
            setLabelInput('');
        }
    };

    return (
        <div
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white w-full max-w-lg rounded-[24px] shadow-2xl shadow-indigo-900/10 border border-gray-100 overflow-hidden transform transition-all scale-100">
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900 tracking-tight">New Card</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-900 bg-white hover:bg-gray-100 p-2 rounded-full transition-colors border border-gray-200">
                        <X size={16} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Title *</label>
                        <input
                            name="title"
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                            placeholder="What needs to be done?"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
                            placeholder="Add more details..."
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Priority</label>
                            <div className="flex gap-2">
                                {PRIORITIES.map((p) => {
                                    const isSelected = priority === p;
                                    return (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => setPriority(p)}
                                            className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${isSelected
                                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                                                : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            {p.charAt(0)}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Due Date</label>
                            <input
                                name="dueDate"
                                type="datetime-local"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Assignee Email (Optional)</label>
                        <input
                            name="assigneeEmail"
                            type="email"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                            placeholder="employee@company.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Labels</label>
                        <div className="flex gap-2 flex-wrap mb-2">
                            {labels.map((l) => (
                                <span key={l} className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                                    {l}
                                    <button type="button" onClick={() => setLabels(labels.filter((x) => x !== l))} className="hover:text-red-500 font-bold">×</button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                value={labelInput}
                                onChange={(e) => setLabelInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLabel(); } }}
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                placeholder="Add label... (Press Enter)"
                            />
                            <button type="button" onClick={addLabel} className="bg-white border border-gray-200 rounded-xl px-4 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-indigo-600 transition-colors shadow-sm">
                                <Tag size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2 mt-2 border-t border-gray-100">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-3 bg-white text-gray-700 font-bold text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={isPending} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 shadow-md hover:shadow-indigo-200 transition-all disabled:opacity-50">
                            {isPending ? <><Loader2 size={16} className="animate-spin" /> Creating...</> : 'Create Card'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type KanbanCardAssignee = any;
