"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

interface FeatureModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: {
        title: string;
        description: string;
        chapter: string;
    } | null;
}

export const FeatureModal = ({ isOpen, onClose, data }: FeatureModalProps) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && data && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                        data-cursor="click"
                        data-cursor-text="CLOSE"
                    />

                    {/* Modal Content */}
                    <motion.div
                        layoutId={`modal-card-${data.chapter}`}
                        className="relative w-full max-w-4xl max-h-[85vh] bg-white rounded-3xl border border-slate-200 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col md:flex-row z-10"
                    >
                        {/* Visual Header / Left Pane */}
                        <div className="w-full md:w-1/2 bg-gradient-to-br from-indigo-50 to-white p-8 md:p-12 flex flex-col justify-end border-b md:border-b-0 md:border-r border-slate-100 relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.1),transparent_50%)]" />
                            <h2 className="text-4xl sm:text-5xl font-serif text-slate-800 font-medium leading-tight z-10 relative">
                                {data.title}
                            </h2>
                        </div>

                        {/* Body */}
                        <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto">
                            <div className="text-indigo-600 font-bold font-mono text-sm tracking-[0.2em] mb-6 uppercase">
                                {data.chapter} Detail
                            </div>
                            <p className="text-slate-600 font-sans text-lg leading-relaxed mb-8">
                                {data.description}
                                <br /><br />
                                Loopin uses a combination of Redis Pub/Sub and Socket.io to ensure that every single board movement you make is distributed to your teammates globally in under 50ms, resolving conflicts automatically.
                            </p>

                            <div className="space-y-4">
                                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
                                    <h4 className="text-slate-800 font-semibold mb-1">Architecture</h4>
                                    <p className="text-slate-500 text-sm">Next.js App Router caching with optimistic UI data-binding.</p>
                                </div>
                                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
                                    <h4 className="text-slate-800 font-semibold mb-1">Security</h4>
                                    <p className="text-slate-500 text-sm">Role-based access controls applied synchronously over websockets.</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors z-20 shadow-sm"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
