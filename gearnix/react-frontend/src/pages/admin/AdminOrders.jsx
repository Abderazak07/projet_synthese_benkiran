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
    <div className="p-8">
      <h1 className="text-2xl font-black mb-6 uppercase text-primary">Commandes</h1>
      <div className="glass-card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="p-4 text-gray-400">ID</th>
              <th className="p-4 text-gray-400">Client</th>
              <th className="p-4 text-gray-400">Total</th>
              <th className="p-4 text-gray-400">Statut</th>
              <th className="p-4 text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
             {commandes.map(c => (
              <tr key={c.id}>
                <td className="p-4">#{c.id}</td>
                <td className="p-4 text-white font-medium">{c.client?.nom}</td>
                <td className="p-4 font-bold text-accent">{c.total} €</td>
                <td className="p-4"><Badge variant={c.statut==='Livrée' ? 'success' : 'primary'}>{c.statut}</Badge></td>
                <td className="p-4 text-right">
                  <select 
                    className="bg-dark border border-white/20 text-white rounded p-1 text-sm outline-none"
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
