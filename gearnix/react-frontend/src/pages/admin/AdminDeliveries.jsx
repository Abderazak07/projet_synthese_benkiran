import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Truck, MapPin, Package, Trash2 } from 'lucide-react';

export default function AdminDeliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

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
    if (statut === 'En cours') return <span className="badge-new bg-indigo-500/10 text-indigo-400 border-indigo-500/20">En cours</span>;
    return <span className="badge-new">{statut}</span>;
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === deliveries.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(deliveries.map(d => d.id));
    }
  };

  const toggleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Voulez-vous supprimer les ${selectedIds.length} livraison(s) sélectionnée(s) ?`)) return;
    const loadingToast = toast.loading('Suppression en cours...');
    try {
      await Promise.all(selectedIds.map(id => api.delete(`/admin/livraisons/${id}`)));
      toast.success('Sélection supprimée', { id: loadingToast });
      setSelectedIds([]);
      fetchDeliveries();
    } catch (e) {
      toast.error('Erreur lors de la suppression', { id: loadingToast });
    }
  };

  return (
    <>
      <div className="dash-table-container bg-white/[0.03] rounded-2xl border border-white/[0.07] shadow-xl overflow-hidden mb-12">
        <div className="p-8 border-b border-white/5 bg-white/[0.03]">
          <div className="section-header">
            <div className="section-title-group">
              <h1 className="section-title">
                <div className="bullet"><Truck size={20} /></div>
                Suivi des Livraisons
              </h1>
              <p className="section-description">Gerez les expéditions et confirmez la réception des colis.</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="dash-table">
            <thead>
              <tr>
                <th className="w-12 text-center">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300 text-[#0ea5e9] focus:ring-[#0ea5e9] cursor-pointer"
                    checked={deliveries.length > 0 && selectedIds.length === deliveries.length}
                    onChange={toggleSelectAll}
                  />
                </th>
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
                <tr key={d.id} className="hover:bg-white/[0.04] transition-colors group">
                  <td className="text-center">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-gray-300 text-[#0ea5e9] focus:ring-[#0ea5e9] cursor-pointer"
                      checked={selectedIds.includes(d.id)}
                      onChange={() => toggleSelectOne(d.id)}
                    />
                  </td>
                  <td className="font-mono text-[10px] text-gray-400">#{d.id}</td>
                  <td>
                    <div className="flex items-center gap-2 font-bold text-gray-800">
                      <Package size={14} className="text-gray-400" /> #{d.commande_id}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 max-w-[250px]">
                      <MapPin size={14} className="text-[#0ea5e9] shrink-0" />
                      <span className="text-xs text-gray-600 truncate font-medium">{d.adresse}</span>
                    </div>
                  </td>
                  <td className="text-gray-400 text-[11px] font-bold">
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

      {/* Floating Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white border-2 border-black shadow-2xl rounded-2xl px-8 py-4 flex items-center gap-8 z-50 animate-in slide-in-from-bottom duration-300">
          <p className="text-xs font-black uppercase text-black tracking-wider flex items-center gap-2">
            <Truck size={16} /> {selectedIds.length} sélectionné(s)
          </p>
          <button 
            onClick={handleBulkDelete}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg hover:shadow-red-600/20"
          >
            <Trash2 size={14} /> Supprimer la sélection
          </button>
        </div>
      )}
    </>
  );
}
