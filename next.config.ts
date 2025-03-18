import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  
  // Configuration pour gérer les grosses tailles de fichiers
  experimental: {
    serverComponentsExternalPackages: ['sharp'],
  },
};

export default nextConfig;
