import { AUTH_USERNAME } from '@/env';

// Type pour les résultats de vérification d'authentification
interface AuthResult {
  valid: boolean;
  username?: string;
  role?: 'admin' | 'user';
}

// Vérifie si le token d'authentification est valide
export async function verifyAuth(token: string): Promise<AuthResult> {
  try {
    // Décoder le token (Base64)
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    
    // Vérifier si le token a expiré
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp < currentTime) {
      return { valid: false };
    }
    
    // Vérifier si l'utilisateur existe (ici on considère que seul l'utilisateur admin peut se connecter)
    const username = payload.sub;
    if (username !== AUTH_USERNAME) {
      return { valid: false };
    }
    
    // Le token est valide
    return { 
      valid: true, 
      username,
      role: 'admin'  // On considère tous les utilisateurs authentifiés comme admin pour l'instant
    };
  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error);
    return { valid: false };
  }
} 