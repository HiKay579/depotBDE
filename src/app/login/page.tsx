import Link from 'next/link';
import LoginForm from '../components/LoginForm';
import Image from 'next/image';

export default function LoginPage() {
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
            href="/"
            className="bg-white text-rose-600 border border-rose-600 rounded-md py-2 px-4 font-medium h-9.5 inline-flex items-center justify-center transition-all duration-200 hover:bg-rose-100 hover:border-white hover:text-rose-600 hover:shadow focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
          >
            Retour à l'accueil
          </Link>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="mx-auto w-18 h-18 flex items-center justify-center bg-white rounded-full shadow-md border-2 border-white p-0.5">
              <Image 
                src="/téléchargement.jpeg" 
                alt="Logo BDE Infocontact" 
                width={64}
                height={64}
                className="rounded-full"
              />
            </div>
            <h2 className="mt-5 text-2xl font-bold text-gray-800">
              Connexion
            </h2>
            <p className="mt-2 text-sm text-gray-600 max-w-xs mx-auto">
              Accédez à la gestion des documents du BDE
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-7 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
            <LoginForm />
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Besoin d'aide ? <a href="#" className="text-rose-600 font-medium hover:text-rose-500 hover:underline">Contactez l'administrateur du BDE</a>
            </p>
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