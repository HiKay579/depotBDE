'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { v4 as uuidv4 } from 'uuid';

export default function QRCodeGenerator() {
  const [qrCodes, setQrCodes] = useState<{ id: string; url: string }[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const generateQRCodes = async () => {
    setIsGenerating(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const newQRCodes = [];
      
      for (let i = 0; i < quantity; i++) {
        const id = uuidv4();
        const participationUrl = `${baseUrl}/tombola/participation/${id}`;
        
        // Créer le QR code dans la base de données
        const response = await fetch('/api/tombola/qrcodes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la création du QR code');
        }

        newQRCodes.push({
          id,
          url: participationUrl,
        });
      }

      setQrCodes(newQRCodes);
      setSuccessMessage(`${quantity} QR code(s) généré(s) avec succès !`);
    } catch (error) {
      setErrorMessage('Erreur lors de la génération des QR codes. Veuillez réessayer.');
      console.error('Erreur lors de la génération des QR codes:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      },
      () => {
        setErrorMessage('Erreur lors de la copie dans le presse-papier');
      }
    );
  };

  const printQRCodes = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      setErrorMessage('Erreur: La fenêtre d\'impression n\'a pas pu être ouverte. Veuillez vérifier vos paramètres de navigateur.');
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>QR Codes Tombola BDE</title>
          <style>
            body { font-family: Arial, sans-serif; }
            .qr-container { 
              display: flex; 
              flex-wrap: wrap; 
              justify-content: center;
            }
            .qr-item {
              margin: 20px;
              padding: 15px;
              border: 1px solid #ccc;
              text-align: center;
              border-radius: 5px;
              width: 200px;
            }
            .qr-instructions {
              font-size: 12px;
              color: #666;
              margin-top: 10px;
            }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="no-print" style="text-align: center; margin-bottom: 20px;">
            <button onclick="window.print()">Imprimer</button>
          </div>
          <div class="qr-container">
            ${qrCodes.map(qrCode => `
              <div class="qr-item">
                <div>
                  <img src="data:image/svg+xml;utf8,${encodeURIComponent(
                    new XMLSerializer().serializeToString(
                      document.getElementById(`qr-${qrCode.id}`)?.querySelector('svg') as SVGElement
                    )
                  )}" />
                </div>
                <div class="qr-instructions">
                  Scannez ce QR code pour participer à la tombola du BDE Infocontact
                </div>
                <div style="font-size: 10px; margin-top: 5px; color: #999; word-break: break-all;">
                  ID: ${qrCode.id}
                </div>
              </div>
            `).join('')}
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  const navigateQR = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentIndex((prevIndex) => 
        prevIndex < qrCodes.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else {
      setCurrentIndex((prevIndex) => 
        prevIndex > 0 ? prevIndex - 1 : prevIndex
      );
    }
  };

  const handleSwipe = (e: React.TouchEvent) => {
    const touchStartX = e.touches[0].clientX;
    
    const handleTouchMove = (moveEvent: TouchEvent) => {
      const touchEndX = moveEvent.touches[0].clientX;
      const diffX = touchStartX - touchEndX;
      
      // Si le mouvement est suffisamment significatif
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          // Swipe vers la gauche (suivant)
          navigateQR('next');
        } else {
          // Swipe vers la droite (précédent)
          navigateQR('prev');
        }
        
        // Nettoyer après le swipe
        document.removeEventListener('touchmove', handleTouchMove);
      }
    };
    
    document.addEventListener('touchmove', handleTouchMove, { once: true });
  };

  const toggleMobileView = () => {
    setMobileView(!mobileView);
    // Réinitialiser l'index lorsqu'on active le mode mobile
    if (!mobileView) {
      setCurrentIndex(0);
    }
  };

  if (mobileView && qrCodes.length > 0) {
    const currentQR = qrCodes[currentIndex];
    return (
      <div 
        className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50"
        onTouchStart={handleSwipe}
      >
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <button 
            onClick={toggleMobileView}
            className="rounded-full bg-white/20 p-2 text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <span className="text-white text-sm">
            {currentIndex + 1} / {qrCodes.length}
          </span>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-xl">
            <QRCodeSVG value={currentQR.url} size={280} />
          </div>
        </div>
        
        <div className="p-4 flex justify-between w-full">
          <button
            onClick={() => navigateQR('prev')}
            disabled={currentIndex === 0}
            className={`p-3 rounded-full ${currentIndex === 0 ? 'text-gray-500' : 'text-white'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={() => navigateQR('next')}
            disabled={currentIndex === qrCodes.length - 1}
            className={`p-3 rounded-full ${currentIndex === qrCodes.length - 1 ? 'text-gray-500' : 'text-white'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div className="absolute bottom-4 text-center w-full">
          <p className="text-white text-sm mb-2">Faites glisser pour naviguer entre les QR codes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center text-sm mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-md flex items-center text-sm mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          {errorMessage}
        </div>
      )}

      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Générer des QR codes pour la tombola</h3>
        
        <div className="mb-4">
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de QR codes à générer :
          </label>
          <input
            type="number"
            id="quantity"
            min="1"
            max="100"
            value={quantity}
            onChange={(e) => setQuantity(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={generateQRCodes}
          disabled={isGenerating}
          className="w-full bg-rose-600 text-white rounded-md h-10 font-medium flex items-center justify-center transition-all hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Génération en cours...
            </>
          ) : (
            'Générer les QR codes'
          )}
        </button>
      </div>

      {qrCodes.length > 0 && (
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">QR codes générés ({qrCodes.length})</h3>
            <div className="flex space-x-2">
              <button
                onClick={toggleMobileView}
                className="bg-indigo-600 text-white border border-indigo-600 rounded-md px-3 py-1.5 text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Mode Mobile
                </span>
              </button>
              <button
                onClick={printQRCodes}
                className="bg-gray-100 text-gray-700 border border-gray-300 rounded-md px-3 py-1.5 text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
              >
                Imprimer
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {qrCodes.map((qrCode) => (
              <div key={qrCode.id} className="border rounded-md p-3 flex flex-col items-center" id={`qr-${qrCode.id}`}>
                <QRCodeSVG value={qrCode.url} size={150} />
                <div className="mt-2 text-center w-full">
                  <p className="text-sm text-gray-500 mt-1 break-all px-2">{qrCode.id}</p>
                  <div className="mt-2 flex justify-center gap-2">
                    <button 
                      onClick={() => copyToClipboard(qrCode.id, qrCode.id)}
                      className="text-xs bg-indigo-100 text-indigo-700 rounded px-2 py-1 hover:bg-indigo-200"
                    >
                      {copiedId === qrCode.id ? 'Copié !' : 'Copier ID'}
                    </button>
                    <button 
                      onClick={() => copyToClipboard(`${baseUrl}/tombola/participation/${qrCode.id}`, `url-${qrCode.id}`)}
                      className="text-xs bg-green-100 text-green-700 rounded px-2 py-1 hover:bg-green-200"
                    >
                      {copiedId === `url-${qrCode.id}` ? 'Copié !' : 'Copier URL'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 