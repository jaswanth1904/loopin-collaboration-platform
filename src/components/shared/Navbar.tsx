'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useTransition } from 'react';
import { logoutUser } from '@/app/actions/auth.actions';
import { getInitials } from '@/lib/utils';
import { Bell, Search, LogOut, Settings, ChevronDown } from 'lucide-react';
import type { AuthUser } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
    user: AuthUser;
}

export function Navbar({ user }: NavbarProps) {
    const pathname = usePathname();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [status, setStatus] = useState<'Online' | 'Busy' | 'Do Not Disturb'>('Online');
    const [isPending, startTransition] = useTransition();

    const handleLogout = () => {
        startTransition(async () => {
            await logoutUser();
        });
    };

    const segments = pathname.split('/').filter(Boolean);

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 gap-4 shrink-0 shadow-sm sticky top-0 z-40">
            {/* Breadcrumb */}
            <div className="flex-1 flex items-center gap-2 text-sm font-medium text-gray-500 overflow-hidden">
                {segments.map((seg, i) => (
                    <div key={i} className="flex items-center gap-2">
                        {i > 0 && <span className="text-gray-300">/</span>}
                        <span className={`capitalize truncate max-w-[120px] ${i === segments.length - 1 ? 'text-gray-900 font-bold' : 'text-gray-500'}`}>
                            {seg.replace(/-/g, ' ')}
                        </span>
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                <button className="text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
                    <Search size={18} />
                </button>
                <button className="text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 p-2 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
                    <Bell size={18} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full border-2 border-white" />
                </button>

                {/* User menu */}
                <div className="relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-3 bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-full pl-2 pr-4 py-1.5 cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        onBlur={() => setTimeout(() => setShowUserMenu(false), 200)}
                    >
                        <div className="relative">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                                {getInitials(user.name)}
                            </div>
                            <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${status === 'Online' ? 'bg-emerald-500' :
                                    status === 'Busy' ? 'bg-amber-500' : 'bg-red-500'
                                }`} />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-sm font-bold text-gray-700 truncate max-w-[90px] leading-tight">{user.name}</span>
                            <span className="text-[10px] font-semibold text-gray-400 capitalize">{status}</span>
                        </div>
                        <ChevronDown size={14} className="text-gray-400 ml-1" />
                    </button>

                    <AnimatePresence>
                        {showUserMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden"
                            >
                                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                                    <div className="font-bold text-gray-900 truncate">{user.name}</div>
                                    <div className="text-xs font-medium text-gray-500 truncate">{user.email}</div>
                                </div>
                                <div className="p-2">
                                    <div className="px-1 py-1 mb-1 border-b border-gray-100 flex gap-1">
                                        <button onClick={(e) => { e.stopPropagation(); setStatus('Online'); setShowUserMenu(false); }} className={`flex-1 text-[10px] uppercase font-bold py-1 rounded-md transition-colors ${status === 'Online' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-500 hover:bg-gray-100'}`}>Online</button>
                                        <button onClick={(e) => { e.stopPropagation(); setStatus('Busy'); setShowUserMenu(false); }} className={`flex-1 text-[10px] uppercase font-bold py-1 rounded-md transition-colors ${status === 'Busy' ? 'bg-amber-100 text-amber-700' : 'text-gray-500 hover:bg-gray-100'}`}>Busy</button>
                                        <button onClick={(e) => { e.stopPropagation(); setStatus('Do Not Disturb'); setShowUserMenu(false); }} className={`flex-1 text-[10px] uppercase font-bold py-1 rounded-md transition-colors ${status === 'Do Not Disturb' ? 'bg-red-100 text-red-700' : 'text-gray-500 hover:bg-gray-100'}`}>DND</button>
                                    </div>
                                    <Link href="/settings">
                                        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">
                                            <Settings size={16} /> Settings
                                        </button>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        disabled={isPending}
                                        className="w-full flex items-center gap-3 px-3 py-2 mt-1 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                                    >
                                        <LogOut size={16} /> Sign out
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}
