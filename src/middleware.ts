import { NextRequest, NextResponse } from 'next/server';


const COOKIE_NAME = 'kanban_token';

const publicRoutes = ['/', '/login', '/register'];
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const isAuthenticated = !!token;

    // If authenticated and hitting auth routes, redirect to dashboard
    if (isAuthenticated && authRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If not authenticated and hitting protected routes
    const isPublic = publicRoutes.includes(pathname);
    if (!isAuthenticated && !isPublic) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    ],
};
