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
                  Site officiel
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href="/modules"
              className="bg-white text-rose-600 border border-rose-600 rounded-md py-2 px-4 font-medium h-9.5 inline-flex items-center justify-center transition-all duration-200 hover:bg-rose-100 hover:border-white hover:text-rose-600 hover:shadow focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
            >
              Accéder aux services
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-1 py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden transition-all duration-200 mb-8">
            <div className="p-8 text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Bienvenue sur le site du BDE Infocontact</h2>
              <p className="text-lg text-gray-600 mb-6">
                Le Bureau Des Étudiants Infocontact vous souhaite la bienvenue sur son site officiel
              </p>
              <Link
                href="/modules"
                className="bg-rose-600 text-white rounded-md py-3 px-6 font-medium inline-flex items-center justify-center transition-all duration-200 hover:bg-rose-700 hover:shadow focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
              >
                Découvrir nos services
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
          
          {/* Services Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <div className="bg-rose-600 text-white py-4 px-5 relative">
                <h3 className="text-lg font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2.5 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                  </svg>
                  Dépôt de fichiers
                </h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Accédez à notre service de dépôt et de consultation de documents.
                </p>
                <Link
                  href="/modules"
                  className="inline-flex items-center text-rose-600 hover:text-rose-500 text-sm font-medium"
                >
                  Accéder au service
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <div className="bg-rose-600 text-white py-4 px-5 relative">
                <h3 className="text-lg font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2.5 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  </svg>
                  Tombola
                </h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Participez à notre tombola et tentez de gagner des lots exceptionnels!
                </p>
                <Link
                  href="/modules"
                  className="inline-flex items-center text-rose-600 hover:text-rose-500 text-sm font-medium"
                >
                  Participer à la tombola
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
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
