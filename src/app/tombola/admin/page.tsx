'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import QRCodeGenerator from '@/app/components/QRCodeGenerator';
import PrizeManager from '@/app/components/PrizeManager';
import DrawingManager from '@/app/components/DrawingManager';
import ParticipantsList from '@/app/components/ParticipantsList';
import { useRouter } from 'next/navigation';

export default function TombolaAdminPage() {
  const [activeTab, setActiveTab] = useState<'qrcodes' | 'prizes' | 'drawing' | 'participants'>('qrcodes');
  const [username, setUsername] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

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
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-gray-800 text-white shadow sticky top-0 z-10 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center px-4 gap-3">
          <div className="flex items-center w-full sm:w-auto justify-between">
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
                  Gestion de la tombola
                </p>
              </div>
            </div>
            
            <div className="flex sm:hidden">
              <Link
                href="/admin"
                className="text-white/80 hover:text-white text-sm font-medium mr-3"
              >
                Tableau de bord
              </Link>
              <button
                onClick={handleLogout}
                className="bg-rose-600 text-white border border-rose-600 rounded-md py-1.5 px-2 text-sm font-medium inline-flex items-center justify-center transition-all duration-200 hover:bg-rose-700 hover:shadow focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="hidden sm:flex gap-3 items-center justify-center">
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
          
          <div className="sm:hidden w-full flex justify-center mt-1">
            <span className="text-xs text-white/80 text-center">
              Connecté en tant que <span className="font-semibold">{username}</span>
            </span>
          </div>
        </div>
      </header>
      
      <main className="flex-1 py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
            <div className="bg-rose-600 text-white py-4 px-5 relative">
              <h2 className="text-lg font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2.5 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Administration de la Tombola
              </h2>
            </div>
            
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex flex-wrap overflow-x-auto" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('qrcodes')}
                  className={`
                    flex-grow sm:flex-grow-0 sm:w-1/4 py-4 px-2 sm:px-3 text-center border-b-2 text-sm sm:text-base whitespace-nowrap
                    ${activeTab === 'qrcodes'
                      ? 'border-rose-500 text-rose-600 font-medium'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                >
                  QR Codes
                </button>
                <button
                  onClick={() => setActiveTab('prizes')}
                  className={`
                    flex-grow sm:flex-grow-0 sm:w-1/4 py-4 px-2 sm:px-3 text-center border-b-2 text-sm sm:text-base whitespace-nowrap
                    ${activeTab === 'prizes'
                      ? 'border-rose-500 text-rose-600 font-medium'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                >
                  Gestion des Lots
                </button>
                <button
                  onClick={() => setActiveTab('drawing')}
                  className={`
                    flex-grow sm:flex-grow-0 sm:w-1/4 py-4 px-2 sm:px-3 text-center border-b-2 text-sm sm:text-base whitespace-nowrap
                    ${activeTab === 'drawing'
                      ? 'border-rose-500 text-rose-600 font-medium'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                >
                  Tirage au Sort
                </button>
                <button
                  onClick={() => setActiveTab('participants')}
                  className={`
                    flex-grow sm:flex-grow-0 sm:w-1/4 py-4 px-2 sm:px-3 text-center border-b-2 text-sm sm:text-base whitespace-nowrap
                    ${activeTab === 'participants'
                      ? 'border-rose-500 text-rose-600 font-medium'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                >
                  Participants
                </button>
              </nav>
            </div>
            
            <div className="p-6">
              {activeTab === 'qrcodes' && <QRCodeGenerator />}
              
              {activeTab === 'prizes' && <PrizeManager />}
              
              {activeTab === 'drawing' && <DrawingManager />}
              
              {activeTab === 'participants' && <ParticipantsList />}
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white/90 shadow-inner py-5 mt-auto">
        <div className="max-w-7xl mx-auto flex sm:flex-row justify-center items-center px-4">
          <div className="flex items-center justify-center">
            <p className="text-sm">
              © {new Date().getFullYear()} BDE Infocontact
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 