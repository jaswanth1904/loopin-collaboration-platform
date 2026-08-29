"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MomentCard } from "./MomentCard";

gsap.registerPlugin(ScrollTrigger);

const CHAPTERS = [
    {
        chapter: "Workflow 01",
        title: "Instant Kanban Sync",
        description: "Move tasks fluidly across columns. Watch them instantly update on your entire team's screens with zero latency.",
        telemetry: { latency: "<12ms", guard: "Optimistic", sync: "Realtime WebSockets" }
    },
    {
        chapter: "Workflow 02",
        title: "Live Multiplayer Presence",
        description: "See exactly who is online and what they are working on. Dynamic custom cursors glide across your boards.",
        telemetry: { latency: "Live", guard: "Active", sync: "Presence Engine" }
    },
    {
        chapter: "Workflow 03",
        title: "The Tactile Experience",
        description: "Drag-and-drop mechanics feel physical and responsive, ensuring your project planning is intuitive and seamless.",
        telemetry: { latency: "<15ms", guard: "Strict", sync: "Fractional Reordering" }
    },
    {
        chapter: "Workflow 04",
        title: "Velocity & Analytics",
        description: "Gain complete observability over your sprints. Automated milestones and activity feeds keep everyone looped in.",
        telemetry: { latency: "Instant", guard: "Active", sync: "Event Sourced DB" }
    }
];

export const HorizontalStream = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const section = sectionRef.current;
            const container = containerRef.current;

            if (section && container) {
                const getScrollAmount = () => -(container.scrollWidth - window.innerWidth);

                gsap.to(container, {
                    x: getScrollAmount,
                    ease: "none",
                    scrollTrigger: {
                        trigger: section,
                        start: "top top",
                        end: () => `+=${container.scrollWidth}`,
                        pin: true,
                        scrub: 1,
                        invalidateOnRefresh: true,
                    }
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="h-screen w-full overflow-hidden bg-slate-100 relative">
            {/* Progress Timeline Indicator */}
            <div className="absolute bottom-10 left-10 right-10 h-[2px] bg-slate-300 z-50 pointer-events-none rounded-full">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: '0%', transition: 'width 0.1s linear' }} id="progress-bar" />
            </div>

            <div
                ref={containerRef}
                className="h-full flex items-center px-[10vw] gap-10 sm:gap-20 w-max"
            >
                {CHAPTERS.map((chapter, i) => (
                    <div key={i} className="flex-shrink-0">
                        <MomentCard
                            {...chapter}
                            index={i}
                        />
                    </div>
                ))}

                <div className="w-[10vw] flex-shrink-0" />
            </div>
        </section>
    );
};
