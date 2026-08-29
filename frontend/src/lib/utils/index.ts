import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

export function getMidpoint(a: number, b: number): number {
    return (a + b) / 2;
}

export function getOrderIndex(
    items: { orderIndex: number }[],
    index: number
): number {
    if (items.length === 0) return 1000;
    if (index === 0) return items[0].orderIndex / 2;
    if (index >= items.length) return items[items.length - 1].orderIndex + 1000;
    return getMidpoint(items[index - 1].orderIndex, items[index].orderIndex);
}

export function formatDate(date: Date | string | null): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

export function isOverdue(date: Date | string | null): boolean {
    if (!date) return false;
    return new Date(date) < new Date();
}

export function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

export function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

export const PRIORITY_COLORS: Record<string, string> = {
    LOW: 'text-emerald-400',
    MEDIUM: 'text-amber-400',
    HIGH: 'text-orange-400',
    URGENT: 'text-red-400',
};

export const PRIORITY_BG: Record<string, string> = {
    LOW: 'bg-emerald-400/10 text-emerald-400',
    MEDIUM: 'bg-amber-400/10 text-amber-400',
    HIGH: 'bg-orange-400/10 text-orange-400',
    URGENT: 'bg-red-400/10 text-red-400',
};
