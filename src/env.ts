import dotenv from 'dotenv';

// Charger les variables d'environnement du fichier .env
dotenv.config();

// Exporter les variables d'environnement pour l'authentification
export const AUTH_USERNAME = process.env.AUTH_USERNAME || 'admin';
export const AUTH_PASSWORD = process.env.AUTH_PASSWORD || 'admin123';

// Vous pouvez ajouter d'autres variables d'environnement ici 