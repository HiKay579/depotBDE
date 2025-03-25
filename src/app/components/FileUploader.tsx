'use client';

import { useState, useRef } from 'react';

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setError(null);
    setSuccess(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files?.[0] || null;
    if (droppedFile) {
      setFile(droppedFile);
      setError(null);
      setSuccess(null);
    }
  };

  const uploadFile = async () => {
    if (!file) {
      setError('Veuillez sélectionner un fichier');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setProgress(0);
    setError(null);
    setSuccess(null);

    // Simuler une progression
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        return newProgress > 90 ? 90 : newProgress;
      });
    }, 400);

    try {
      // API route pour l'upload de fichiers
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'upload');
      }

      const data = await response.json();
      setSuccess(`Fichier téléchargé avec succès: ${data.filename}`);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      clearInterval(progressInterval);
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-full sm:max-w-2xl mx-auto">
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-8 bg-white
          flex flex-col items-center justify-center cursor-pointer 
          hover:border-rose-600 hover:bg-rose-50/10 transition-all duration-200
          transform hover:-translate-y-0.5 group"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-rose-50 group-hover:bg-rose-100 transition-colors mb-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 text-rose-600" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
            />
          </svg>
        </div>
        <p className="mb-2 text-sm sm:text-base text-gray-800 font-medium text-center">
          <span className="font-semibold text-rose-600">Cliquez pour télécharger</span> ou glissez-déposez
        </p>
        <p className="text-xs sm:text-sm text-gray-500 text-center">
          Tous types de fichiers acceptés (max 100MB)
        </p>
        <input 
          type="file" 
          className="hidden" 
          onChange={handleFileChange}
          ref={fileInputRef}
        />
      </div>

      {file && (
        <div className="mt-4 sm:mt-6 bg-white rounded-lg p-4 sm:p-5 border border-gray-200 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-3 sm:mr-4">
              {file.type.includes('image') ? (
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-rose-50 rounded-md flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 sm:h-6 w-5 sm:w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              ) : (
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-rose-50 rounded-md flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 sm:h-6 w-5 sm:w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base font-medium text-gray-800 truncate">
                {file.name}
              </p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              className="ml-2 bg-gray-100 rounded-full p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-all"
              aria-label="Supprimer le fichier"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              uploadFile();
            }}
            disabled={uploading}
            className="mt-4 sm:mt-5 w-full bg-rose-600 text-white py-2 sm:py-2.5 px-4 rounded-md font-medium flex items-center justify-center transition-all hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Téléchargement en cours...
              </>
            ) : (
              <>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 sm:h-5 w-4 sm:w-5 mr-2" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" 
                  />
                </svg>
                Télécharger
              </>
            )}
          </button>
        </div>
      )}

      {uploading && (
        <div className="mt-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progression</span>
            <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-rose-600 rounded-full relative"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-5 bg-rose-50 border border-rose-100 border-l-4 border-l-rose-500 text-rose-700 p-4 rounded-md flex items-center" role="alert">
          <span className="mr-3 font-bold text-lg">✕</span>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mt-5 bg-green-50 border border-green-100 border-l-4 border-l-green-500 text-green-700 p-4 rounded-md flex items-center" role="alert">
          <span className="mr-3 font-bold text-lg">✓</span>
          <span>{success}</span>
        </div>
      )}
    </div>
  );
} 