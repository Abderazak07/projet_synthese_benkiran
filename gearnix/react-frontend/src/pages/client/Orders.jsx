import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/ui/Badge';
import { Package, Calendar, ChevronRight } from 'lucide-react';

export default function Orders() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/commandes').then(res => {
      setCommandes(res.data);
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

  if (loading) return <div className="pt-20"><LoadingSpinner /></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 min-h-[70vh]">
      <h1 className="text-3xl font-black mb-8 uppercase flex items-center gap-3">
        <Package className="text-primary"/> Mes commandes
      </h1>

      {commandes.length === 0 ? (
        <div className="text-center py-16 glass-card">
          <p className="text-gray-400 mb-4">Vous n'avez pas encore passé de commande.</p>
          <Link to="/produits" className="text-primary hover:text-accent underline font-medium">Découvrir nos produits</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {commandes.map((cmd) => (
            <Link key={cmd.id} to={`/mes-commandes/${cmd.id}`} className="block transition-transform hover:-translate-y-1">
              <div className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-primary/50">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Package size={24} className="text-gray-400 group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-1">Commande #{cmd.id.toString().padStart(5, '0')}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar size={14} /> 
                      {new Date(cmd.date).toLocaleDateString('fr-FR', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between md:justify-end gap-6 flex-grow md:flex-grow-0 ml-16 md:ml-0">
                  <div className="text-right">
                    <p className="text-sm text-gray-400 mb-1">Total</p>
                    <p className="text-lg font-black text-white">{cmd.total} €</p>
                  </div>
                  <div className="w-32 flex justify-end">
                    <Badge variant={getStatusVariant(cmd.statut)}>{cmd.statut}</Badge>
                  </div>
                  <ChevronRight size={20} className="text-gray-600 group-hover:text-white transition-colors hidden sm:block" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
