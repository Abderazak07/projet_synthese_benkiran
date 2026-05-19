import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { ShoppingCart, Eye, X, Package, User, MapPin, CreditCard, Trash2 } from 'lucide-react';

export default function AdminOrders() {
  const [commandes, setCommandes] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => { fetchCommandes(); }, []);
  const fetchCommandes = () => api.get('/admin/commandes').then(res => setCommandes(res.data));

  const viewDetails = async (id) => {
    try {
      const res = await api.get(`/admin/commandes/${id}`);
      setSelectedOrder(res.data);
      setIsModalOpen(true);
    } catch (e) { toast.error('Erreur de chargement des détails'); }
  };

  const changeStatus = async (id, statut) => {
    const loadingToast = toast.loading('Mise à jour du statut...');
    try {
      await api.put(`/admin/commandes/${id}/statut`, { statut });
      toast.success('Statut mis à jour', { id: loadingToast });
      fetchCommandes();
    } catch (e) { toast.error('Erreur', { id: loadingToast }); }
  };

  const getStatusBadge = (statut) => {
    switch (statut) {
      case 'Livrée': return <span className="badge-accepted">Livrée</span>;
      case 'Annulée': return <span className="badge-rejected">Annulée</span>;
      case 'En attente': return <span className="badge-new">En attente</span>;
      default: return <span className="badge-new">{statut}</span>;
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === commandes.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(commandes.map(c => c.id));
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
    if (!window.confirm(`Voulez-vous supprimer les ${selectedIds.length} commande(s) sélectionnée(s) ?`)) return;
    const loadingToast = toast.loading('Suppression en cours...');
    try {
      await Promise.all(selectedIds.map(id => api.delete(`/admin/commandes/${id}`)));
      toast.success('Sélection supprimée', { id: loadingToast });
      setSelectedIds([]);
      fetchCommandes();
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
                <div className="bullet"><ShoppingCart size={20} /></div>
                Gestion des Commandes
              </h1>
              <p className="section-description">Suivi et mise à jour du cycle de vente.</p>
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
                    checked={commandes.length > 0 && selectedIds.length === commandes.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>Numéro</th>
                <th>Client</th>
                <th>Montant Total</th>
                <th>Statut</th>
                <th>Mode de paiement</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {commandes.map(c => (
                <tr key={c.id} className="hover:bg-white/[0.04] transition-colors group">
                  <td className="text-center">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-gray-300 text-[#0ea5e9] focus:ring-[#0ea5e9] cursor-pointer"
                      checked={selectedIds.includes(c.id)}
                      onChange={() => toggleSelectOne(c.id)}
                    />
                  </td>
                  <td className="font-mono text-xs text-pearl/40 font-black tracking-widest leading-none">
                     #{c.id.toString().padStart(5, '0')}
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                       <div className="h-8 w-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-pearl/40">
                          <User size={14} />
                       </div>
                       <p className="font-bold text-gray-900">{c.client?.nom}</p>
                    </div>
                  </td>
                  <td>
                    <p className="font-black text-gray-900">{parseFloat(c.total).toFixed(2)} MAD</p>
                  </td>
                  <td>{getStatusBadge(c.statut)}</td>
                  <td>
                    <span className="font-bold text-gray-800">{c.paiement?.methode || 'Carte bancaire'}</span>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end items-center gap-3">
                      <button onClick={() => viewDetails(c.id)} className="p-2.5 text-[#0ea5e9] hover:text-white hover:bg-[#0ea5e9] rounded-xl shadow-sm border border-white/5 bg-white/[0.04] transition-all">
                         <Eye size={18} />
                      </button>
                      <select 
                        className="dash-input !py-1.5 !px-3 font-bold !text-[11px] uppercase tracking-wider w-auto"
                        value={c.statut}
                        onChange={(e) => changeStatus(c.id, e.target.value)}
                      >
                        <option value="En attente">En attente</option>
                        <option value="Confirmée">Confirmée</option>
                        <option value="En livraison">En livraison</option>
                        <option value="Livrée">Livrée</option>
                        <option value="Annulée">Annulée</option>
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
            <ShoppingCart size={16} /> {selectedIds.length} sélectionné(s)
          </p>
          <button 
            onClick={handleBulkDelete}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg hover:shadow-red-600/20"
          >
            <Trash2 size={14} /> Supprimer la sélection
          </button>
        </div>
      )}

      {/* Détails Commande */}
      {isModalOpen && selectedOrder && (
        <div className="dash-side-form-container !w-[450px]">
          <div className="p-6 border-b border-gray-200 bg-gray-50 flex items-center justify-between sticky top-0 z-10">
            <h2 className="text-lg font-black text-gray-900 tracking-tight">Détails de la Commande</h2>
            <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-500 hover:text-red-500 transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <div className="p-8 space-y-8 overflow-y-auto h-[calc(100vh-140px)] custom-scrollbar">
             <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">REFERENCE</p>
                  <p className="font-mono text-xl text-gray-900 font-black">#{selectedOrder.id}</p>
                </div>
                {getStatusBadge(selectedOrder.statut)}
             </div>

             <div className="grid grid-cols-2 gap-6 bg-gray-50 rounded-2xl p-5 border border-gray-200">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] font-black text-[#0ea5e9] uppercase tracking-widest">
                    <User size={12}/> Client
                  </div>
                  <p className="text-sm font-bold text-gray-800">{selectedOrder.client?.nom}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] font-black text-[#0ea5e9] uppercase tracking-widest">
                    <CreditCard size={12}/> Total
                  </div>
                  <p className="text-sm font-bold text-gray-800">{parseFloat(selectedOrder.total).toFixed(2)} MAD</p>
                </div>
             </div>

             <div className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  <MapPin size={12}/> Adresse de livraison
                </div>
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-sm font-medium text-gray-700 shadow-sm leading-relaxed">
                   {selectedOrder.livraison?.adresse || 'Aucune adresse spécifiée'}
                </div>
             </div>

             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Articles commandés</p>
                   <div className="h-px flex-1 bg-gray-200 mx-4" />
                   <Package size={14} className="text-gray-600"/>
                </div>
                <div className="space-y-2">
                  {selectedOrder.produits?.map(p => (
                    <div key={p.id} className="flex items-center gap-4 p-3 border border-gray-200 rounded-xl bg-gray-50 shadow-sm hover:border-[#0ea5e9]/20 transition-colors">
                       <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 shrink-0">
                          {p.image ? <img src={p.image} className="h-full w-full object-cover" /> : <Package size={16} className="text-gray-600" />}
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 text-xs truncate">{p.nom}</p>
                          <p className="text-[10px] text-gray-500 font-mono tracking-tighter">{p.pivot?.prix_unitaire} MAD × {p.pivot?.quantite}</p>
                       </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
          
          <div className="p-6 border-t border-gray-200 bg-gray-50">
             <button onClick={() => setIsModalOpen(false)} className="dash-btn w-full !bg-black !text-white hover:!bg-gray-800 transition-colors">Fermer les détails</button>
          </div>
        </div>
      )}
    </>
  );
}
