import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { AUTH_USERNAME, AUTH_PASSWORD } from '@/env';

// Normalement, ces informations seraient stockées dans une base de données
// et les mots de passe seraient hachés avec bcrypt ou argon2
const USERS: Record<string, string> = {
  [AUTH_USERNAME]: AUTH_PASSWORD,
};

// Génère un token JWT simple (en production, utilisez jose ou jsonwebtoken)
function generateToken(username: string): string {
  const payload = {
    sub: username,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // Expire après 24h
  };
  
  // Ceci est une implémentation très basique, en production utilisez une lib JWT
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    // Vérifier si l'utilisateur existe et si le mot de passe est correct
    if (!username || !password || !(username in USERS) || USERS[username] !== password) {
      return NextResponse.json(
        { message: 'Nom d\'utilisateur ou mot de passe incorrect' },
        { status: 401 }
      );
    }
    
    // Générer un token d'authentification
    const token = generateToken(username);
    
    // Créer la réponse
    const response = NextResponse.json({ success: true });
    
    // Ajouter le cookie à la réponse
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
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