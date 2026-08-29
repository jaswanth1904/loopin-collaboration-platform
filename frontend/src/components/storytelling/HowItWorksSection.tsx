"use client";

import { motion } from "framer-motion";
import { Circle, MessageSquare, Briefcase, Zap } from "lucide-react";

export const HowItWorksSection = () => {
    return (
        <section className="w-full py-32 bg-white relative">
            <div className="max-w-6xl mx-auto px-8 relative z-10">
                <div className="text-center mb-24">
                    <h2 className="text-4xl md:text-5xl font-serif text-slate-800 font-medium mb-6">How Your Team Stays Linked</h2>
                    <p className="text-slate-500 font-sans text-xl max-w-2xl mx-auto">
                        From instant contextual messaging to live presence tracking, Loopin keeps the communication workflow running inside the context of your project.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Card 1 */}
                    <div
                        className="group relative p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-[0_20px_60px_-15px_rgba(99,102,241,0.15)] transition-all duration-300"
                        data-cursor="click"
                        data-cursor-text="READ"
                    >
                        <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                            <Circle className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Deep Presence Engine</h3>
                        <p className="text-slate-500 leading-relaxed">
                            Instantly know who is available. Employees can set granular statuses—Online, Busy, or Do Not Disturb. The platform automatically restricts notifications when focus is required.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div
                        className="group relative p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-[0_20px_60px_-15px_rgba(99,102,241,0.15)] transition-all duration-300"
                        data-cursor="click"
                        data-cursor-text="READ"
                    >
                        <div className="w-14 h-14 bg-cyan-100 text-cyan-600 rounded-2xl flex items-center justify-center mb-6">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Contextual Messaging</h3>
                        <p className="text-slate-500 leading-relaxed">
                            No more switching between kanban and chat apps. Conversations happen directly on tasks and boards. Pin comments, resolve discussions, and trace the decision history.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div
                        className="group relative p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-[0_20px_60px_-15px_rgba(99,102,241,0.15)] transition-all duration-300"
                        data-cursor="click"
                        data-cursor-text="READ"
                    >
                        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                            <Zap className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Real-Time Telemetry</h3>
                        <p className="text-slate-500 leading-relaxed">
                            If an employee logs out or disconnects and works offline, the workspace catches up instantly via Socket.io the moment they reconnect. Zero missed updates.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
