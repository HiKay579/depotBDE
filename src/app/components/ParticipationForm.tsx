'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ParticipationFormProps {
  qrCodeId: string;
}

export default function ParticipationForm({ qrCodeId }: ParticipationFormProps) {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/tombola/participants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phoneNumber: phoneNumber || null,
          qrCodeId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erreur lors de la participation');
      }

      // Rediriger vers la page de confirmation
      router.push('/tombola/participation/success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-md flex items-center text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label 
            htmlFor="firstName" 
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Prénom *
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full border border-gray-300 rounded-md py-2.5 px-3 text-sm transition-colors focus:ring-2 focus:ring-rose-500 focus:border-rose-500 hover:border-gray-400 outline-none"
            placeholder="Entrez votre prénom"
            required
          />
        </div>

        <div>
          <label 
            htmlFor="lastName" 
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Nom *
          </label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full border border-gray-300 rounded-md py-2.5 px-3 text-sm transition-colors focus:ring-2 focus:ring-rose-500 focus:border-rose-500 hover:border-gray-400 outline-none"
            placeholder="Entrez votre nom"
            required
          />
        </div>

        <div>
          <label 
            htmlFor="email" 
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Email *
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md py-2.5 px-3 text-sm transition-colors focus:ring-2 focus:ring-rose-500 focus:border-rose-500 hover:border-gray-400 outline-none"
            placeholder="Entrez votre adresse email"
            required
          />
        </div>

        <div>
          <label 
            htmlFor="phoneNumber" 
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Numéro de téléphone
          </label>
          <input
            id="phoneNumber"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full border border-gray-300 rounded-md py-2.5 px-3 text-sm transition-colors focus:ring-2 focus:ring-rose-500 focus:border-rose-500 hover:border-gray-400 outline-none"
            placeholder="Entrez votre numéro de téléphone (optionnel)"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-rose-600 text-white rounded-md h-10 font-medium flex items-center justify-center transition-all hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Participation en cours...
              </>
            ) : (
              <>
                Participer à la tombola
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 