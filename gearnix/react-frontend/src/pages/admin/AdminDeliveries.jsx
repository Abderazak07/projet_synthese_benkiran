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
    <div>
      <div className="mb-4">
        <h1 className="dash-title">Livraisons</h1>
        <p className="dash-muted text-sm">Suivez l’avancement des livraisons et mettez à jour les statuts.</p>
      </div>

      <div className="dash-card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-slate-600 text-xs font-semibold uppercase tracking-wider">ID</th>
              <th className="p-4 text-slate-600 text-xs font-semibold uppercase tracking-wider">Commande</th>
              <th className="p-4 text-slate-600 text-xs font-semibold uppercase tracking-wider">Adresse</th>
              <th className="p-4 text-slate-600 text-xs font-semibold uppercase tracking-wider">Statut</th>
              <th className="p-4 text-slate-600 text-xs font-semibold uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
             {livraisons.map(l => (
              <tr key={l.id} className="hover:bg-slate-50">
                <td className="p-4 text-slate-700 font-semibold">#{l.id}</td>
                <td className="p-4 text-slate-900 font-semibold">#{l.commande_id}</td>
                <td className="p-4 text-slate-600 text-sm max-w-[260px] truncate" title={l.adresse}>{l.adresse}</td>
                <td className="p-4"><Badge variant={l.statut === 'Livré' ? 'success' : 'warning'}>{l.statut}</Badge></td>
                <td className="p-4 text-right">
                  <select 
                    className="bg-white border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2f7a78] focus:ring-1 focus:ring-[#2f7a78]/25"
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
