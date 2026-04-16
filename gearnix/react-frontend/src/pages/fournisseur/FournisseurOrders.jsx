import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function FournisseurOrders() {
  const [commandes, setCommandes] = useState([]);

  useEffect(() => {
    api.get('/fournisseur/commandes').then(res => setCommandes(res.data)).catch(() => {});
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-black mb-6 uppercase text-primary">Commandes de mes produits</h1>
      <div className="glass-card p-6">
        {commandes.length === 0 ? (
          <p className="text-gray-400">Aucune commande reçue pour le moment.</p>
        ) : (
          <div className="space-y-4">
             {commandes.map(cmd => (
               <div key={cmd.id} className="border border-white/10 p-4 rounded-lg bg-white/5">
                 <p className="font-bold text-white mb-2">Commande #{cmd.id} - Total: {cmd.total} €</p>
                 <ul className="pl-4 space-y-1">
                   {cmd.produits.map(p => (
                     <li key={p.id} className="text-sm text-gray-300">• {p.nom} (x{p.pivot.quantite})</li>
                   ))}
                 </ul>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
}
