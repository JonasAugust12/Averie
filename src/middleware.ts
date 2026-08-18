import { auth } from '@libs/auth.edge';
import { NextResponse } from 'next/server';

export default auth((req) => {
    const { pathname } = req.nextUrl;
    const role = req.auth?.user?.role;

    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
        if (!req.auth || role !== 'admin') {
            return NextResponse.redirect(new URL('/admin/login', req.url));
        }
    }

    if (pathname.startsWith('/staff') && pathname !== '/staff') {
        if (!req.auth || role !== 'staff') {
            return NextResponse.redirect(new URL('/staff?login=1', req.url));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: ['/admin/:path*', '/staff/:path*'],
    runtime: 'nodejs',
};
