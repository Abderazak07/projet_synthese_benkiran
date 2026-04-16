import { useState, useEffect } from 'react';
import api from '../../services/api';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';

export default function AdminPayments() {
  const [paiements, setPaiements] = useState([]);

  useEffect(() => { fetchPaiements(); }, []);
  const fetchPaiements = () => api.get('/admin/paiements').then(res => setPaiements(res.data));

  const changeStatus = async (id, statut) => {
    try {
      await api.put(`/admin/paiements/${id}/statut`, { statut });
      toast.success('Statut mis à jour');
      fetchPaiements();
    } catch (e) { toast.error('Erreur'); }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-black mb-6 uppercase text-primary">Paiements</h1>
      <div className="glass-card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="p-4 text-gray-400">ID</th>
              <th className="p-4 text-gray-400">Commande</th>
              <th className="p-4 text-gray-400">Montant</th>
              <th className="p-4 text-gray-400">Statut</th>
              <th className="p-4 text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
             {paiements.map(p => (
              <tr key={p.id}>
                <td className="p-4">#{p.id}</td>
                <td className="p-4 text-white font-medium">#{p.commande_id}</td>
                <td className="p-4 font-bold text-accent">{p.montant} €</td>
                <td className="p-4"><Badge variant={p.statut === 'Validé' ? 'success' : 'warning'}>{p.statut}</Badge></td>
                <td className="p-4 text-right">
                  <select 
                    className="bg-dark border border-white/20 text-white rounded p-1 text-sm outline-none"
                    value={p.statut}
                    onChange={(e) => changeStatus(p.id, e.target.value)}
                  >
                    <option value="En attente">En attente</option>
                    <option value="Validé">Validé</option>
                    <option value="Échoué">Échoué</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
