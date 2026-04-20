import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Truck, MapPin, Package, Clock, CheckCircle, Navigation } from 'lucide-react';

export default function AdminDeliveries() {
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => { fetchDeliveries(); }, []);
  const fetchDeliveries = () => api.get('/admin/livraisons').then(res => setDeliveries(res.data));

  const changeStatus = async (id, statut) => {
    const loadingToast = toast.loading('Mise à jour de la livraison...');
    try {
      await api.put(`/admin/livraisons/${id}/statut`, { statut });
      toast.success('Livraison actualisée', { id: loadingToast });
      fetchDeliveries();
    } catch (e) { toast.error('Erreur', { id: loadingToast }); }
  };

  const getStatusBadge = (statut) => {
    if (statut === 'Livrée') return <span className="badge-accepted">Livrée</span>;
    if (statut === 'En cours') return <span className="badge-new bg-indigo-50 text-indigo-600 border-indigo-100">En cours</span>;
    return <span className="badge-review">{statut}</span>;
  };

  return (
    <div className="dash-table-container bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
      <div className="p-8 border-b border-slate-100 bg-white">
        <div className="section-header">
          <div className="section-title-group">
            <h1 className="section-title">
              <div className="bullet"><Truck size={20} /></div>
              Suivi des Livraisons
            </h1>
            <p className="section-description">Gérez les expéditions et confirmez la réception des colis.</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="dash-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Commande</th>
              <th>Destination</th>
              <th>Mise à jour</th>
              <th>Statut</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map(d => (
              <tr key={d.id} className="hover:bg-slate-50 transition-colors group">
                <td className="font-mono text-[10px] text-slate-400">#{d.id}</td>
                <td>
                  <div className="flex items-center gap-2 font-bold text-slate-700">
                    <Package size={14} className="text-slate-400" /> #{d.commande_id}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2 max-w-[250px]">
                    <MapPin size={14} className="text-[#2c767c] shrink-0" />
                    <span className="text-xs text-slate-600 truncate font-medium">{d.adresse}</span>
                  </div>
                </td>
                <td className="text-slate-400 text-[11px] font-bold">
                  {new Date(d.updated_at).toLocaleDateString()}
                </td>
                <td>{getStatusBadge(d.statut)}</td>
                <td className="text-right">
                  <div className="flex justify-end gap-2">
                    <select 
                      className="dash-input !py-1.5 !px-3 font-bold !text-[11px] uppercase tracking-wider w-auto"
                      value={d.statut}
                      onChange={(e) => changeStatus(d.id, e.target.value)}
                    >
                      <option value="En préparation">En préparation</option>
                      <option value="Expédiée">Expédiée</option>
                      <option value="En cours">En cours</option>
                      <option value="Livrée">Livrée</option>
                      <option value="Retournée">Retournée</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
