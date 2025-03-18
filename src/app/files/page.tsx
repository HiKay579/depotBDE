'use client';

import FileList from '../components/FileList';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function FilesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        router.push('/');
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Dépôt BDE - Fichiers
          </h1>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors disabled:bg-red-300"
          >
            {loading ? 'Déconnexion...' : 'Déconnexion'}
          </button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Fichiers téléchargés
              </h2>
              <FileList />
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white shadow mt-10">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Dépôt BDE - Tous droits réservés
          </p>
        </div>
      </footer>
    </div>
  );
} 