'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
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
          <svg className="animate-spin h-10 w-10 text-rose-600 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
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
                  Panneau de contrôle
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <span className="text-sm text-white/80 mr-3">
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
      
      <main className="flex-1 py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Tableau de bord administrateur</h2>
            <p className="text-gray-600">Sélectionnez un module à administrer ci-dessous.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Gestion des Fichiers */}
            <div 
              className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
              onClick={() => router.push('/admin/files')}
            >
              <div className="p-8">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-800 text-center mb-3">Gestion des Fichiers</h3>
                <p className="text-gray-600 text-center mb-6">
                  Gérez les fichiers déposés, modifiez les permissions et organisez les documents.
                </p>
                
                <div className="flex justify-center">
                  <Link
                    href="/admin/files"
                    className="bg-blue-600 text-white rounded-md py-2.5 px-5 font-medium inline-flex items-center justify-center transition-all duration-200 hover:bg-blue-700 hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Gérer les fichiers
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Gestion de la Tombola */}
            <div 
              className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
              onClick={() => router.push('/tombola/admin')}
            >
              <div className="p-8">
                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-800 text-center mb-3">Gestion de la Tombola</h3>
                <p className="text-gray-600 text-center mb-6">
                  Gérez les participants, les lots et effectuez les tirages de la tombola.
                </p>
                
                <div className="flex justify-center">
                  <Link
                    href="/tombola/admin"
                    className="bg-purple-600 text-white rounded-md py-2.5 px-5 font-medium inline-flex items-center justify-center transition-all duration-200 hover:bg-purple-700 hover:shadow focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  >
                    Gérer la tombola
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Retour au site */}
          <div className="mt-12 text-center">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-800 text-sm font-medium inline-flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour au site principal
            </Link>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white/90 shadow-inner py-5 mt-auto">
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