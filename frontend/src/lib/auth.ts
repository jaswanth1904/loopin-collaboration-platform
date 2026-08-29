import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import type { JwtPayload } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET ?? 'fallback-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '7d';

export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(
    password: string,
    hashedPassword: string
): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}

export function signToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
}

export function verifyToken(token: string): JwtPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        return decoded;
    } catch {
        return null;
    }
}

export const COOKIE_NAME = 'kanban_token';
export const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    path: '/',
};
