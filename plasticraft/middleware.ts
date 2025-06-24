import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/beranda', '/profil', '/upload', '/bagikan', '/karyalain', '/tutorial', '/tutorial-detail']; 
const publicOnlyRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('auth-token')?.value;
  const currentPath = request.nextUrl.pathname;

  if (!sessionToken) {
    if (protectedRoutes.some(path => currentPath.startsWith(path))) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (sessionToken) {
    if (publicOnlyRoutes.includes(currentPath)) {
      return NextResponse.redirect(new URL('/beranda', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};