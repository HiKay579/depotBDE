/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: { 
    ignoreDuringBuilds: true 
  },
  typescript: { 
    ignoreBuildErrors: true 
  },
  experimental: {
    // Désactiver la compression des assets pendant le build
    // pour éviter les problèmes avec les fichiers statiques
    staticCompressionBailout: true
  },
  // Assurez-vous que les chemins d'assets sont corrects
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : undefined,
  // Configuration importante pour le déploiement Docker
  poweredByHeader: false,
};

export default nextConfig;
