'use client';

import { useState, useEffect } from 'react';

type Prize = {
  id: string;
  name: string;
  description: string | null;
  quantity: number;
  createdAt: string;
  updatedAt: string;
};

export default function PrizeManager() {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // États pour le formulaire d'ajout de lot
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // États pour la modification
  const [editingPrizeId, setEditingPrizeId] = useState<string | null>(null);
  
  // Charger les lots au chargement du composant
  useEffect(() => {
    fetchPrizes();
  }, []);
  
  // Récupérer tous les lots
  const fetchPrizes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/tombola/prizes');
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des lots');
      }
      
      const data = await response.json();
      setPrizes(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des lots:', error);
      setError('Impossible de charger les lots. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };
  
  // Ajouter un nouveau lot
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const response = await fetch('/api/tombola/prizes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description: description || null,
          quantity,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la création du lot');
      }
      
      // Réinitialiser le formulaire
      setName('');
      setDescription('');
      setQuantity(1);
      
      // Mettre à jour la liste des lots
      fetchPrizes();
      
      setSuccessMessage('Lot ajouté avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du lot:', error);
      setError('Erreur lors de l\'ajout du lot. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Supprimer un lot
  const deletePrize = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce lot ?')) {
      return;
    }
    
    setError(null);
    setSuccessMessage(null);
    
    try {
      const response = await fetch(`/api/tombola/prizes/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du lot');
      }
      
      // Mettre à jour la liste des lots
      fetchPrizes();
      
      setSuccessMessage('Lot supprimé avec succès !');
    } catch (error) {
      console.error('Erreur lors de la suppression du lot:', error);
      setError('Erreur lors de la suppression du lot. Veuillez réessayer.');
    }
  };
  
  // Commencer la modification d'un lot
  const startEditing = (prize: Prize) => {
    setEditingPrizeId(prize.id);
    setName(prize.name);
    setDescription(prize.description || '');
    setQuantity(prize.quantity);
  };
  
  // Annuler la modification
  const cancelEditing = () => {
    setEditingPrizeId(null);
    setName('');
    setDescription('');
    setQuantity(1);
  };
  
  // Mettre à jour un lot
  const updatePrize = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingPrizeId) return;
    
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const response = await fetch(`/api/tombola/prizes/${editingPrizeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description: description || null,
          quantity,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du lot');
      }
      
      // Réinitialiser le formulaire
      setEditingPrizeId(null);
      setName('');
      setDescription('');
      setQuantity(1);
      
      // Mettre à jour la liste des lots
      fetchPrizes();
      
      setSuccessMessage('Lot mis à jour avec succès !');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du lot:', error);
      setError('Erreur lors de la mise à jour du lot. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
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
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {editingPrizeId ? 'Modifier le lot' : 'Ajouter un nouveau lot'}
        </h3>
        
        <form onSubmit={editingPrizeId ? updatePrize : handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nom du lot *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="Ex: Enceinte Bluetooth"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (optionnelle)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="Description du lot"
              rows={3}
            />
          </div>
          
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Quantité
            </label>
            <input
              type="number"
              id="quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-rose-600 text-white rounded-md h-10 font-medium flex items-center justify-center transition-all hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {editingPrizeId ? 'Mise à jour...' : 'Ajout en cours...'}
                </>
              ) : (
                editingPrizeId ? 'Mettre à jour le lot' : 'Ajouter le lot'
              )}
            </button>
            
            {editingPrizeId && (
              <button
                type="button"
                onClick={cancelEditing}
                className="bg-gray-200 text-gray-700 rounded-md h-10 font-medium px-4 flex items-center justify-center transition-all hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>
      
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Liste des lots</h3>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <svg className="animate-spin h-8 w-8 text-rose-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : prizes.length === 0 ? (
          <div className="bg-gray-50 rounded-md p-4 text-center text-gray-500">
            Aucun lot n'a été ajouté pour le moment.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantité
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {prizes.map((prize) => (
                  <tr key={prize.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{prize.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 line-clamp-2">
                        {prize.description || <span className="italic text-gray-400">Aucune description</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{prize.quantity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => startEditing(prize)}
                        className="text-rose-600 hover:text-rose-800 mr-3"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => deletePrize(prize.id)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 