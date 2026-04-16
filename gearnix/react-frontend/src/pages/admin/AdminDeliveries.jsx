import { useState, useEffect } from 'react';
import api from '../../services/api';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';

export default function AdminDeliveries() {
  const [livraisons, setLivraisons] = useState([]);

  useEffect(() => { fetchLivraisons(); }, []);
  const fetchLivraisons = () => api.get('/admin/livraisons').then(res => setLivraisons(res.data));

  const changeStatus = async (id, statut) => {
    try {
      await api.put(`/admin/livraisons/${id}/statut`, { statut });
      toast.success('Statut mis à jour');
      fetchLivraisons();
    } catch (e) { toast.error('Erreur'); }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-black mb-6 uppercase text-primary">Livraisons</h1>
      <div className="glass-card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="p-4 text-gray-400">ID</th>
              <th className="p-4 text-gray-400">Commande</th>
              <th className="p-4 text-gray-400">Adresse</th>
              <th className="p-4 text-gray-400">Statut</th>
              <th className="p-4 text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
             {livraisons.map(l => (
              <tr key={l.id}>
                <td className="p-4">#{l.id}</td>
                <td className="p-4 text-white font-medium">#{l.commande_id}</td>
                <td className="p-4 text-gray-300 text-sm max-w-[200px] truncate" title={l.adresse}>{l.adresse}</td>
                <td className="p-4"><Badge variant={l.statut === 'Livré' ? 'success' : 'warning'}>{l.statut}</Badge></td>
                <td className="p-4 text-right">
                  <select 
                    className="bg-dark border border-white/20 text-white rounded p-1 text-sm outline-none"
                    value={l.statut}
                    onChange={(e) => changeStatus(l.id, e.target.value)}
                  >
                    <option value="En préparation">En préparation</option>
                    <option value="Expédié">Expédié</option>
                    <option value="En transit">En transit</option>
                    <option value="Livré">Livré</option>
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
