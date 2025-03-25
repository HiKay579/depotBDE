'use client';

import { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';

interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  createdAt: string;
  qrCodeId: string;
}

interface Winner {
  id: string;
  participantId: string;
  prizeId: string;
  createdAt: string;
  prize: {
    id: string;
    name: string;
  };
  participant: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export default function ParticipantsList() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Participant>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showOnlyNonWinners, setShowOnlyNonWinners] = useState(false);

  // Charger les participants et les gagnants au chargement du composant
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Récupérer tous les participants
        const participantsResponse = await fetch('/api/tombola/participants');
        if (!participantsResponse.ok) {
          throw new Error('Erreur lors de la récupération des participants');
        }
        const participantsData = await participantsResponse.json();
        setParticipants(participantsData);
        
        // Récupérer tous les gagnants
        const winnersResponse = await fetch('/api/tombola/winners');
        if (!winnersResponse.ok) {
          throw new Error('Erreur lors de la récupération des gagnants');
        }
        const winnersData = await winnersResponse.json();
        setWinners(winnersData);
      } catch (error) {
        console.error('Erreur:', error);
        setError('Impossible de charger les participants. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Fonction pour trier les participants
  const handleSort = (field: keyof Participant) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Récupérer les IDs des participants qui ont déjà gagné
  const winnerParticipantIds = winners.map(winner => winner.participantId);

  // Filtrer et trier les participants
  const filteredAndSortedParticipants = participants
    .filter(participant => {
      // Filtrer par texte de recherche
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch = (
        participant.firstName.toLowerCase().includes(searchTermLower) ||
        participant.lastName.toLowerCase().includes(searchTermLower) ||
        participant.email.toLowerCase().includes(searchTermLower) ||
        (participant.phoneNumber && participant.phoneNumber.includes(searchTerm))
      );
      
      // Filtrer les participants qui n'ont pas gagné si l'option est activée
      const matchesWinnerFilter = showOnlyNonWinners 
        ? !winnerParticipantIds.includes(participant.id)
        : true;
      
      return matchesSearch && matchesWinnerFilter;
    })
    .sort((a, b) => {
      if (a[sortField] === b[sortField]) return 0;
      
      const aValue = a[sortField] ? String(a[sortField]).toLowerCase() : '';
      const bValue = b[sortField] ? String(b[sortField]).toLowerCase() : '';
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Préparer les données pour l'export CSV
  const csvData = filteredAndSortedParticipants.map(p => ({
    Prénom: p.firstName,
    Nom: p.lastName,
    Email: p.email,
    Téléphone: p.phoneNumber || 'Non renseigné',
    'Date d\'inscription': new Date(p.createdAt).toLocaleString('fr-FR'),
    'Statut': winnerParticipantIds.includes(p.id) ? 'Gagnant' : 'En attente'
  }));

  // Rendu du composant avec affichage de chargement ou d'erreur si nécessaire
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Erreur!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Rechercher un participant..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="flex items-center">
            <label className="inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="form-checkbox h-5 w-5 text-rose-600 transition duration-150 ease-in-out border-gray-300 rounded focus:ring-rose-500"
                checked={showOnlyNonWinners}
                onChange={() => setShowOnlyNonWinners(!showOnlyNonWinners)}
              />
              <span className="ml-2 text-sm text-gray-700">N'afficher que les participants sans gain</span>
            </label>
          </div>
        </div>
        
        <CSVLink
          data={csvData}
          filename={`participants-tombola-${new Date().toISOString().split('T')[0]}.csv`}
          className="bg-green-600 text-white rounded-md py-2 px-4 flex items-center justify-center transition-all duration-200 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Exporter en CSV
        </CSVLink>
      </div>
      
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('firstName')}
              >
                <div className="flex items-center">
                  Prénom
                  {sortField === 'firstName' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('lastName')}
              >
                <div className="flex items-center">
                  Nom
                  {sortField === 'lastName' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('email')}
              >
                <div className="flex items-center">
                  Email
                  {sortField === 'email' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('phoneNumber')}
              >
                <div className="flex items-center">
                  Téléphone
                  {sortField === 'phoneNumber' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center">
                  Date d'inscription
                  {sortField === 'createdAt' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAndSortedParticipants.length > 0 ? (
              filteredAndSortedParticipants.map((participant) => (
                <tr key={participant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {participant.firstName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {participant.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {participant.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {participant.phoneNumber || "Non renseigné"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(participant.createdAt).toLocaleString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {winnerParticipantIds.includes(participant.id) ? (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Gagnant</span>
                    ) : (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">Looser</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  {searchTerm ? "Aucun participant ne correspond à votre recherche" : 
                   showOnlyNonWinners ? "Tous les participants ont déjà gagné un lot" : 
                   "Aucun participant n'est inscrit pour le moment"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        {filteredAndSortedParticipants.length} participants{' '}
        {searchTerm && `pour la recherche "${searchTerm}"`}
        {showOnlyNonWinners && (searchTerm ? ' et ' : '') + 'sans gain'}
      </div>
    </div>
  );
} 