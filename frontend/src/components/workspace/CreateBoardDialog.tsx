'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { createBoard } from '@/app/actions/workspace.actions';
import { useRouter } from 'next/navigation';
import { Plus, X, Loader2, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CreateBoardDialogProps {
    workspaceId: string;
}

export function CreateBoardDialog({ workspaceId }: CreateBoardDialogProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.set('workspaceId', workspaceId);

        startTransition(async () => {
            const result = await createBoard(formData);
            if (result.success && result.data) {
                toast.success('Board created!');
                setOpen(false);
                router.push(`/dashboard/workspaces/${workspaceId}/boards/${result.data.id}`);
                router.refresh();
            } else {
                toast.error(result.error?.message ?? 'Failed to create board');
            }
        });
    };

    return (
        <>
            <button onClick={() => setOpen(true)} className="flex items-center gap-2 bg-indigo-600 text-white font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all shrink-0">
                <Plus size={16} /> New Board
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white w-full max-w-md rounded-[24px] shadow-2xl shadow-indigo-900/10 border border-gray-100 overflow-hidden"
                        >
                            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100">
                                        <LayoutDashboard size={16} className="text-indigo-600" />
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900 tracking-tight">New Board</h2>
                                </div>
                                <button
                                    onClick={() => setOpen(false)}
                                    className="text-gray-400 hover:text-gray-900 bg-white hover:bg-gray-100 p-2 rounded-full transition-colors border border-gray-200 shadow-sm"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Board Title</label>
                                    <input
                                        name="title"
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                                        placeholder="e.g. Sprint 2025 Q3"
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
                                        placeholder="What is this board for?"
                                        rows={2}
                                    />
                                </div>
                                <p className="text-xs font-semibold text-gray-500 bg-indigo-50/50 border border-indigo-100 rounded-xl p-3 leading-relaxed">
                                    <span className="text-indigo-500 font-bold mr-1">✦</span> Board will be pre-populated with <span className="font-bold text-gray-700 bg-gray-100 px-1 py-0.5 rounded">To Do</span>, <span className="font-bold text-gray-700 bg-gray-100 px-1 py-0.5 rounded">In Progress</span>, <span className="font-bold text-gray-700 bg-gray-100 px-1 py-0.5 rounded">In Review</span>, and <span className="font-bold text-gray-700 bg-gray-100 px-1 py-0.5 rounded">Done</span> columns.
                                </p>
                                <div className="flex gap-3 mt-2">
                                    <button
                                        type="button"
                                        onClick={() => setOpen(false)}
                                        className="flex-1 px-4 py-3 bg-white text-gray-700 font-bold text-sm border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 shadow-md hover:shadow-indigo-200 transition-all disabled:opacity-50"
                                    >
                                        {isPending ? <><Loader2 size={16} className="animate-spin" /> Creating...</> : 'Create Board'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
