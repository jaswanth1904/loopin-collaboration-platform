import { redirect, notFound } from 'next/navigation';
import { getCurrentUser } from '@/app/actions/auth.actions';
import { getBoardData } from '@/app/actions/board.actions';
import { Board } from '@/components/kanban/Board';

interface BoardPageProps {
    params: Promise<{ workspaceId: string; boardId: string }>;
}

export default async function BoardPage({ params }: BoardPageProps) {
    const { boardId } = await params;
    const user = await getCurrentUser();
    if (!user) redirect('/login');

    const { data: board, success } = await getBoardData(boardId);
    if (!success || !board) notFound();

    return <Board board={board as Parameters<typeof Board>[0]['board']} currentUser={user} />;
}
