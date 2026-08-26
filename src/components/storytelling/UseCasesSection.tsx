"use client";

import { motion } from "framer-motion";
import { Users, TrendingUp } from "lucide-react";

export const UseCasesSection = () => {
    return (
        <section className="w-full py-32 bg-slate-50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-indigo-100 rounded-full blur-[100px] opacity-50 pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-100 rounded-full blur-[100px] opacity-50 pointer-events-none" />

            <div className="max-w-6xl mx-auto px-8 relative z-10 flex flex-col md:flex-row items-center gap-16">

                <div className="w-full md:w-1/2">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-500 text-xs font-bold tracking-wide mb-6 shadow-sm">
                        <Users className="w-4 h-4 text-indigo-500" />
                        BUILT FOR LEAN TEAMS
                    </div>

                    <h2 className="text-4xl md:text-5xl font-serif text-slate-800 font-medium mb-6 leading-tight">
                        Designed for Startups & Mid-Tier Companies
                    </h2>

                    <p className="text-slate-600 font-sans text-lg mb-8 leading-relaxed">
                        We understand that emerging companies run with lean HR teams and flat management structures. Managing dozens of employees shouldn't require a bloated suite of tools.
                        <br /><br />
                        Loopin was purposefully engineered for startups where a single manager needs to effortlessly track the progress, status, and velocity of multiple employees simultaneously, yielding enterprise-grade results without the enterprise overhead.
                    </p>

                    <ul className="space-y-4">
                        <li className="flex items-center gap-3 text-slate-700 font-medium bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                            <span className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">1</span>
                            Consolidated Employee Status Tracking
                        </li>
                        <li className="flex items-center gap-3 text-slate-700 font-medium bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                            <span className="w-8 h-8 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-600 font-bold">2</span>
                            Low-Overhead Managerial Dashboards
                        </li>
                        <li className="flex items-center gap-3 text-slate-700 font-medium bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                            <span className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold">3</span>
                            Automated Sprint & Velocity Analytics
                        </li>
                    </ul>
                </div>

                <div className="w-full md:w-1/2 relative h-[500px]">
                    <div
                        className="absolute inset-0 bg-white rounded-3xl border border-slate-200 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden"
                        data-cursor="drag"
                        data-cursor-text="PREVIEW"
                    >
                        {/* Dashboard Mockup Representation */}
                        <div className="w-full h-14 border-b border-slate-100 flex items-center px-6 gap-4 bg-slate-50/50">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-slate-300" />
                                <div className="w-3 h-3 rounded-full bg-slate-300" />
                                <div className="w-3 h-3 rounded-full bg-slate-300" />
                            </div>
                            <div className="h-6 w-48 bg-white border border-slate-100 rounded-md mx-6" />
                        </div>

                        <div className="p-6 flex flex-col gap-4 h-full bg-[radial-gradient(#f8fafc_1px,transparent_1px)] [background-size:16px_16px]">
                            <div className="h-10 w-1/3 bg-slate-100 rounded-lg" />

                            <div className="flex gap-4 mt-4">
                                <div className="w-1/3 h-64 bg-slate-50 border border-slate-100 rounded-xl p-4 shadow-sm">
                                    <div className="h-4 w-1/2 bg-slate-200 rounded mb-4" />
                                    <div className="h-16 w-full bg-white border border-indigo-100 rounded-lg mb-2 shadow-sm relative overflow-hidden">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400" />
                                    </div>
                                    <div className="h-16 w-full bg-white border border-slate-100 rounded-lg shadow-sm border-l-4 border-l-amber-400" />
                                </div>

                                <div className="w-1/3 h-64 bg-slate-50 border border-slate-100 rounded-xl p-4 shadow-sm">
                                    <div className="h-4 w-1/2 bg-slate-200 rounded mb-4" />
                                    <div className="h-16 w-full bg-white border border-slate-100 rounded-lg mb-2 shadow-sm border-l-4 border-l-red-400" />
                                </div>

                                <div className="w-1/3 h-64 bg-slate-50 border border-slate-100 rounded-xl p-4 shadow-sm">
                                    <div className="h-4 w-1/2 bg-slate-200 rounded mb-4" />
                                    <div className="h-16 w-full bg-white border border-slate-100 rounded-lg shadow-sm border-l-4 border-l-slate-300" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};
