"use client";

import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { Activity, Clock, Zap } from "lucide-react";

interface MomentCardProps {
    title: string;
    description: string;
    chapter: string;
    telemetry: {
        latency: string;
        guard: string;
        sync: string;
    };
    index: number;
}

export const MomentCard = ({ title, description, chapter, telemetry, index }: MomentCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const maxRotate = 15;
        const rotateXValue = ((y - centerY) / centerY) * -maxRotate;
        const rotateYValue = ((x - centerX) / centerX) * maxRotate;

        setRotateX(rotateXValue);
        setRotateY(rotateYValue);
    };

    const handleMouseLeave = () => {
        setRotateX(0);
        setRotateY(0);
    };

    return (
        <div
            className="shrink-0 w-[500px] sm:w-[600px] h-[70vh] flex flex-col justify-center px-8 relative"
        >
            <div className="text-indigo-600 font-bold font-mono text-xs tracking-[0.2em] mb-4 uppercase">
                {chapter}
            </div>

            <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                animate={{
                    rotateX,
                    rotateY,
                    transformPerspective: 1000,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative w-full h-[65%] rounded-3xl bg-white border border-slate-200 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] p-8 group cursor-none overflow-hidden"
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Decorative ambient glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div style={{ transform: "translateZ(50px)" }} className="relative z-10 h-full flex flex-col justify-between pointer-events-none">
                    <div>
                        <h3 className="text-3xl font-serif text-slate-800 mb-3 leading-tight tracking-tight font-medium">
                            {title}
                        </h3>
                        <p className="text-slate-500 font-sans text-[15px] leading-relaxed max-w-sm">
                            {description}
                        </p>
                    </div>

                    <div className="flex gap-3 mt-8 flex-wrap">
                        <div className="flex items-center gap-2 bg-slate-50 rounded-full px-4 py-2 border border-slate-200 text-xs text-slate-600 font-medium whitespace-nowrap shadow-sm">
                            <Clock className="w-3.5 h-3.5 text-indigo-500" />
                            <span>{telemetry.latency}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 rounded-full px-4 py-2 border border-slate-200 text-xs text-slate-600 font-medium whitespace-nowrap shadow-sm">
                            <Zap className="w-3.5 h-3.5 text-cyan-500" />
                            <span>{telemetry.guard}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 rounded-full px-4 py-2 border border-slate-200 text-xs text-slate-600 font-medium whitespace-nowrap shadow-sm">
                            <Activity className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{telemetry.sync}</span>
                        </div>
                    </div>
                </div>

                {/* Mockup visual representation in background layer */}
                <div
                    style={{ transform: "translateZ(20px)" }}
                    className="absolute inset-y-10 right-[-20%] w-[80%] rounded-2xl bg-white border border-slate-100 shadow-2xl opacity-75 flex flex-col p-5 gap-3"
                >
                    <div className="w-full h-10 bg-slate-100 rounded-lg" />
                    <div className="w-3/4 h-10 bg-indigo-50 rounded-lg" />
                    <div className="w-full h-32 bg-slate-50 rounded-lg mt-6 shadow-inner border border-slate-100" />
                </div>
            </motion.div>
        </div>
    );
};
