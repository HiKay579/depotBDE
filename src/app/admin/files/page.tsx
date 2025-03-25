'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import FileList from '../../components/FileList';

export default function AdminFilesPage() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Vérification de l'état d'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/status');
        const data = await res.json();
        
        if (data.authenticated) {
          setUsername(data.username || 'Administrateur');
          setLoading(false);
        } else {
          // Rediriger vers la page de connexion si non authentifié
          router.push('/login');
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-gray-800 text-white shadow sticky top-0 z-10 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center px-4 gap-3">
          <div className="flex items-center">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Image 
                  src="/image.png" 
                  alt="Logo BDE Infocontact" 
                  width={40} 
                  height={40} 
                  className="bg-white rounded-lg p-1.5 shadow transform -rotate-3 transition-transform duration-300 ease-in-out animated-logo"
                />
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white/95 mt-0.5">
                  Administration
                </h1>
                <p className="text-xs text-white/85 -mt-0.5">
                  Gestion des documents
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 items-center justify-center">
            <Link
              href="/admin"
              className="text-white/80 hover:text-white text-sm font-medium"
            >
              Tableau de bord
            </Link>
            <span className="text-sm text-white/80 mx-3 text-center">
              Connecté en tant que <span className="font-semibold">{username}</span>
            </span>
            <button
              onClick={handleLogout}
              className="bg-rose-600 text-white border border-rose-600 rounded-md py-1.5 px-3 text-sm font-medium inline-flex items-center justify-center transition-all duration-200 hover:bg-rose-700 hover:shadow focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
            >
              Déconnexion
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 py-8 px-4 sm:px-6">
        <div className="w-full max-w-5xl mx-auto">
          
          
          {/* Liste des fichiers */}
          <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
            <div className="bg-blue-600 text-white py-4 px-5 relative">
              <h2 className="text-lg font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2.5 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                Documents disponibles
              </h2>
            </div>
            <div className="p-3 sm:p-6 overflow-x-auto">
              <FileList />
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white/90 shadow-inner py-5 mt-8">
        <div className="max-w-7xl mx-auto flex sm:flex-row justify-center items-center px-4">
          <div className="flex items-center justify-center">
            <p className="text-sm">
              © {new Date().getFullYear()} BDE Infocontact - Administration
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 