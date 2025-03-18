import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Dépôt BDE - Connexion
          </h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mt-10">
            <LoginForm />
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