'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useTransition } from 'react';
import { getWorkspaces } from '@/app/actions/workspace.actions';
import { CreateWorkspaceDialog } from './CreateWorkspaceDialog';
import { getInitials } from '@/lib/utils';
import { Zap, LayoutDashboard, Folders, ChevronDown, ChevronRight, Plus } from 'lucide-react';
import type { AuthUser, Workspace } from '@/types';

interface WorkspaceSidebarProps {
    user: AuthUser;
}

export function WorkspaceSidebar({ user }: WorkspaceSidebarProps) {
    const pathname = usePathname();
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [expandedWorkspaces, setExpandedWorkspaces] = useState<Set<string>>(new Set());
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        startTransition(async () => {
            const result = await getWorkspaces();
            if (result.success && result.data) setWorkspaces(result.data);
        });
    }, []);

    const toggleWorkspace = (id: string) => {
        setExpandedWorkspaces((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    return (
        <div className="w-64 min-w-[256px] border-r border-gray-200 bg-gray-50 flex flex-col h-screen shrink-0">
            {/* Logo */}
            <div className="px-6 py-5 border-b border-gray-200 shrink-0">
                <Link href="/dashboard" className="flex items-center gap-3">
                    <img src="/icon.svg" className="w-8 h-8 drop-shadow-sm" alt="LoopIn Logo" />
                    <span className="text-lg font-bold text-gray-900 tracking-tight">LoopIn</span>
                </Link>
            </div>

            {/* Nav */}
            <div className="p-4 shrink-0">
                <NavItem href="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" active={pathname === '/dashboard'} />
            </div>

            {/* Workspaces */}
            <div className="flex-1 overflow-y-auto px-4 pb-4">
                <div className="flex items-center justify-between px-2 mb-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Workspaces</span>
                    <CreateWorkspaceDialog trigger={
                        <button className="text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 p-1 rounded transition-colors">
                            <Plus size={14} />
                        </button>
                    } />
                </div>

                <div className="flex flex-col gap-1">
                    {workspaces.map((ws) => {
                        const isExpanded = expandedWorkspaces.has(ws.id);
                        const isActive = pathname.includes(ws.id);

                        return (
                            <div key={ws.id}>
                                <div
                                    className={`flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-100 text-gray-700'}`}
                                >
                                    <Link href={`/dashboard/workspaces/${ws.id}`} className="flex-1 flex items-center gap-3 overflow-hidden">
                                        <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0 shadow-sm">
                                            {getInitials(ws.name)}
                                        </div>
                                        <span className={`text-sm truncate ${isActive ? 'font-bold' : 'font-medium'}`}>
                                            {ws.name}
                                        </span>
                                    </Link>
                                    <button
                                        onClick={() => toggleWorkspace(ws.id)}
                                        className="text-gray-400 hover:text-indigo-600 shrink-0 p-1 rounded"
                                    >
                                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                    </button>
                                </div>

                                {isExpanded && ws.boards && (
                                    <div className="ml-5 border-l-2 border-gray-200 pl-3 mt-1 mb-3 flex flex-col gap-1">
                                        {ws.boards.map((board) => {
                                            const boardActive = pathname.includes(board.id);
                                            return (
                                                <Link key={board.id} href={`/dashboard/workspaces/${ws.id}/boards/${board.id}`}>
                                                    <div className={`px-2 py-1.5 rounded-md text-xs truncate transition-colors ${boardActive ? 'text-indigo-700 font-bold bg-indigo-50' : 'text-gray-500 font-medium hover:text-gray-900 hover:bg-gray-100'}`}>
                                                        {board.title}
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* User footer */}
            <div className="p-4 border-t border-gray-200 shrink-0 bg-white">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-sm">
                        {getInitials(user.name)}
                    </div>
                    <div className="overflow-hidden">
                        <div className="text-sm font-bold text-gray-900 truncate">{user.name}</div>
                        <div className="text-xs font-medium text-gray-500 truncate">{user.email}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function NavItem({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) {
    return (
        <Link href={href}>
            <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${active ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-200' : 'text-gray-600 font-medium hover:bg-gray-100 hover:text-gray-900'}`}>
                <span className={active ? 'text-white' : 'text-gray-400'}>{icon}</span>
                {label}
            </div>
        </Link>
    );
}

void Folders;
