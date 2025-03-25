import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Récupérer le token d'authentification depuis les cookies
    const cookieStore = cookies();
    const authToken = cookieStore.get('auth_token')?.value;

    if (!authToken) {
      return NextResponse.json({ 
        authenticated: false,
        message: 'Non authentifié'
      }, { status: 200 });
    }

    // Vérifier l'authentification
    const authResult = await verifyAuth(authToken);

    if (!authResult.valid) {
      return NextResponse.json({ 
        authenticated: false,
        message: 'Session invalide'
      }, { status: 200 });
    }

    // Utilisateur authentifié
    return NextResponse.json({ 
      authenticated: true,
      username: authResult.username || 'Utilisateur',
      role: authResult.role || 'user'
    }, { status: 200 });
  } catch (error) {
    console.error('Erreur de vérification d\'authentification:', error);
    return NextResponse.json({ 
      authenticated: false,
      message: 'Erreur de vérification d\'authentification'
    }, { status: 500 });
  }
} 