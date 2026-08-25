'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { createWorkspace } from '@/app/actions/workspace.actions';
import { useRouter } from 'next/navigation';
import { Plus, X, Loader2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CreateWorkspaceDialogProps {
    trigger?: React.ReactNode;
}

export function CreateWorkspaceDialog({ trigger }: CreateWorkspaceDialogProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(async () => {
            const result = await createWorkspace(formData);
            if (result.success && result.data) {
                toast.success('Workspace created!');
                setOpen(false);
                router.push(`/dashboard/workspaces/${result.data.id}`);
            } else {
                toast.error(result.error?.message ?? 'Failed to create workspace');
            }
        });
    };

    return (
        <>
            <div onClick={() => setOpen(true)} className="cursor-pointer">
                {trigger ?? (
                    <button className="flex items-center gap-2 bg-indigo-600 text-white font-bold text-sm px-4 py-2 rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all">
                        <Plus size={16} /> New Workspace
                    </button>
                )}
            </div>

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
                                        <Zap size={16} className="text-indigo-600 fill-indigo-200" />
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900 tracking-tight">New Workspace</h2>
                                </div>
                                <button
                                    onClick={() => setOpen(false)}
                                    className="text-gray-400 hover:text-gray-900 bg-white hover:bg-gray-100 p-2 rounded-full transition-colors border border-gray-200 shadow-sm"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Workspace Name</label>
                                    <input
                                        name="name"
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                                        placeholder="e.g. Engineering Team"
                                        autoFocus
                                    />
                                </div>
                                <div className="flex gap-3">
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
                                        {isPending ? <><Loader2 size={16} className="animate-spin" /> Creating...</> : 'Create'}
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
