'use client';

import FileUploader from '../components/FileUploader';
import FileList from '../components/FileList';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function FilesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-rose-600 text-white shadow sticky top-0 z-10 py-2.5">
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
                  BDE Infocontact
                </h1>
                <p className="text-xs text-white/85 -mt-0.5">
                  Dépôt et consultation de documents
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-3 sm:mt-0">
            <Link
              href="/modules"
              className="bg-white text-rose-600 border border-rose-600 rounded-md py-2 px-4 font-medium h-9.5 inline-flex items-center justify-center transition-all duration-200 hover:bg-rose-100 hover:border-white hover:text-rose-600 hover:shadow focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
            >
              Retour aux services
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-1 py-6 sm:py-8 px-4 sm:px-6">
        <div className="w-full max-w-4xl mx-auto">
          {/* Section dépôt de fichiers */}
          <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md mb-6 sm:mb-8">
            <div className="bg-rose-600 text-white py-3 sm:py-4 px-4 sm:px-5 relative">
              <h2 className="text-base sm:text-lg font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 sm:h-5 w-4 sm:w-5 mr-2 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                </svg>
                Déposer un document
              </h2>
            </div>
            <div className="p-4 sm:p-6">
              <FileUploader />
            </div>
          </div>
          
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white/90 shadow-inner py-5 mt-6 sm:mt-auto">
        <div className="max-w-7xl mx-auto flex sm:flex-row justify-center items-center px-4">
          <div className="flex items-center justify-center">
            <p className="text-xs sm:text-sm">
              © {new Date().getFullYear()} BDE Infocontact
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 