'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { loginUser } from '@/app/actions/auth.actions';
import { Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(async () => {
            const result = await loginUser(formData);
            if (result.success) {
                toast.success('Welcome back!');
                router.push('/dashboard');
            } else {
                toast.error(result.error?.message ?? 'Login failed');
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
                <div className="absolute top-0 w-[600px] h-[600px] bg-indigo-200/50 blur-[100px] rounded-[100%]" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-6">
                        <img src="/icon.svg" className="w-10 h-10 drop-shadow-sm" alt="LoopIn Logo" />
                        <span className="text-2xl font-bold tracking-tight text-gray-900">LoopIn</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Welcome back</h1>
                    <p className="text-gray-500 font-medium">Sign in to your collaborative workspace</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-[24px] p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email address
                            </label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium"
                                placeholder="you@company.com"
                                autoComplete="email"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium"
                                    placeholder="••••••••••••"
                                    autoComplete="current-password"
                                    style={{ paddingRight: 44 }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full mt-2 bg-gray-900 text-white font-bold rounded-xl py-3.5 flex items-center justify-center gap-2 hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isPending ? (
                                <><Loader2 size={18} className="animate-spin" />Signing in...</>
                            ) : 'Sign in'}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm font-medium text-gray-500">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="text-indigo-600 hover:text-indigo-700 font-bold transition-colors">
                            Create one
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
