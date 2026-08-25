'use client';

import { useBoardStore } from '@/stores/useBoardStore';

export function PresenceCursors() {
    const { activePresentUsers } = useBoardStore();

    return (
        <>
            {activePresentUsers.map((user) => (
                <div
                    key={user.userId}
                    style={{
                        position: 'fixed',
                        left: user.x,
                        top: user.y,
                        pointerEvents: 'none',
                        zIndex: 9999,
                        transform: 'translate(-4px, -4px)',
                        transition: 'left 0.05s ease, top 0.05s ease',
                    }}
                >
                    {/* Cursor SVG */}
                    <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
                        <path d="M0 0L0 16L4 12L7 19L9 18L6 11L11 11L0 0Z" fill={user.color} />
                    </svg>
                    {/* Name tag */}
                    <div style={{
                        position: 'absolute',
                        top: 18,
                        left: 8,
                        background: user.color,
                        color: 'white',
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '2px 7px',
                        borderRadius: 10,
                        whiteSpace: 'nowrap',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                    }}>
                        {user.userName}
                    </div>
                </div>
            ))}
        </>
    );
}
