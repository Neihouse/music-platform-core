import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Add paths that should be protected by authentication
const protectedPaths = [
  '/dashboard',
  '/profile',
  '/upload',
  '/favorites',
  '/playlists',
];

// Add paths that should be accessible only to non-authenticated users
const authPaths = ['/login', '/signup'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path should be protected
  const isProtectedPath = protectedPaths.some(path => 
    pathname.startsWith(path)
  );

  // Check if the path is for non-authenticated users
  const isAuthPath = authPaths.some(path => 
    pathname.startsWith(path)
  );

  const token = request.cookies.get('token')?.value;

  try {
    if (token) {
      // Verify the token
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'your-secret-key'
      );
      await jwtVerify(token, secret);

      // If user is authenticated and tries to access auth pages, redirect to dashboard
      if (isAuthPath) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } else {
      // If no token and trying to access protected route, redirect to login
      if (isProtectedPath) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.set({
          name: 'redirectTo',
          value: pathname,
          maxAge: 60 * 60, // 1 hour
        });
        return response;
      }
    }

    return NextResponse.next();
  } catch (error) {
    // If token is invalid and trying to access protected route, redirect to login
    if (isProtectedPath) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 