# Dépôt BDE - Application d'upload de fichiers

Application NextJS permettant de télécharger des fichiers sur un serveur VPS et de les gérer. Cette application est conçue pour être déployée dans un conteneur Docker.

## Fonctionnalités

- Interface utilisateur simple et intuitive
- Téléchargement de fichiers par glisser-déposer ou sélection
- Affichage de la liste des fichiers téléchargés (protégé par authentification)
- Téléchargement des fichiers (protégé par authentification)
- Suppression des fichiers (protégé par authentification)
- Système d'authentification simple
- Conteneurisation avec Docker pour un déploiement facile

## Prérequis

- Node.js 18+ (ou Docker pour l'exécution conteneurisée)
- pnpm

## Installation et exécution en local

1. Cloner le dépôt
   ```bash
   git clone https://github.com/votre-utilisateur/depotBDE.git
   cd depotBDE
   ```

2. Installer les dépendances
   ```bash
   pnpm install
   ```

3. Exécuter en mode développement
   ```bash
   pnpm dev
   ```

4. Accéder à l'application sur http://localhost:3000

## Authentification

L'application utilise un système d'authentification simple pour protéger l'accès aux fichiers téléchargés.

**Identifiants par défaut** (à changer en production) :
- Nom d'utilisateur : `admin`
- Mot de passe : `admin123`

Pour modifier les identifiants, modifiez le fichier `src/app/api/auth/login/route.ts`.

## Déploiement avec Docker

### Construire et exécuter avec Docker Compose

```bash
# Construire et démarrer les conteneurs
docker-compose up -d --build

# Arrêter les conteneurs
docker-compose down
```

L'application sera accessible sur http://localhost:3000

### Construire manuellement l'image Docker

```bash
# Construire l'image
docker build -t depotbde .

# Exécuter le conteneur
docker run -p 3000:3000 -v depotbde_uploads:/app/uploads depotbde
```

## Structure du projet

- `/src/app` - Code principal de l'application
- `/src/app/components` - Composants React
- `/src/app/api` - Routes API pour gérer les fichiers et l'authentification
- `/src/app/login` - Page de connexion
- `/src/app/files` - Page protégée pour accéder aux fichiers
- `/uploads` - Répertoire de stockage des fichiers (en développement)
- `/app/uploads` - Répertoire de stockage des fichiers (en production dans le conteneur)

## Notes sur le stockage des fichiers

En production (avec Docker), les fichiers sont stockés dans un volume Docker monté sur `/app/uploads` pour assurer la persistance des données entre les redémarrages du conteneur.

## Sécurité

**Remarque importante** : Dans un environnement de production, il est recommandé de :

1. Utiliser un stockage sécurisé pour les identifiants utilisateur (base de données)
2. Implémenter un hachage de mot de passe robuste (bcrypt, argon2)
3. Utiliser une bibliothèque JWT appropriée pour les tokens d'authentification
4. Configurer HTTPS pour toutes les communications

## Personnalisation

- Vous pouvez modifier les limites de taille de fichier en éditant le fichier `src/app/api/upload/route.ts`.
- Vous pouvez modifier les identifiants de connexion en éditant le fichier `src/app/api/auth/login/route.ts`.
