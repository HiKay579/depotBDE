// Fichier de configuration des variables d'environnement compatible avec Edge Runtime
// Ne pas utiliser dotenv ici pour assurer la compatibilité

// Variables d'authentification
export const AUTH_USERNAME = process.env.AUTH_USERNAME || 'admin';
export const AUTH_PASSWORD = process.env.AUTH_PASSWORD || 'Negro3945'; // Utiliser la valeur de .env

// Clé pour signer les JWT
export const JWT_SECRET = process.env.JWT_SECRET || 'clé_secrète_temporaire_pour_le_développement';

// URLs de base
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';