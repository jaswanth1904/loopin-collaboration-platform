'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { inviteMember } from '@/app/actions/workspace.actions';
import { getInitials } from '@/lib/utils';
import { UserPlus, Loader2, Shield, Eye, Users } from 'lucide-react';
import type { AuthUser, Workspace, WorkspaceRole } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface MemberManagerProps {
    workspace: Workspace;
    currentUser: AuthUser;
    userRole: WorkspaceRole;
}

const ROLE_COLORS: Record<WorkspaceRole, string> = {
    ADMIN: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    MEMBER: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    VIEWER: 'text-amber-600 bg-amber-50 border-amber-200',
};

const ROLE_ICONS: Record<WorkspaceRole, React.ReactNode> = {
    ADMIN: <Shield size={12} />,
    MEMBER: <Users size={12} />,
    VIEWER: <Eye size={12} />,
};

export function MemberManager({ workspace, currentUser, userRole }: MemberManagerProps) {
    const [showInvite, setShowInvite] = useState(false);
    const [selectedRole, setSelectedRole] = useState<WorkspaceRole>('MEMBER');
    const [isPending, startTransition] = useTransition();

    const handleInvite = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.set('role', selectedRole);
        startTransition(async () => {
            const result = await inviteMember(workspace.id, formData);
            if (result.success) {
                toast.success('Member invited!');
                setShowInvite(false);
                (e.target as HTMLFormElement).reset();
            } else {
                toast.error(result.error?.message ?? 'Failed to invite member');
            }
        });
    };

    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200/60 shadow-sm">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <span className="text-sm font-bold text-gray-500">{workspace.members?.length ?? 0} members</span>
                {userRole === 'ADMIN' && (
                    <button
                        onClick={() => setShowInvite(!showInvite)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-lg hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors shadow-sm"
                    >
                        <UserPlus size={14} /> Invite
                    </button>
                )}
            </div>

            {/* Invite form */}
            <AnimatePresence>
                {showInvite && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-b border-gray-100 bg-indigo-50/30"
                    >
                        <form onSubmit={handleInvite} className="p-4 flex flex-col gap-4">
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium shadow-sm"
                                placeholder="Email address..."
                                autoFocus
                            />
                            <div className="flex gap-2">
                                {(['ADMIN', 'MEMBER', 'VIEWER'] as WorkspaceRole[]).map((role) => {
                                    const isSelected = selectedRole === role;
                                    return (
                                        <button
                                            key={role}
                                            type="button"
                                            onClick={() => setSelectedRole(role)}
                                            className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5
                                                ${isSelected
                                                    ? ROLE_COLORS[role] + ' shadow-sm'
                                                    : 'bg-white text-gray-400 border-gray-200 hover:bg-gray-50 hover:text-gray-600'
                                                }`}
                                        >
                                            {ROLE_ICONS[role]} {role}
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold text-sm py-2.5 rounded-xl hover:bg-indigo-700 shadow-md hover:shadow-indigo-200 transition-all disabled:opacity-50"
                            >
                                {isPending ? <><Loader2 size={14} className="animate-spin" /> Inviting...</> : 'Send Invite'}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Member list */}
            <div className="max-h-[400px] overflow-y-auto w-full">
                {workspace.members?.map((member) => {
                    const isCurrentUser = member.userId === currentUser.id;
                    const role = member.role as WorkspaceRole;
                    return (
                        <div key={member.id} className="flex items-center gap-3 px-5 py-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                            <div className="relative shrink-0">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-sm">
                                    {getInitials(member.user?.name ?? 'U')}
                                </div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-emerald-500 shadow-sm" title="Online" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold text-gray-900 flex items-center gap-2 truncate">
                                    {member.user?.name ?? 'Unknown'}
                                    {isCurrentUser && <span className="text-[10px] font-semibold text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded-md">YOU</span>}
                                </div>
                                <div className="text-xs font-medium text-gray-500 truncate">{member.user?.email}</div>
                            </div>
                            <span className={`shrink-0 flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg border ${ROLE_COLORS[role]}`}>
                                {ROLE_ICONS[role]} {role}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
