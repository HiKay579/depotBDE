import { NextRequest, NextResponse } from 'next/server';

// Routes protégées qui nécessitent une authentification
const PROTECTED_ROUTES = [
  '/api/files',
  '/admin',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Vérifier si le chemin d'accès correspond à une route protégée
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    // Récupérer le token d'authentification du cookie
    const authToken = request.cookies.get('auth_token')?.value;

    // Si aucun token n'est présent, rediriger vers la page de connexion
    if (!authToken) {
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', pathname);
      
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Configure le middleware pour s'exécuter sur les routes spécifiées
export const config = {
  matcher: [
    '/api/files/:path*',
    '/admin/:path*',
  ]
}; 