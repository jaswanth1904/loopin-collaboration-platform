import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/app/actions/auth.actions';
import { getWorkspaces } from '@/app/actions/workspace.actions';
import { CreateWorkspaceDialog } from '@/components/workspace/CreateWorkspaceDialog';
import { LayoutDashboard, Users, Calendar, Folders, Zap, ArrowRight, Activity, TrendingUp, Plus } from 'lucide-react';

export default async function DashboardPage() {
    const user = await getCurrentUser();
    if (!user) redirect('/login');

    const { data: workspaces = [] } = await getWorkspaces();
    const totalBoards = workspaces.reduce((acc, w) => acc + ((w as { _count?: { boards: number } })._count?.boards ?? 0), 0);
    const totalMembers = workspaces.reduce((acc, w) => acc + ((w as { _count?: { members: number } })._count?.members ?? 0), 0);

    const stats = [
        { label: 'Total Workspaces', value: workspaces.length, icon: Folders, color: 'text-indigo-600', drop: 'shadow-indigo-200', bg: 'bg-indigo-50' },
        { label: 'Active Boards', value: totalBoards, icon: LayoutDashboard, color: 'text-purple-600', drop: 'shadow-purple-200', bg: 'bg-purple-50' },
        { label: 'Collaborators', value: totalMembers, icon: Users, color: 'text-pink-600', drop: 'shadow-pink-200', bg: 'bg-pink-50' },
        { label: 'Weekly Activity', value: workspaces.length > 0 ? '+12%' : '0%', icon: TrendingUp, color: 'text-emerald-600', drop: 'shadow-emerald-200', bg: 'bg-emerald-50' },
    ];

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 md:px-8 space-y-12">

            {/* Dynamic Welcome Banner */}
            <div className="relative overflow-hidden rounded-[32px] bg-white border border-gray-100 shadow-xl shadow-indigo-900/5 p-10 lg:p-14">
                {/* Background Art */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[400px] h-[400px] bg-gradient-to-br from-indigo-200/50 via-purple-200/50 to-pink-200/50 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[300px] h-[300px] bg-gradient-to-tr from-blue-200/40 to-indigo-200/40 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6">
                            <Zap size={14} className="fill-indigo-700" /> Professional Dashboard
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
                            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{user.name.split(' ')[0]}!</span>
                        </h1>
                        <p className="text-lg text-gray-500 font-medium leading-relaxed">
                            Ready to conquer your tasks today? You have {totalBoards} active boards across {workspaces.length} workspaces. Let's make things happen.
                        </p>
                    </div>
                </div>
            </div>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="group bg-white border border-gray-100 rounded-[24px] p-6 shadow-lg shadow-gray-200/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${stat.drop} ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon size={26} strokeWidth={2.5} />
                                </div>
                                <div className="text-gray-400 bg-gray-50 p-2 rounded-xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                    <Activity size={18} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-4xl font-black text-gray-900 tracking-tight">{stat.value}</div>
                                <div className="text-sm font-bold text-gray-500 uppercase tracking-wide">{stat.label}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Workspaces Section */}
            <div className="space-y-6">
                <div className="flex items-end justify-between border-b border-gray-200 pb-4">
                    <div>
                        <h2 className="text-2xl font-extrabold text-gray-900">Your Workspaces</h2>
                        <p className="text-gray-500 font-medium">Manage and organize your team's projects.</p>
                    </div>
                    {user.email === 'hello@kanban.com' && (
                        <CreateWorkspaceDialog trigger={
                            <button className="hidden sm:flex items-center gap-2 bg-gray-900 text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-gray-800 hover:shadow-lg transition-all active:scale-95">
                                <Plus size={18} /> New Workspace
                            </button>
                        } />
                    )}
                </div>

                {workspaces.length === 0 ? (
                    <div className="bg-gradient-to-b from-white to-gray-50 border-2 border-dashed border-gray-200 rounded-[32px] p-16 text-center shadow-sm">
                        <div className="w-24 h-24 bg-white rounded-3xl shadow-xl shadow-indigo-100 flex items-center justify-center mx-auto mb-6 border border-gray-100">
                            <Folders size={40} className="text-indigo-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            {user.email === 'hello@kanban.com' ? 'Your canvas is empty' : 'Waiting for Workspace Invite'}
                        </h3>
                        <p className="text-gray-500 font-medium max-w-md mx-auto mb-10 text-lg">
                            {user.email === 'hello@kanban.com'
                                ? 'Create your first workspace to start assembling your dream team and managing projects efficiently.'
                                : 'You are currently not assigned to any workspaces. Please ask your manager to invite you via email.'}
                        </p>

                        {user.email === 'hello@kanban.com' && (
                            <div className="flex justify-center">
                                <CreateWorkspaceDialog trigger={
                                    <button className="flex items-center gap-3 bg-indigo-600 text-white font-bold px-8 py-4 rounded-full hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition-all text-lg active:scale-95">
                                        <Plus size={20} /> Build Your First Workspace
                                    </button>
                                } />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {workspaces.map((workspace) => {
                            const ws = workspace as typeof workspace & { _count?: { members: number; boards: number } };
                            return (
                                <Link
                                    key={ws.id}
                                    href={`/dashboard/workspaces/${ws.id}`}
                                    className="block group"
                                >
                                    <div className="bg-white border border-gray-100 rounded-[28px] p-8 transition-all duration-500 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-900/10 relative overflow-hidden group-hover:-translate-y-2">

                                        {/* Hover Glow Effect */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        <div className="relative z-10 flex items-start justify-between mb-8">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-purple-200 group-hover:scale-110 transition-transform duration-500">
                                                {ws.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-colors duration-300">
                                                <ArrowRight size={18} className="text-gray-400 group-hover:text-white transition-colors" />
                                            </div>
                                        </div>
                                        <div className="relative z-10">
                                            <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight group-hover:text-indigo-600 transition-colors">{ws.name}</h3>
                                            <div className="flex gap-4">
                                                <div className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-100">
                                                    <div className="flex items-center gap-2 text-indigo-600 mb-1">
                                                        <LayoutDashboard size={14} />
                                                        <span className="text-xs font-bold uppercase">Boards</span>
                                                    </div>
                                                    <div className="text-xl font-black text-gray-900">{ws._count?.boards ?? 0}</div>
                                                </div>
                                                <div className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-100">
                                                    <div className="flex items-center gap-2 text-pink-600 mb-1">
                                                        <Users size={14} />
                                                        <span className="text-xs font-bold uppercase">Members</span>
                                                    </div>
                                                    <div className="text-xl font-black text-gray-900">{ws._count?.members ?? 0}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
