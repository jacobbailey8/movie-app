// this files checks if the user is authenticated or not and protects the routes that require authentication
middleware.js
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
    // Try to get the token (session) from the request
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });


    const isAuthPage = req.nextUrl.pathname.startsWith('/auth');

    if (!token && !isAuthPage) {
        // Redirect to the /auth page if the user is not authenticated and is trying to access a protected page
        return NextResponse.redirect(new URL('/auth', req.url));
    }

    if (token && isAuthPage) {
        // If the user is authenticated and trying to access the /auth page, redirect them to the home page
        return NextResponse.redirect(new URL('/', req.url));
    }

    // Allow the request to proceed if authenticated or on the auth page
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

