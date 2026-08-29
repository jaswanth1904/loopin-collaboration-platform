'use client';

import { useEffect, useState } from 'react';
import { getActivityLog } from '@/app/actions/board.actions';
import { formatDate, getInitials } from '@/lib/utils';
import { Loader2, Activity } from 'lucide-react';

interface ActivityFeedProps {
    boardId: string;
}

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
    CARD_CREATED: { label: 'created card', color: '#10b981' },
    CARD_MOVED: { label: 'moved card', color: '#6366f1' },
    CARD_DELETED: { label: 'deleted card', color: '#ef4444' },
    CARD_UPDATED: { label: 'updated card', color: '#f59e0b' },
};

type LogEntry = {
    id: string;
    action: string;
    metadata: Record<string, unknown>;
    createdAt: Date;
    user?: { id: string; name: string; avatarUrl: string | null };
};

export function ActivityFeed({ boardId }: ActivityFeedProps) {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getActivityLog(boardId).then((result) => {
            if (result.success && result.data) {
                setLogs(result.data as LogEntry[]);
            }
            setIsLoading(false);
        });
    }, [boardId]);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
                <Loader2 size={16} color="#606080" className="animate-spin" />
            </div>
        );
    }

    return (
        <div style={{ background: '#111118', border: '1px solid #1e1e2d', borderRadius: 12, height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #1e1e2d', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Activity size={14} color="#6366f1" />
                <span style={{ fontSize: 13, fontWeight: 500, color: '#a0a0bf' }}>Recent Activity</span>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px' }} className="no-scrollbar">
                {logs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '24px 0', color: '#606080', fontSize: 13 }}>
                        No activity yet
                    </div>
                ) : (
                    logs.map((log) => {
                        const meta = log.metadata as Record<string, string>;
                        const actionInfo = ACTION_LABELS[log.action] ?? { label: log.action.toLowerCase().replace(/_/g, ' '), color: '#a0a0bf' };
                        return (
                            <div key={log.id} className="activity-item">
                                <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                                    {getInitials(log.user?.name ?? 'U')}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 12, color: '#a0a0bf', lineHeight: 1.5 }}>
                                        <span style={{ fontWeight: 600, color: '#f0f0ff' }}>{log.user?.name ?? 'Unknown'}</span>{' '}
                                        <span style={{ color: actionInfo.color }}>{actionInfo.label}</span>{' '}
                                        {meta.cardTitle && <span style={{ fontStyle: 'italic' }}>&ldquo;{meta.cardTitle}&rdquo;</span>}
                                    </div>
                                    <div style={{ fontSize: 11, color: '#606080', marginTop: 2 }}>
                                        {formatDate(log.createdAt)}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
