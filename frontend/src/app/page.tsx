"use client";

import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { HeroSection } from "@/components/storytelling/HeroSection";
import { HorizontalStream } from "@/components/storytelling/HorizontalStream";
import { CustomCursor } from "@/components/storytelling/CustomCursor";
import { HowItWorksSection } from "@/components/storytelling/HowItWorksSection";
import { UseCasesSection } from "@/components/storytelling/UseCasesSection";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  useSmoothScroll();

  return (
    <main className="bg-slate-50 min-h-screen text-slate-900 selection:bg-indigo-500/20 selection:text-indigo-900 cursor-none font-sans overflow-x-hidden">
      <CustomCursor />

      {/* Landing Page Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex items-center justify-between mix-blend-difference text-white">
        <div className="text-2xl font-serif tracking-tight font-medium">Loopin.</div>
        <div className="flex items-center gap-6 text-sm font-semibold tracking-wide">
          <Link href="/login" className="hover:text-indigo-300 transition-colors cursor-none" data-cursor="click">
            SIGN IN
          </Link>
          <Link href="/register" className="px-5 py-2.5 bg-white text-black rounded-full hover:bg-slate-200 transition-colors cursor-none" data-cursor="click">
            GET STARTED
          </Link>
        </div>
      </header>

      <HeroSection />

      <HorizontalStream />

      <HowItWorksSection />

      <UseCasesSection />

      {/* Footer / Outro */}
      <section className="h-[50vh] flex flex-col items-center justify-center relative border-t border-slate-200 bg-white overflow-hidden text-center z-10">
        <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-6">Ready to sync your team?</h2>
        <p className="text-slate-500 max-w-lg mb-8">Join Loopin today and transform your project management with real-time kanban boards, live presence, and drag-and-drop velocity.</p>
        <Link
          href="/register"
          className="px-8 py-4 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all uppercase tracking-wider text-sm"
          data-cursor="click"
          data-cursor-text="JOIN"
        >
          Enter the Workspace
        </Link>

        {/* Live Sync Ticker */}
        <div className="absolute bottom-4 left-0 w-full overflow-hidden flex whitespace-nowrap opacity-40 pointer-events-none text-slate-400">
          <div className="animate-[marquee_20s_linear_infinite] flex gap-8 text-xs font-mono tracking-widest uppercase">
            <span>Alex moved API Auth to In-Review</span>
            <span className="text-indigo-400">•</span>
            <span>Elena joined Sprint Board #4</span>
            <span className="text-cyan-500">•</span>
            <span>Socket Latency: 8ms</span>
            <span className="text-indigo-400">•</span>
            <span>Optimistic Rollback Guard active</span>
            <span className="text-cyan-500">•</span>
            <span>Task "Fix CSS" completed by Dan</span>
            <span className="text-indigo-400">•</span>
          </div>
          <div className="animate-[marquee_20s_linear_infinite] flex gap-8 text-xs font-mono tracking-widest uppercase" aria-hidden="true">
            <span>Alex moved API Auth to In-Review</span>
            <span className="text-indigo-400">•</span>
            <span>Elena joined Sprint Board #4</span>
            <span className="text-cyan-500">•</span>
            <span>Socket Latency: 8ms</span>
            <span className="text-indigo-400">•</span>
            <span>Optimistic Rollback Guard active</span>
            <span className="text-cyan-500">•</span>
            <span>Task "Fix CSS" completed by Dan</span>
            <span className="text-indigo-400">•</span>
          </div>
        </div>
      </section>
    </main>
  );
}
