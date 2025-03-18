import { NextRequest, NextResponse } from 'next/server';

// Routes qui nécessitent une authentification
const PROTECTED_ROUTES = ['/files'];

export default function middleware(request: NextRequest) {
  // Vérifier si l'utilisateur accède à une route protégée
  const { pathname } = request.nextUrl;
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // Si ce n'est pas une route protégée, continuer normalement
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Vérifier si l'utilisateur est authentifié via le cookie de session
  const authCookie = request.cookies.get('auth_token');
  
  // Si pas de cookie d'authentification, rediriger vers la page de connexion
  if (!authCookie) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Si l'utilisateur est authentifié, continuer normalement
  return NextResponse.next();
}

// Configuration des routes sur lesquelles le middleware doit être exécuté
export const config = {
  matcher: [
    // Protéger les routes sensibles
    '/files',
    '/files/:path*',
    // Ne pas protéger les routes API d'authentification
    '/((?!api/auth).*)' 
  ],
}; 