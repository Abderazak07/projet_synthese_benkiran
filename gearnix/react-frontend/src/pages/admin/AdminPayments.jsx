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
    <div>
      <div className="mb-4">
        <h1 className="dash-title">Paiements</h1>
        <p className="dash-muted text-sm">Suivez et validez les paiements associés aux commandes.</p>
      </div>

      <div className="dash-card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-slate-600 text-xs font-semibold uppercase tracking-wider">ID</th>
              <th className="p-4 text-slate-600 text-xs font-semibold uppercase tracking-wider">Commande</th>
              <th className="p-4 text-slate-600 text-xs font-semibold uppercase tracking-wider">Montant</th>
              <th className="p-4 text-slate-600 text-xs font-semibold uppercase tracking-wider">Statut</th>
              <th className="p-4 text-slate-600 text-xs font-semibold uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
             {paiements.map(p => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="p-4 text-slate-700 font-semibold">#{p.id}</td>
                <td className="p-4 text-slate-900 font-semibold">#{p.commande_id}</td>
                <td className="p-4 font-bold text-slate-900">{p.montant} €</td>
                <td className="p-4"><Badge variant={p.statut === 'Validé' ? 'success' : 'warning'}>{p.statut}</Badge></td>
                <td className="p-4 text-right">
                  <select 
                    className="bg-white border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2f7a78] focus:ring-1 focus:ring-[#2f7a78]/25"
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
