import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/ui/Badge';
import { Package, Calendar, ChevronRight, ShoppingBag, ArrowRight } from 'lucide-react';

export default function Orders() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/commandes').then(res => {
      setCommandes(Array.isArray(res.data) ? res.data : []);
    }).finally(() => setLoading(false));
  }, []);

  const getStatusVariant = (statut) => {
    switch (statut) {
      case 'En attente': return 'warning';
      case 'Payée': return 'info';
      case 'Confirmée': return 'primary';
      case 'Livrée': return 'success';
      case 'Annulée': return 'danger';
      default: return 'primary';
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );

  return (
    <div className="bg-white min-h-[70vh] pb-20 font-sans">
      <div className="adi-container">
        
        {/* Header */}
        <div className="pt-10 pb-8 border-b-2 border-black flex items-end gap-3">
          <h1 className="text-4xl md:text-5xl font-black italic text-black tracking-tighter uppercase leading-none">MES COMMANDES</h1>
          <span className="text-lg font-bold text-adi-gray mb-1">[{commandes.length}]</span>
        </div>

        {commandes.length === 0 ? (
          <div className="text-center py-24 bg-adi-silver border-2 border-black border-t-0">
            <div className="w-20 h-20 bg-white flex items-center justify-center mx-auto mb-8 border-2 border-black">
              <ShoppingBag size={32} />
            </div>
            <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4">AUCUNE COMMANDE</h3>
            <p className="text-adi-gray mb-10 max-w-sm mx-auto font-bold uppercase tracking-tight">VOTRE HISTORIQUE DE COMMANDES EST ACTUELLEMENT VIDE.</p>
            <Link to="/produits" className="adi-btn adi-btn-black px-12 py-4">VOIR LE CATALOGUE</Link>
          </div>
        ) : (
          <div className="mt-10 space-y-4">
            {commandes.map((cmd) => (
              <Link key={cmd.id} to={`/mes-commandes/${cmd.id}`} className="block group">
                <div className="bg-white p-6 border-2 border-adi-silver hover:border-black transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-adi-silver flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                      <Package size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black italic uppercase tracking-tighter">COMMANDE #{cmd.id.toString().padStart(5, '0')}</h3>
                      <div className="flex items-center gap-2 text-xs font-bold text-adi-gray uppercase italic tracking-widest mt-1">
                        <Calendar size={12} />
                        {new Date(cmd.date).toLocaleDateString('fr-FR', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-12 flex-grow md:flex-grow-0 border-t md:border-t-0 pt-4 md:pt-0">
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase text-adi-gray mb-1 italic">Total</p>
                      <p className="text-2xl font-black italic">{parseFloat(cmd.total).toFixed(2)} €</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <Badge variant={getStatusVariant(cmd.statut)} className="px-4 py-1.5 text-[10px] font-black italic uppercase border-2">{cmd.statut}</Badge>
                      <ArrowRight size={24} className="text-adi-gray group-hover:text-black group-hover:translate-x-2 transition-all hidden sm:block" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
