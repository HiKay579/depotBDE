import CryptoJS from 'crypto-js';
import { AUTH_USERNAME, AUTH_PASSWORD, JWT_SECRET } from '@/env';

// Fonction pour encoder en base64url
function base64UrlEncode(str: string): string {
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(str))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Fonction pour décoder du base64url
function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  return CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(str));
}

// Générer un token JWT
export function generateToken(username: string): string {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  
  const payload = {
    sub: username,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 heures
    iat: Math.floor(Date.now() / 1000)
  };
  
  const headerStr = base64UrlEncode(JSON.stringify(header));
  const payloadStr = base64UrlEncode(JSON.stringify(payload));
  
  const data = `${headerStr}.${payloadStr}`;
  const signature = CryptoJS.HmacSHA256(data, JWT_SECRET).toString(CryptoJS.enc.Base64)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  
  return `${headerStr}.${payloadStr}.${signature}`;
}

// Vérifier l'authentification
export function verifyAuth(token: string) {
  try {
    // Vérifier la structure du token
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false };
    }
    
    const [headerStr, payloadStr, signature] = parts;
    
    // Vérifier la signature
    const data = `${headerStr}.${payloadStr}`;
    const expectedSignature = CryptoJS.HmacSHA256(data, JWT_SECRET).toString(CryptoJS.enc.Base64)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    
    if (signature !== expectedSignature) {
      return { valid: false };
    }
    
    // Vérifier les données
    const payload = JSON.parse(base64UrlDecode(payloadStr));
    
    // Vérifier l'expiration
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return { valid: false };
    }
    
    return { 
      valid: true, 
      username: payload.sub,
      role: 'admin'
    };
  } catch (error) {
    console.error('Erreur de vérification du token:', error);
    return { valid: false };
  }
}

// Fonction d'authentification
export function authenticate(username: string, password: string) {
  // Vérifier les identifiants
  if (username === AUTH_USERNAME && password === AUTH_PASSWORD) {
    return { success: true, username };
  }
  
  return { success: false };
}