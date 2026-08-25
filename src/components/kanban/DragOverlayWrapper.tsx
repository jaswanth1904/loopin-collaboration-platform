'use client';

import type { ReactNode } from 'react';

interface DragOverlayWrapperProps {
    children: ReactNode;
    isColumn?: boolean;
}

export function DragOverlayWrapper({ children, isColumn = false }: DragOverlayWrapperProps) {
    return (
        <div
            style={{
                opacity: 0.95,
                transform: isColumn ? 'rotate(1.5deg) scale(1.02)' : 'rotate(3deg) scale(1.05)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.4)',
                borderRadius: isColumn ? 12 : 8,
                pointerEvents: 'none',
                cursor: 'grabbing',
            }}
        >
            {children}
        </div>
    );
}
