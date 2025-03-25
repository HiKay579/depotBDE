// Forcer l'utilisation de Node.js au lieu d'Edge pour éviter les problèmes
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { generateToken, authenticate } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    // Authentifier l'utilisateur
    const authResult = authenticate(username, password);
    
    if (!authResult.success) {
      return NextResponse.json(
        { message: 'Nom d\'utilisateur ou mot de passe incorrect' },
        { status: 401 }
      );
    }
    
    // Générer un token d'authentification
    const token = generateToken(username);
    
    // Créer la réponse
    const response = NextResponse.json({ success: true });
    
    // Ajouter le cookie à la réponse avec des options de sécurité améliorées
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Changé de 'strict' à 'lax' pour permettre la redirection
      maxAge: 60 * 60 * 24, // 24 heures
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la connexion' },
      { status: 500 }
    );
  }
} 