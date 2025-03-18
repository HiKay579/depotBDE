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

    try {
      // API route pour l'upload de fichiers
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

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
      setUploading(false);
      setProgress(100);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-12 w-12 text-gray-400 mb-3" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
          />
        </svg>
        <p className="mb-2 text-sm text-gray-500">
          <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
        </p>
        <p className="text-xs text-gray-500">
          Tous types de fichiers acceptés
        </p>
        <input 
          type="file" 
          className="hidden" 
          onChange={handleFileChange}
          ref={fileInputRef}
        />
      </div>

      {file && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-900 truncate">
            {file.name}
          </p>
          <p className="text-xs text-gray-500">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
          <button
            onClick={uploadFile}
            disabled={uploading}
            className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors disabled:bg-blue-300"
          >
            {uploading ? 'Téléchargement en cours...' : 'Télécharger'}
          </button>
        </div>
      )}

      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {error && (
        <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 text-sm text-green-600 bg-green-50 p-3 rounded">
          {success}
        </div>
      )}
    </div>
  );
} 