import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import cookie from 'cookie';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const protectedRoutes = [`/developer/settings`];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const { nextUrl: url } = request;
    const { pathname } = url;

    // Skip middleware for public files and API routes
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname === '/favicon.ico'
    ) {
        return NextResponse.next();
    }

    const cookies = cookie.parse(request.headers.get('Cookie') || '');
    const auth = cookies.login
        ? JSON.parse(decodeURIComponent(cookies.login))
        : null;

    // if user is not logged in and tries to access protected route
    if (!auth?.accessToken && protectedRoutes.includes(pathname)) {
        url.pathname = '/signin';
        return NextResponse.redirect(url);
    }
    // if user is logged in and tries to access login page
    if (auth?.accessToken && pathname === '/signin') {
        const developerId = auth?.developerId;
        url.pathname = `/developer/${developerId}`;
        return NextResponse.redirect(url);
    }

    // if user is logged in and tries to access forgot password page and reset password page
    if (
        auth?.accessToken &&
        (pathname === '/signin/forgot' || pathname.startsWith('/signin/reset'))
    ) {
        const developerId = auth?.developerId;
        url.pathname = `/developer/${developerId}`;
        return NextResponse.redirect(url);
    }
}

// Apply middleware to all routes
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
