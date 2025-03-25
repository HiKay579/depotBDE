'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ParticipationSuccessPage() {
  const router = useRouter();

  // Rediriger vers la page d'accueil de la tombola après 10 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/tombola');
    }, 10000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-rose-600 text-white shadow sticky top-0 z-10 py-2.5">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
          <div className="flex items-center">
            <div className="flex items-center gap-3">
              <Image 
                src="/image.png" 
                alt="Logo BDE Infocontact" 
                width={40} 
                height={40} 
                className="bg-white rounded-lg p-1.5 shadow transform -rotate-3 transition-transform duration-300 ease-in-out animated-logo"
              />
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white/95 mt-0.5">
                  BDE Infocontact
                </h1>
                <p className="text-xs text-white/85 -mt-0.5">
                  Participation à la Tombola
                </p>
              </div>
            </div>
          </div>
          <Link
            href="/tombola"
            className="bg-white text-rose-600 border border-rose-600 rounded-md py-2 px-4 font-medium h-9.5 inline-flex items-center justify-center transition-all duration-200 hover:bg-rose-100 hover:border-white hover:text-rose-600 hover:shadow focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
          >
            Tombola
          </Link>
        </div>
      </header>
      
      <main className="flex-1 py-10 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
            <div className="bg-rose-600 text-white py-4 px-5 relative">
              <h2 className="text-lg font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2.5 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
                Participation Confirmée
              </h2>
            </div>
            
            <div className="p-8 text-center">
              <div className="rounded-full bg-green-100 w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Merci pour votre participation !
              </h3>
              
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Votre participation à la tombola du BDE Infocontact a bien été enregistrée. Le tirage au sort sera effectué prochainement, restez à l'écoute !
              </p>
              
              <div className="space-y-4">
                <Link
                  href="/tombola"
                  className="bg-rose-600 text-white rounded-md py-2.5 px-4 font-medium inline-flex items-center justify-center transition-all hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                >
                  Retour à la page de la tombola
                </Link>
                
                <p className="text-sm text-gray-500 mt-6">
                  Vous serez automatiquement redirigé vers la page d'accueil de la tombola dans quelques secondes...
                </p>
              </div>
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