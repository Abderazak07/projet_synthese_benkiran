import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { ShoppingCart, Eye, X, Package, User, MapPin, CreditCard, Truck } from 'lucide-react';

export default function AdminOrders() {
  const [commandes, setCommandes] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <>
      <div className="dash-table-container bg-white/[0.03] rounded-2xl border border-white/[0.07] shadow-xl overflow-hidden">
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
                <th>Numéro</th>
                <th>Client</th>
                <th>Montant Total</th>
                <th>Statut</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {commandes.map(c => (
                <tr key={c.id} className="hover:bg-white/[0.04] transition-colors group">
                  <td className="font-mono text-xs text-pearl/40 font-black tracking-widest leading-none">
                     #{c.id.toString().padStart(5, '0')}
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                       <div className="h-8 w-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-pearl/40">
                          <User size={14} />
                       </div>
                       <p className="font-bold text-white">{c.client?.nom}</p>
                    </div>
                  </td>
                  <td>
                    <p className="font-black text-white">{parseFloat(c.total).toFixed(2)} €</p>
                  </td>
                  <td>{getStatusBadge(c.statut)}</td>
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
                        <option value="Payée">Payée</option>
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

      {/* Détails Commande (Utilise dash-side-form-container pour la cohérence) */}
      {isModalOpen && selectedOrder && (
        <div className="dash-side-form-container !w-[450px]">
          <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between sticky top-0 bg-white/[0.03] z-10">
            <h2 className="text-lg font-black text-white tracking-tight">Détails de la Commande</h2>
            <button onClick={() => setIsModalOpen(false)} className="p-2 text-pearl/40 hover:text-red-500 transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <div className="p-8 space-y-8 overflow-y-auto h-[calc(100vh-140px)] custom-scrollbar">
             <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-pearl/40 uppercase tracking-widest mb-1">REFERENCE</p>
                  <p className="font-mono text-xl text-white font-black">#{selectedOrder.id}</p>
                </div>
                {getStatusBadge(selectedOrder.statut)}
             </div>

             <div className="grid grid-cols-2 gap-6 bg-white/[0.04] rounded-2xl p-5 border border-white/5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] font-black text-[#0ea5e9] uppercase tracking-widest">
                    <User size={12}/> Client
                  </div>
                  <p className="text-sm font-bold text-white/80">{selectedOrder.client?.nom}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] font-black text-[#0ea5e9] uppercase tracking-widest">
                    <CreditCard size={12}/> Total
                  </div>
                  <p className="text-sm font-bold text-white/80">{parseFloat(selectedOrder.total).toFixed(2)} €</p>
                </div>
             </div>

             <div className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-black text-pearl/40 uppercase tracking-widest">
                  <MapPin size={12}/> Adresse de livraison
                </div>
                <div className="bg-white/[0.03] border border-white/10 p-4 rounded-xl text-sm font-medium text-pearl/60 shadow-sm leading-relaxed">
                   {selectedOrder.livraison?.adresse || 'Aucune adresse spécifiée'}
                </div>
             </div>

             <div className="space-y-4">
               <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-pearl/40 uppercase tracking-widest">Articles commandés</p>
                  <div className="h-px flex-1 bg-white/[0.05] mx-4" />
                  <Package size={14} className="text-slate-300"/>
               </div>
               <div className="space-y-2">
                 {selectedOrder.produits?.map(p => (
                   <div key={p.id} className="flex items-center gap-4 p-3 border border-white/5 rounded-xl bg-white/[0.03] shadow-sm hover:border-[#0ea5e9]/20 transition-colors">
                      <div className="h-10 w-10 rounded-lg bg-white/[0.04] flex items-center justify-center overflow-hidden border border-white/5 shrink-0">
                         {p.image ? <img src={p.image} className="h-full w-full object-cover" /> : <Package size={16} className="text-slate-300" />}
                      </div>
                      <div className="flex-1 min-w-0">
                         <p className="font-bold text-white text-xs truncate">{p.nom}</p>
                         <p className="text-[10px] text-pearl/40 font-mono tracking-tighter">{p.pivot?.prix_unitaire} € × {p.pivot?.quantite}</p>
                      </div>
                   </div>
                 ))}
               </div>
             </div>
          </div>
          
          <div className="p-6 border-t border-white/5 bg-white/[0.03]">
             <button onClick={() => setIsModalOpen(false)} className="dash-btn w-full">Fermer les détails</button>
          </div>
        </div>
      )}
    </>
  );
}
