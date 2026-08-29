import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/app/actions/auth.actions';
import { getWorkspace } from '@/app/actions/workspace.actions';
import { MemberManager } from '@/components/workspace/MemberManager';
import { CreateBoardDialog } from '@/components/workspace/CreateBoardDialog';
import { LayoutDashboard, Users, Calendar, ArrowRight } from 'lucide-react';

interface WorkspacePageProps {
    params: Promise<{ workspaceId: string }>;
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
    const { workspaceId } = await params;
    const user = await getCurrentUser();
    if (!user) redirect('/login');

    const { data: workspace, success } = await getWorkspace(workspaceId);
    if (!success || !workspace) notFound();

    const userRole = workspace.members?.find((m) => m.userId === user.id)?.role;

    return (
        <div className="max-w-7xl mx-auto py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-indigo-200">
                        {workspace.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{workspace.name}</h1>
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100">
                                {userRole}
                            </span>
                        </div>
                        <div className="flex gap-4 text-sm font-medium text-gray-500">
                            <span className="flex items-center gap-1.5"><LayoutDashboard size={14} /> {workspace.boards?.length ?? 0} boards</span>
                            <span>·</span>
                            <span className="flex items-center gap-1.5"><Users size={14} /> {workspace.members?.length ?? 0} members</span>
                            <span>·</span>
                            <span className="font-mono text-xs mt-0.5">/{workspace.slug}</span>
                        </div>
                    </div>
                </div>
                {(userRole === 'ADMIN' || userRole === 'MEMBER') && (
                    <CreateBoardDialog workspaceId={workspaceId} />
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Boards Section */}
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <LayoutDashboard className="text-indigo-600" size={20} /> Project Boards
                    </h2>

                    {!workspace.boards || workspace.boards.length === 0 ? (
                        <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center shadow-sm">
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
                                <LayoutDashboard size={24} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">No boards created yet</h3>
                            <p className="text-gray-500 font-medium mb-6">Create your first board to start managing tasks.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {workspace.boards.map((board) => (
                                <Link key={board.id} href={`/dashboard/workspaces/${workspaceId}/boards/${board.id}`} className="block group">
                                    <div className="bg-white border border-gray-200 rounded-2xl p-6 transition-all duration-300 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-100 relative overflow-hidden group-hover:-translate-y-1">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100">
                                                <LayoutDashboard size={18} className="text-indigo-600" />
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                                                <ArrowRight size={14} className="text-gray-400 group-hover:text-indigo-600" />
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">{board.title}</h3>
                                        <p className="text-sm font-medium text-gray-500 line-clamp-2 h-10 mb-4">
                                            {board.description || 'No description provided.'}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                                            <Calendar size={12} />
                                            {new Date(board.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                        <div className="absolute bottom-0 left-0 h-1 w-0 bg-indigo-500 group-hover:w-full transition-all duration-500 ease-out" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Members Section */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Users className="text-pink-600" size={18} /> Team Members
                    </h2>
                    <MemberManager
                        workspace={workspace}
                        currentUser={user}
                        userRole={userRole ?? 'VIEWER'}
                    />
                </div>
            </div>
        </div>
    );
}
