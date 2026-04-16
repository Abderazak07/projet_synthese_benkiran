import { useState, useEffect } from 'react';
import api from '../../services/api';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [commandes, setCommandes] = useState([]);

  useEffect(() => { fetchCommandes(); }, []);
  const fetchCommandes = () => api.get('/admin/commandes').then(res => setCommandes(res.data));

  const changeStatus = async (id, statut) => {
    try {
      await api.put(`/admin/commandes/${id}/statut`, { statut });
      toast.success('Statut mis à jour');
      fetchCommandes();
    } catch (e) { toast.error('Erreur'); }
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="dash-title">Commandes</h1>
        <p className="dash-muted text-sm">Consultez et mettez à jour le statut des commandes.</p>
      </div>

      <div className="dash-card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-slate-600 text-xs font-semibold uppercase tracking-wider">ID</th>
              <th className="p-4 text-slate-600 text-xs font-semibold uppercase tracking-wider">Client</th>
              <th className="p-4 text-slate-600 text-xs font-semibold uppercase tracking-wider">Total</th>
              <th className="p-4 text-slate-600 text-xs font-semibold uppercase tracking-wider">Statut</th>
              <th className="p-4 text-slate-600 text-xs font-semibold uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
             {commandes.map(c => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="p-4 text-slate-700 font-semibold">#{c.id}</td>
                <td className="p-4 text-slate-900 font-semibold">{c.client?.nom}</td>
                <td className="p-4 font-bold text-slate-900">{c.total} €</td>
                <td className="p-4"><Badge variant={c.statut==='Livrée' ? 'success' : 'primary'}>{c.statut}</Badge></td>
                <td className="p-4 text-right">
                  <select 
                    className="bg-white border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2f7a78] focus:ring-1 focus:ring-[#2f7a78]/25"
                    value={c.statut}
                    onChange={(e) => changeStatus(c.id, e.target.value)}
                  >
                    <option value="En attente">En attente</option>
                    <option value="Payée">Payée</option>
                    <option value="Confirmée">Confirmée</option>
                    <option value="Livrée">Livrée</option>
                    <option value="Annulée">Annulée</option>
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
