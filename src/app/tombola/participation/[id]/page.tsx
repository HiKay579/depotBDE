'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ParticipationForm from '@/app/components/ParticipationForm';

export default function ParticipationPage({ params }: { params: { id: string } }) {
  const qrCodeId = params.id;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrCodeData, setQrCodeData] = useState<{ isUsed: boolean } | null>(null);

  useEffect(() => {
    const checkQrCode = async () => {
      try {
        const response = await fetch(`/api/tombola/qrcodes/${qrCodeId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            return notFound();
          }
          throw new Error('Erreur lors de la vérification du QR code');
        }
        
        const data = await response.json();
        setQrCodeData(data);
      } catch (error) {
        console.error('Erreur lors de la vérification du QR code:', error);
        setError('Erreur lors de la vérification du QR code. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };
    
    checkQrCode();
  }, [qrCodeId]);

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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Participation à la Tombola
              </h2>
            </div>
            
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <svg className="animate-spin h-8 w-8 text-rose-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : error ? (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-md flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {error}
                </div>
              ) : qrCodeData?.isUsed ? (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-8 rounded-md text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-semibold mb-2">QR Code déjà utilisé</h3>
                  <p className="text-sm">
                    Désolé, ce QR code a déjà été utilisé pour participer à la tombola.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/tombola"
                      className="bg-rose-600 text-white rounded-md py-2 px-4 font-medium inline-flex items-center justify-center transition-all hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                    >
                      Retour à la page de la tombola
                    </Link>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-700 mb-6">
                    Vous êtes sur le point de participer à la tombola du BDE Infocontact. Veuillez remplir le formulaire ci-dessous pour valider votre participation.
                  </p>
                  
                  <ParticipationForm qrCodeId={qrCodeId} />
                </div>
              )}
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