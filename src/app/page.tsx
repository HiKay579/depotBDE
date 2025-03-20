import FileUploader from './components/FileUploader';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
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
                  Gestionnaire de documents
                </p>
              </div>
            </div>
          </div>
          <Link
            href="/login"
            className="bg-white text-rose-600 border border-rose-600 rounded-md py-2 px-4 font-medium h-9.5 inline-flex items-center justify-center transition-all duration-200 hover:bg-rose-100 hover:border-white hover:text-rose-600 hover:shadow focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
          >
            Accéder aux fichiers
          </Link>
        </div>
      </header>
      
      <main className="flex-1 py-10 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
            <div className="bg-rose-600 text-white py-4 px-5 relative">
              <h2 className="text-lg font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2.5 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                </svg>
                Télécharger un fichier
              </h2>
            </div>
            <div className="p-6">
              <FileUploader />
            </div>
          </div>
          
          <div className="mt-8 bg-white rounded-xl shadow border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
            <div className="p-6 flex items-start space-x-5">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-rose-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">À propos de cette application</h3>
                <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">
                  Cette application permet de télécharger des fichiers pour le BDE Infocontact. 
                  Les fichiers téléchargés seront disponibles dans la section "Fichiers" pour les utilisateurs autorisés.
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
