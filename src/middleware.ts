import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith('/admin')) {
    const sessionCookie = request.cookies.get('jasuda_session')?.value;

    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const user = JSON.parse(sessionCookie);
      const role = (user.role || '').toLowerCase();

      if (role !== 'admin' && role !== 'editor' && role !== 'operator' && role !== 'pengurus') {
        return NextResponse.redirect(new URL('/', request.url));
      }

      // Restricted paths for editor role
      if (role === 'editor') {
        const restrictedPaths = [
          '/admin/dashboard',
          '/admin/keuangan',
          '/admin/pengaturan',
          '/admin/riwayat'
        ];
        if (restrictedPaths.some(p => pathname === p || pathname.startsWith(p + '/'))) {
          return NextResponse.redirect(new URL('/admin/produk', request.url));
        }
      }
    } catch {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
