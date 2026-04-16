import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function FournisseurOrders() {
  const [commandes, setCommandes] = useState([]);

  useEffect(() => {
    api.get('/fournisseur/commandes').then(res => setCommandes(res.data)).catch(() => {});
  }, []);

  return (
    <div>
      <div className="mb-4">
        <h1 className="dash-title">Commandes</h1>
        <p className="dash-muted text-sm">Commandes reçues pour vos produits.</p>
      </div>

      <div className="dash-card p-6">
        {commandes.length === 0 ? (
          <p className="text-slate-500">Aucune commande reçue pour le moment.</p>
        ) : (
          <div className="space-y-4">
             {commandes.map(cmd => (
               <div key={cmd.id} className="border border-slate-200 p-5 rounded-xl bg-white">
                 <p className="font-semibold text-slate-900 mb-2">
                  Commande #{cmd.id} — Total: <span className="font-bold">{cmd.total} €</span>
                 </p>
                 <ul className="pl-4 space-y-1">
                   {cmd.produits.map(p => (
                     <li key={p.id} className="text-sm text-slate-600">• {p.nom} (x{p.pivot.quantite})</li>
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
