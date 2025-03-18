import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Créer une réponse
    const response = NextResponse.json({ success: true });
    
    // Supprimer le cookie d'authentification
    response.cookies.set({
      name: 'auth_token',
      value: '',
      expires: new Date(0), // Date dans le passé pour supprimer le cookie
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la déconnexion' },
      { status: 500 }
    );
  }
} 