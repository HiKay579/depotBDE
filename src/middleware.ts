import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from './lib/auth';

// Routes protégées nécessitant une authentification
const PROTECTED_ROUTES = [
  '/admin',
  '/admin/files',
  '/tombola/admin',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Vérifier si c'est une route protégée
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // Si ce n'est pas une route protégée, laisser passer
  if (!isProtectedRoute) {
    return NextResponse.next();
  }
  
  // Récupérer le token depuis les cookies
  const token = request.cookies.get('auth_token')?.value;
  
  // Si pas de token, rediriger vers login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Vérifier le token
  const authResult = verifyAuth(token);
  
  if (!authResult.valid) {
    // Token invalide, rediriger vers login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Authentification réussie, continuer
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/tombola/admin/:path*',
  ],
}; 