'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ModulesSelection() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-rose-600 text-white shadow sticky top-0 z-10 py-2.5">
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
                  BDE Infocontact
                </h1>
                <p className="text-xs text-white/85 -mt-0.5">
                  Sélection des services
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href="/"
              className="bg-white text-rose-600 border border-rose-600 rounded-md py-2 px-4 font-medium h-9.5 inline-flex items-center justify-center transition-all duration-200 hover:bg-rose-100 hover:border-white hover:text-rose-600 hover:shadow focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-1 py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Sélectionnez un service</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Dépôt de fichiers */}
            <div 
              className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
              onClick={() => router.push('/files')}
            >
              <div className="p-8">
                <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                  </svg>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-800 text-center mb-3">Dépôt & Consultation de Fichiers</h3>
                <p className="text-gray-600 text-center mb-6">
                  Déposez vos fichiers ou consultez les documents disponibles.
                </p>
                
                <div className="flex justify-center">
                  <Link
                    href="/files"
                    className="bg-rose-600 text-white rounded-md py-2.5 px-5 font-medium inline-flex items-center justify-center transition-all duration-200 hover:bg-rose-700 hover:shadow focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                  >
                    Accéder aux fichiers
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Tombola */}
            <div 
              className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
              onClick={() => router.push('/tombola')}
            >
              <div className="p-8">
                <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  </svg>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-800 text-center mb-3">Tombola BDE</h3>
                <p className="text-gray-600 text-center mb-6">
                  Participez à notre tombola et tentez de gagner des lots exceptionnels!
                </p>
                
                <div className="flex justify-center">
                  <Link
                    href="/tombola"
                    className="bg-rose-600 text-white rounded-md py-2.5 px-5 font-medium inline-flex items-center justify-center transition-all duration-200 hover:bg-rose-700 hover:shadow focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                  >
                    Participer à la tombola
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Admin Login Button */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Vous êtes administrateur?</p>
            <Link
              href="/admin"
              className="bg-gray-800 text-white rounded-md py-2.5 px-5 font-medium inline-flex items-center justify-center transition-all duration-200 hover:bg-gray-700 hover:shadow focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Accéder à l'administration
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            </Link>
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