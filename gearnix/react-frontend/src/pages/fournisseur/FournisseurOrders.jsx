import { useState, useEffect } from 'react';
import api, { API_URL } from '../../services/api';
import { Package, Eye, X, ShoppingCart, User, List } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FournisseurOrders() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/fournisseur/commandes');
      setCommandes(res.data);
    } catch (err) {
      toast.error("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const openDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
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
      <div className="dash-table-container shadow-2xl rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden">
        <div className="p-8 border-b border-white/5 bg-white/[0.03]">
          <div className="section-header">
            <div className="section-title-group">
              <h1 className="section-title">
                <div className="bullet"><ShoppingCart size={20} /></div>
                Ventes & Commandes
              </h1>
              <p className="section-description">Liste des commandes contenant vos produits.</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Référence</th>
                <th>Articles commandés</th>
                <th>Statut global</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                 [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="4" className="p-8"><div className="h-4 bg-white/[0.04] rounded w-full"></div></td>
                  </tr>
                ))
              ) : commandes.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-16 text-pearl/40 italic font-medium">
                    Aucune vente enregistrée pour le moment.
                  </td>
                </tr>
              ) : (
                commandes.map(cmd => (
                  <tr key={cmd.id} className="hover:bg-white/[0.04] transition-colors group">
                    <td className="p-4">
                      <p className="font-mono text-[10px] text-[#0ea5e9] font-black tracking-widest leading-none mb-1">#{cmd.id}</p>
                      <p className="text-white font-black">{parseFloat(cmd.total).toFixed(2)} €</p>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        {cmd.produits.map(p => (
                          <div key={p.id} className="text-xs text-pearl/60 flex items-center gap-2">
                             <div className="w-1 h-1 bg-[#0ea5e9]/30 rounded-full" />
                             {p.nom} <span className="text-pearl/40 font-bold ml-auto px-2">×{p.pivot.quantite}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(cmd.statut)}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => openDetails(cmd)}
                        className="p-2.5 text-[#0ea5e9] hover:text-white hover:bg-[#0ea5e9] rounded-xl shadow-sm border border-white/5 bg-white/[0.04] transition-all flex items-center gap-2 ml-auto"
                      >
                        <Eye size={18} />
                        <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">Voir</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Détails Commande Fournisseur - Side Panel Design Identique */}
      {isModalOpen && selectedOrder && (
        <div className="dash-side-form-container !w-[400px]">
          <div className="p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center sticky top-0 bg-white/[0.03] z-10">
            <h2 className="text-lg font-black text-white tracking-tight">Récapitulatif Articles</h2>
            <button onClick={() => setIsModalOpen(false)} className="p-2 text-pearl/40 hover:text-red-500 transition-colors">
               <X size={20} />
            </button>
          </div>
          
          <div className="p-6 space-y-6 overflow-y-auto h-[calc(100vh-140px)] custom-scrollbar">
             <div className="bg-[#0ea5e9]/5 border border-[#0ea5e9]/10 rounded-2xl p-4 flex items-center justify-between">
                <div>
                   <p className="text-[10px] font-black text-[#0ea5e9] uppercase tracking-[0.2em] mb-1">Total vente</p>
                   <p className="text-xl font-black text-white">{parseFloat(selectedOrder.total).toFixed(2)} €</p>
                </div>
                {getStatusBadge(selectedOrder.statut)}
             </div>

             <div className="space-y-3">
               <div className="flex items-center gap-2 text-[10px] font-black text-pearl/40 uppercase tracking-widest">
                  <List size={12}/> Détail de vos produits
               </div>
               {selectedOrder.produits.map(p => (
                 <div key={p.id} className="flex items-center gap-4 p-4 border border-white/5 rounded-2xl bg-white/[0.03] shadow-sm hover:border-[#0ea5e9]/20 transition-all group/item">
                    <div className="w-14 h-14 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-center text-slate-300 overflow-hidden shadow-inner group-hover/item:border-[#0ea5e9]/30">
                       {p.image ? (
                        <img src={p.image.startsWith('http') ? p.image : `${API_URL}${p.image}`} className="w-full h-full object-cover" />
                       ) : (
                        <Package size={20} />
                       )}
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="font-bold text-white text-sm truncate">{p.nom}</p>
                       <p className="text-[10px] text-pearl/40 font-mono font-bold">{p.prix_unitaire || p.prix} € / unité</p>
                    </div>
                    <div className="text-right px-2 py-1 bg-white/[0.04] rounded-lg border border-white/5 font-black text-[#0ea5e9]">
                       x{p.pivot.quantite}
                    </div>
                 </div>
               ))}
             </div>

             <div className="p-5 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                <p className="text-xs text-gray-400 italic leading-relaxed">
                   Cette commande est traitée par l'administration globale. Vous serez notifié de la validation finale du paiement.
                </p>
             </div>
          </div>

          <div className="p-6 border-t border-white/5 bg-white/[0.03]">
             <button onClick={() => setIsModalOpen(false)} className="dash-btn w-full">Fermer</button>
          </div>
        </div>
      )}
    </>
  );
}
