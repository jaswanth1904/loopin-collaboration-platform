"use client";

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { LayoutGrid, Users, Shield, Activity, Lock, Globe, ArrowRight, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import React from 'react';

export default function LandingPage() {
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacityHero = useTransform(scrollY, [0, 400], [1, 0]);

  const features = [
    { icon: LayoutGrid, title: 'Real-Time Sync', desc: 'Drag-and-drop across columns with instant cross-client synchronization powered by websockets.' },
    { icon: Users, title: 'Live Presence', desc: 'See who\'s working live with cursor tracking and avatar indicators in real time.' },
    { icon: Shield, title: 'Role Access', desc: 'Admin, Member, and Viewer roles with granular workspace permissions at the core.' },
    { icon: Activity, title: 'Audit Streams', desc: 'Full activity logs capturing every card move, creation, and deletion seamlessly.' },
    { icon: Lock, title: 'Secure Default', desc: 'Enterprise-grade security with JWT sessions and Zod validation on every single mutation.' },
    { icon: Globe, title: 'Optimistic UI', desc: 'Instant feedback with automatic rollback on server failures — yielding zero lag.' },
  ];

  const plans = [
    { name: "Starter", price: "Free", desc: "For small agile teams.", features: ["Up to 3 boards", "Unlimited basic cards", "Real-time sync", "Community support"], popular: false },
    { name: "Pro", price: "$12", desc: "For scaling engineering orgs.", features: ["Unlimited boards", "Role-based access", "Audit streams", "Priority support", "Custom workflows"], popular: true },
    { name: "Enterprise", price: "Custom", desc: "For massive scale.", features: ["SAML SSO", "On-premise deployment", "Dedicated success manager", "White-labeling"], popular: false }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 overflow-hidden font-sans selection:bg-indigo-500/20">

      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-center items-center overflow-hidden">
        <div className="absolute top-[-20%] w-[1000px] h-[600px] bg-indigo-200/40 blur-[120px] rounded-[100%]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[500px] bg-purple-200/40 blur-[120px] rounded-[100%]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4 md:px-12 max-w-7xl mx-auto border-b border-gray-200/50 bg-white/70 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-3">
          <img src="/icon.svg" className="w-8 h-8 drop-shadow-sm" alt="LoopIn Logo" />
          <span className="text-lg font-semibold tracking-tight text-gray-900">LoopIn</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Features</Link>
          <Link href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Pricing</Link>
          <Link href="#developers" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Developers</Link>
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/login">
            <span className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">Sign in</span>
          </Link>
          <Link href="/register">
            <button className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-all shadow-md shadow-gray-300 hover:shadow-lg hover:shadow-gray-300">
              Get Started
            </button>
          </Link>
        </div>
      </nav>

      <main className="relative z-10 flex flex-col items-center">

        {/* Hero Section */}
        <motion.section
          style={{ y: yHero, opacity: opacityHero }}
          className="pt-32 pb-24 px-6 text-center max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[85vh]"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-indigo-100 text-indigo-700 text-xs font-medium mb-10 shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            V2.0 Collaborative Engine
            <ChevronRight size={14} className="text-indigo-400" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-gray-900 via-gray-800 to-gray-500 leading-[1.05] mb-8"
          >
            The project board <br className="hidden md:block" />
            for fast teams.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-12"
          >
            LoopIn is the beautifully designed, highly performant project management tool built for teams that demand velocity and real-time collaboration.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/register">
              <button className="h-12 flex items-center justify-center gap-2 px-8 bg-gray-900 text-white font-semibold rounded-full hover:scale-105 transition-transform duration-300 shadow-xl shadow-gray-200">
                Start building free <ArrowRight size={16} />
              </button>
            </Link>
          </motion.div>
        </motion.section>

        {/* Dashboard Preview mockup */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 mb-40 z-20 perspective-[2000px]"
        >
          <div className="rounded-[24px] border border-gray-200 bg-white/60 backdrop-blur-xl shadow-2xl overflow-hidden shadow-indigo-500/5 ring-1 ring-white/50 transform rotate-x-[2deg] scale-[0.98]">
            <div className="h-12 bg-gray-50/80 border-b border-gray-200 flex items-center px-6 gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Mock column 1 */}
              <div className="h-96 rounded-2xl bg-gray-50/50 border border-gray-200/60 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700 text-sm">Backlog</span>
                  <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full text-[10px] font-bold">2</span>
                </div>
                <div className="h-28 bg-white rounded-xl shadow-sm border border-gray-200/60 p-4 hover:border-gray-300 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-semibold text-indigo-600 border border-indigo-200 bg-indigo-50 px-2 py-0.5 rounded">ENG-101</span>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-orange-400 to-rose-400 border-2 border-white shadow-sm" />
                  </div>
                  <div className="h-3 w-3/4 bg-gray-200 rounded mb-2" />
                  <div className="h-3 w-1/2 bg-gray-100 rounded" />
                </div>
                <div className="h-28 bg-white rounded-xl shadow-sm border border-gray-200/60 p-4 hover:border-gray-300 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-semibold text-emerald-600 border border-emerald-200 bg-emerald-50 px-2 py-0.5 rounded">ENG-102</span>
                  </div>
                  <div className="h-3 w-full bg-gray-200 rounded mb-2" />
                  <div className="h-3 w-2/3 bg-gray-100 rounded" />
                </div>
              </div>

              {/* Mock column 2 */}
              <div className="h-96 rounded-2xl bg-gray-50/50 border border-gray-200/60 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700 text-sm">In Progress</span>
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-bold">1</span>
                </div>
                <div className="h-32 bg-white rounded-xl shadow-lg border-2 border-indigo-300 p-4 transform -rotate-1 relative shadow-indigo-100">
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-indigo-500 rounded-full border-2 border-white flex items-center justify-center shadow-md">
                    <Users size={14} className="text-white" />
                  </div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-semibold text-pink-600 border border-pink-200 bg-pink-50 px-2 py-0.5 rounded">DESIGN-41</span>
                  </div>
                  <div className="h-3 w-5/6 bg-gray-200 rounded mb-2" />
                  <div className="h-3 w-full bg-gray-100 rounded mb-5" />
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 w-2/3" />
                  </div>
                </div>
              </div>

              {/* Mock column 3 */}
              <div className="h-96 rounded-2xl bg-gray-50/50 border border-gray-200/60 p-4 space-y-4 hidden md:block">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700 text-sm">Review</span>
                  <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full text-[10px] font-bold">0</span>
                </div>
                <div className="w-full h-24 border-2 border-dashed border-gray-300 bg-gray-50/50 rounded-xl flex items-center justify-center text-gray-500 text-sm font-medium">
                  Drag cards here
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <section id="features" className="w-full max-w-7xl mx-auto px-6 py-24">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
              Performance by design.
            </h2>
            <p className="text-lg text-gray-600">
              Built on a modern tech stack to ensure every action happens instantly. No loaders, no spinning wheels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  key={f.title}
                  className="group relative bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center mb-6 bg-gray-50 shadow-inner group-hover:scale-110 transition-transform duration-300">
                      <Icon size={20} className="text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">{f.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-sm">{f.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="w-full py-32 border-t border-gray-200 mt-12 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">Simple pricing.</h2>
              <p className="text-lg text-gray-600">Everything you need to launch, completely uncompromised.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {plans.map((plan, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  key={plan.name}
                  className={`relative rounded-3xl p-8 flex flex-col ${plan.popular ? 'bg-indigo-50 border-2 border-indigo-500 shadow-xl shadow-indigo-100' : 'bg-white border border-gray-200 shadow-sm'}`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-8 -translate-y-1/2 px-3 py-1 bg-indigo-500 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                      Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-6 pb-6 border-b border-gray-200">{plan.desc}</p>
                  <div className="mb-8">
                    <span className="text-5xl font-extrabold text-gray-900 tracking-tight">{plan.price}</span>
                    {plan.price !== 'Custom' && plan.price !== 'Free' && <span className="text-gray-500 font-medium">/mo</span>}
                  </div>

                  <ul className="space-y-4 mb-10 flex-1">
                    {plan.features.map(feat => (
                      <li key={feat} className="flex items-center gap-3 text-gray-700 text-sm font-medium">
                        <CheckCircle2 size={16} className="text-indigo-500" />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <button className={`w-full py-3 rounded-full font-bold transition-all text-sm ${plan.popular ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}>
                    Choose {plan.name}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="w-full max-w-5xl mx-auto px-6 py-32 text-center">
          <div className="bg-gray-900 border border-gray-800 rounded-[32px] p-12 md:p-24 relative overflow-hidden flex flex-col items-center shadow-2xl">

            <div className="absolute top-[-50%] p-[100px] bg-indigo-500/30 blur-[100px] rounded-[100%]" />

            <div className="relative z-10 flex flex-col items-center text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-8">
                Ship faster.
              </h2>
              <p className="text-lg text-gray-300 max-w-xl mx-auto mb-10 leading-relaxed">
                Join thousands of fast-moving software teams who dropped legacy systems for a beautifully minimal workspace.
              </p>
              <Link href="/register">
                <button className="px-8 py-4 bg-white text-gray-900 text-sm font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.15)] flex items-center gap-2">
                  Get Started <ArrowRight size={16} />
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full border-t border-gray-200 py-12 px-6 bg-slate-50">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <img src="/icon.svg" className="w-6 h-6 grayscale hover:grayscale-0 transition-all opacity-80 hover:opacity-100" alt="LoopIn Logo" />
              <span className="font-bold text-gray-900 tracking-tight">LoopIn</span>
            </div>
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} LoopIn Inc. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-gray-500 font-medium">
              <a href="#" className="hover:text-gray-900 transition-colors">Twitter</a>
              <a href="#" className="hover:text-gray-900 transition-colors">GitHub</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
