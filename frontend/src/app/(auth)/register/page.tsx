'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { registerUser } from '@/app/actions/auth.actions';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(async () => {
            const result = await registerUser(formData);
            if (result.success) {
                toast.success('Account created successfully!');
                router.push('/dashboard');
            } else {
                toast.error(result.error?.message ?? 'Registration failed');
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden font-sans">
            {/* Background Decor */}
            <div className="absolute inset-0 pointer-events-none flex justify-center items-center overflow-hidden">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-cyan-100/60 rounded-full blur-[100px] opacity-40 animate-pulse" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-100 rounded-full blur-[100px] opacity-40" />
            </div>

            {/* Back to Home Navbar */}
            <header className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex items-center justify-between">
                <Link href="/" className="text-2xl font-serif tracking-tight font-medium text-slate-800 hover:text-indigo-600 transition-colors">
                    Loopin.
                </Link>
            </header>

            <div className="w-full max-w-lg relative z-10 pt-10">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-serif text-slate-800 font-medium mb-3 tracking-tight">Create workspace</h1>
                    <p className="text-slate-500 font-medium text-lg">Start managing your team's velocity today</p>
                </div>

                {/* Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-10 shadow-[0_50px_100px_-20px_rgba(50,50,93,0.1),0_30px_60px_-30px_rgba(0,0,0,0.1)] border border-slate-100/50">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
                                Full name
                            </label>
                            <input
                                name="name"
                                type="text"
                                required
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium shadow-sm hover:border-slate-300 placeholder-slate-400"
                                placeholder="Your name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
                                Email address
                            </label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium shadow-sm hover:border-slate-300 placeholder-slate-400"
                                placeholder="you@company.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium shadow-sm hover:border-slate-300 placeholder-slate-400"
                                    placeholder="Min 8 chars, 1 uppercase, 1 number"
                                    style={{ paddingRight: 50 }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <p className="mt-2 text-xs font-medium text-slate-400 leading-relaxed uppercase tracking-wider">
                                Must be 8+ characters with at least 1 uppercase and 1 number.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full mt-4 bg-indigo-600 text-white font-bold rounded-2xl py-4 flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-[0_10px_20px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_10px_20px_-10px_rgba(79,70,229,0.8)] hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 disabled:shadow-none"
                        >
                            {isPending ? (
                                <><Loader2 size={20} className="animate-spin" />Creating environment...</>
                            ) : 'Create Workspace'}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm font-medium text-slate-500">
                        Already have an account?{' '}
                        <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline underline-offset-4 transition-all">
                            Sign in to Loopin
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
