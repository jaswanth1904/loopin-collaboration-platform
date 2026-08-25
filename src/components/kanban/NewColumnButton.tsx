'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { createColumn } from '@/app/actions/board.actions';
import { useBoardStore } from '@/stores/useBoardStore';
import { Plus, X, Check } from 'lucide-react';

export function NewColumnButton({ boardId }: { boardId: string }) {
    const [isAdding, setIsAdding] = useState(false);
    const [title, setTitle] = useState('');
    const [isPending, startTransition] = useTransition();
    const { addColumn } = useBoardStore();

    const handleSubmit = () => {
        if (!title.trim()) return;
        const formData = new FormData();
        formData.set('title', title.trim());

        startTransition(async () => {
            const result = await createColumn(boardId, formData);
            if (result.success && result.data) {
                addColumn({ id: result.data.id, title: result.data.title, orderIndex: result.data.orderIndex, boardId: result.data.boardId, cards: [] });
                toast.success('Column added');
                setTitle('');
                setIsAdding(false);
            } else {
                toast.error(result.error?.message ?? 'Failed to add column');
            }
        });
    };

    if (!isAdding) {
        return (
            <button
                onClick={() => setIsAdding(true)}
                className="min-w-[300px] h-[64px] bg-indigo-50/50 hover:bg-indigo-50 border-2 border-dashed border-indigo-200 hover:border-indigo-400 rounded-2xl text-indigo-500 font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all flex-shrink-0"
            >
                <Plus size={18} strokeWidth={2.5} /> Add Column
            </button>
        );
    }

    return (
        <div className="min-w-[300px] flex-shrink-0 bg-white border border-gray-200 rounded-2xl p-3 shadow-md shadow-indigo-900/5">
            <input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSubmit();
                    if (e.key === 'Escape') { setIsAdding(false); setTitle(''); }
                }}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 mb-2"
                placeholder="Column name..."
            />
            <div className="flex gap-2">
                <button
                    onClick={handleSubmit}
                    disabled={isPending || !title.trim()}
                    className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                    <Check size={14} /> Add Column
                </button>
                <button
                    onClick={() => { setIsAdding(false); setTitle(''); }}
                    className="flex items-center justify-center px-3 py-2 bg-white text-gray-400 border border-gray-200 font-bold text-xs rounded-xl hover:bg-gray-50 hover:text-red-500 transition-colors"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}
