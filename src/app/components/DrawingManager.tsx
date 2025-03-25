'use client';

import { useState, useEffect } from 'react';

type Participant = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  createdAt: string;
};

type Prize = {
  id: string;
  name: string;
  description: string | null;
  quantity: number;
  createdAt: string;
  updatedAt: string;
};

type Winner = {
  id: string;
  participantId: string;
  prizeId: string;
  createdAt: string;
  prize: Prize;
};

export default function DrawingManager() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [selectedPrize, setSelectedPrize] = useState<string>('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawResult, setDrawResult] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Charger les participants, les lots et les gagnants au chargement du composant
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
        
        // Récupérer tous les lots
        const prizesResponse = await fetch('/api/tombola/prizes');
        if (!prizesResponse.ok) {
          throw new Error('Erreur lors de la récupération des lots');
        }
        const prizesData = await prizesResponse.json();
        setPrizes(prizesData);
        
        // Récupérer tous les gagnants
        const winnersResponse = await fetch('/api/tombola/winners');
        if (!winnersResponse.ok) {
          throw new Error('Erreur lors de la récupération des gagnants');
        }
        const winnersData = await winnersResponse.json();
        setWinners(winnersData);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setError('Erreur lors du chargement des données. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Effectuer le tirage au sort
  const performDrawing = async () => {
    if (!selectedPrize) {
      setError('Veuillez sélectionner un lot pour le tirage au sort.');
      return;
    }
    
    setIsDrawing(true);
    setDrawResult(null);
    setError(null);
    setSuccessMessage(null);
    
    try {
      // Récupérer les IDs des participants qui ont déjà gagné
      const winnerParticipantIds = winners.map(winner => winner.participantId);
      
      // Filtrer les participants qui n'ont pas encore gagné
      const availableParticipants = participants.filter(
        participant => !winnerParticipantIds.includes(participant.id)
      );
      
      if (availableParticipants.length === 0) {
        setError('Il n\'y a plus de participants disponibles pour le tirage au sort.');
        return;
      }
      
      // Sélectionner un participant au hasard
      const randomIndex = Math.floor(Math.random() * availableParticipants.length);
      const winner = availableParticipants[randomIndex];
      setDrawResult(winner);
      
      // Enregistrer le gagnant dans la base de données
      const response = await fetch('/api/tombola/winners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participantId: winner.id,
          prizeId: selectedPrize,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de l\'enregistrement du gagnant');
      }
      
      // Mettre à jour la liste des gagnants
      const winnersResponse = await fetch('/api/tombola/winners');
      if (!winnersResponse.ok) {
        throw new Error('Erreur lors de la récupération des gagnants');
      }
      const winnersData = await winnersResponse.json();
      setWinners(winnersData);
      
      setSuccessMessage(`Félicitations à ${winner.firstName} ${winner.lastName} qui a gagné le lot !`);
    } catch (error) {
      console.error('Erreur lors du tirage au sort:', error);
      setError('Erreur lors du tirage au sort. Veuillez réessayer.');
    } finally {
      setIsDrawing(false);
    }
  };
  
  // Annuler un tirage au sort
  const cancelWinner = async (winnerId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler ce tirage au sort ?')) {
      return;
    }
    
    setError(null);
    setSuccessMessage(null);
    
    try {
      const response = await fetch(`/api/tombola/winners/${winnerId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de l\'annulation du tirage au sort');
      }
      
      // Mettre à jour la liste des gagnants
      const winnersResponse = await fetch('/api/tombola/winners');
      if (!winnersResponse.ok) {
        throw new Error('Erreur lors de la récupération des gagnants');
      }
      const winnersData = await winnersResponse.json();
      setWinners(winnersData);
      
      setSuccessMessage('Tirage au sort annulé avec succès.');
    } catch (error) {
      console.error('Erreur lors de l\'annulation du tirage au sort:', error);
      setError('Erreur lors de l\'annulation du tirage au sort. Veuillez réessayer.');
    }
  };
  
  // Trouver un lot par son ID
  const findPrizeById = (prizeId: string) => {
    return prizes.find(prize => prize.id === prizeId);
  };
  
  // Trouver un participant par son ID
  const findParticipantById = (participantId: string) => {
    return participants.find(participant => participant.id === participantId);
  };
  
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

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-md flex items-center text-sm mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          {error}
        </div>
      )}
      
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Tirage au sort</h3>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <svg className="animate-spin h-8 w-8 text-rose-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Nombre de participants: <span className="font-semibold">{participants.length}</span>
              </p>
              
              <div className="mb-4">
                <label htmlFor="prizeSelect" className="block text-sm font-medium text-gray-700 mb-1">
                  Sélectionnez un lot pour le tirage au sort
                </label>
                <select
                  id="prizeSelect"
                  value={selectedPrize}
                  onChange={(e) => setSelectedPrize(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                >
                  <option value="">-- Sélectionnez un lot --</option>
                  {prizes.map((prize) => (
                    <option key={prize.id} value={prize.id}>
                      {prize.name} (Quantité: {prize.quantity})
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={performDrawing}
                disabled={isDrawing || participants.length === 0 || !selectedPrize}
                className="w-full bg-rose-600 text-white rounded-md h-10 font-medium flex items-center justify-center transition-all hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isDrawing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Tirage en cours...
                  </>
                ) : (
                  'Effectuer le tirage au sort'
                )}
              </button>
            </div>
            
            {drawResult && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6 animate-pulse">
                <h4 className="text-lg font-semibold text-green-800 mb-2">Résultat du tirage au sort</h4>
                <p className="text-green-700">
                  <span className="font-medium">Gagnant(e):</span> {drawResult.firstName} {drawResult.lastName}
                </p>
                <p className="text-green-700">
                  <span className="font-medium">Email:</span> {drawResult.email}
                </p>
                {drawResult.phoneNumber && (
                  <p className="text-green-700">
                    <span className="font-medium">Téléphone:</span> {drawResult.phoneNumber}
                  </p>
                )}
                <p className="text-green-700">
                  <span className="font-medium">Lot gagné:</span> {findPrizeById(selectedPrize)?.name}
                </p>
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Liste des gagnants</h3>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <svg className="animate-spin h-8 w-8 text-rose-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : winners.length === 0 ? (
          <div className="bg-gray-50 rounded-md p-4 text-center text-gray-500">
            Aucun tirage au sort n'a encore été effectué.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gagnant(e)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lot gagné
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {winners.map((winner) => {
                  const participant = findParticipantById(winner.participantId);
                  return (
                    <tr key={winner.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {participant ? `${participant.firstName} ${participant.lastName}` : `Participant #${winner.participantId.substring(0, 8)}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {participant ? (
                          <>
                            <div className="text-sm text-gray-500">{participant.email}</div>
                            {participant.phoneNumber && (
                              <div className="text-sm text-gray-500">{participant.phoneNumber}</div>
                            )}
                          </>
                        ) : (
                          <div className="text-sm text-gray-500">Information non disponible</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{winner.prize.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(winner.createdAt).toLocaleDateString()} à {new Date(winner.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => cancelWinner(winner.id)}
                          className="text-rose-600 hover:text-rose-800"
                        >
                          Annuler
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 