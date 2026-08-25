import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/app/actions/auth.actions';
import { WorkspaceSidebar } from '@/components/workspace/WorkspaceSidebar';
import { Navbar } from '@/components/shared/Navbar';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();
    if (!user) redirect('/login');

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            <WorkspaceSidebar user={user} />
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                <Navbar user={user} />
                <main className="flex-1 overflow-auto p-6 bg-slate-50">
                    {children}
                </main>
            </div>
        </div>
    );
}
