'use client';

import { useState, useEffect } from 'react';

type File = {
  id: string;
  filename: string;
  size: number;
  uploadedAt: string;
  url: string;
};

export default function FileList() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/files');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des fichiers');
      }
      const data = await response.json();
      setFiles(data.files);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    else return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/files/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du fichier');
      }
      
      // Rafraîchir la liste des fichiers
      fetchFiles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-100 border-l-4 border-l-rose-500 text-rose-700 p-4 rounded-md flex flex-col">
        <div className="flex items-center">
          <span className="mr-3 font-bold text-lg">✕</span>
          <p>{error}</p>
        </div>
        <button 
          onClick={fetchFiles}
          className="mt-3 bg-rose-600 text-white py-2 px-4 rounded-md font-medium hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <p className="text-gray-500">Aucun fichier téléchargé</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border-spacing-0 rounded-lg overflow-hidden shadow">
        <thead>
          <tr className="bg-rose-600 text-white uppercase text-xs font-medium tracking-wider">
            <th className="py-3 px-4 text-left">
              Nom du fichier
            </th>
            <th className="py-3 px-4 text-left">
              Taille
            </th>
            <th className="py-3 px-4 text-left">
              Date d'upload
            </th>
            <th className="py-3 px-4 text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {files.map((file) => (
            <tr key={file.id} className="bg-white hover:bg-gray-100 transition-colors">
              <td className="py-3 px-4 whitespace-nowrap">
                <div className="flex items-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-rose-600 mr-2" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                    />
                  </svg>
                  <span className="text-sm text-gray-800 font-medium truncate max-w-xs">
                    {file.filename}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-600">
                {formatFileSize(file.size)}
              </td>
              <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-600">
                {formatDate(file.uploadedAt)}
              </td>
              <td className="py-3 px-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  <a
                    href={file.url}
                    download
                    className="text-rose-600 hover:text-rose-500 p-2 transition-colors"
                    aria-label="Télécharger"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
                      />
                    </svg>
                  </a>
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="text-rose-600 hover:text-rose-500 p-2 transition-colors"
                    aria-label="Supprimer"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 