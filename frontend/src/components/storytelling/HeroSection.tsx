"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export const HeroSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { innerWidth, innerHeight } = window;
            const x = (e.clientX / innerWidth - 0.5) * 2;
            const y = (e.clientY / innerHeight - 0.5) * 2;
            setMousePos({ x, y });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative w-full h-[120vh] flex flex-col items-center justify-center overflow-hidden bg-slate-50"
            data-cursor="drag"
            data-cursor-text="EXPLORE"
        >
            {/* Ambient Canvas / Grid */}
            <div
                className="absolute inset-0 z-0 opacity-40 pointer-events-none transition-transform duration-1000 ease-out"
                style={{
                    transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px) scale(1.05)`,
                    backgroundImage: `
            linear-gradient(to right, rgba(99,102,241,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99,102,241,0.05) 1px, transparent 1px)
          `,
                    backgroundSize: '4rem 4rem'
                }}
            />

            {/* Glowing nodes overlay */}
            <div
                className="absolute w-[800px] h-[800px] rounded-full blur-[120px] pointer-events-none transition-transform duration-1000 ease-out z-0"
                style={{
                    background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(6,182,212,0.1) 50%, transparent 70%)",
                    transform: `translate(${mousePos.x * 50}px, ${mousePos.y * 50}px)`
                }}
            />

            {/* Typography Reveal */}
            <div className="z-10 text-center px-4 max-w-5xl mx-auto mt-20">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.1 } }
                    }}
                    className="flex flex-col items-center gap-6"
                >
                    <div className="overflow-hidden">
                        <motion.div
                            variants={{
                                hidden: { y: "100%", opacity: 0 },
                                visible: { y: "0%", opacity: 1 }
                            }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold tracking-wide mb-6"
                        >
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                            Real-Time Collaboration Evolved
                        </motion.div>
                    </div>

                    <div className="overflow-hidden">
                        <motion.h1
                            variants={{
                                hidden: { y: "100%", opacity: 0 },
                                visible: { y: "0%", opacity: 1 }
                            }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="text-6xl md:text-8xl lg:text-[7rem] font-serif font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-600 leading-[1.1]"
                        >
                            Manage Projects.
                            <br />
                            At Light Speed.
                        </motion.h1>
                    </div>

                    <div className="overflow-hidden mt-6">
                        <motion.p
                            variants={{
                                hidden: { y: "100%", opacity: 0 },
                                visible: { y: "0%", opacity: 1 }
                            }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                            className="text-slate-600 font-sans text-xl md:text-2xl font-light tracking-wide max-w-2xl leading-relaxed"
                        >
                            Loopin is a high-performance workspace designed for team momentum. Say goodbye to latency and hello to instantaneous Kanban sync.
                        </motion.p>
                    </div>
                </motion.div>
            </div>

            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-indigo-500 font-mono text-xs animate-bounce">
                <span className="font-bold tracking-widest">SCROLL TO EXPLORE</span>
                <div className="w-[2px] h-12 bg-gradient-to-b from-indigo-500 to-transparent" />
            </div>
        </section>
    );
};
