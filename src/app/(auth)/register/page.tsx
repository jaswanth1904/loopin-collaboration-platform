'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { registerUser } from '@/app/actions/auth.actions';
import { Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';

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
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
                <div className="absolute top-0 w-[600px] h-[600px] bg-purple-200/50 blur-[100px] rounded-[100%]" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-6">
                        <img src="/icon.svg" className="w-10 h-10 drop-shadow-sm" alt="LoopIn Logo" />
                        <span className="text-2xl font-bold tracking-tight text-gray-900">LoopIn</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Create your account</h1>
                    <p className="text-gray-500 font-medium">Start collaborating with your team today</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-[24px] p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Full name
                            </label>
                            <input
                                name="name"
                                type="text"
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium"
                                placeholder="Your name"
                            />
                        </div>

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
                                    placeholder="Min 8 chars, 1 uppercase, 1 number"
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
                            <p className="mt-2 text-xs font-medium text-gray-500 leading-relaxed">
                                Must be 8+ characters with at least one uppercase letter and number.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full mt-2 bg-indigo-600 text-white font-bold rounded-xl py-3.5 flex items-center justify-center gap-2 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isPending ? (
                                <><Loader2 size={18} className="animate-spin" />Creating account...</>
                            ) : 'Create account'}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm font-medium text-gray-500">
                        Already have an account?{' '}
                        <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-bold transition-colors">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
