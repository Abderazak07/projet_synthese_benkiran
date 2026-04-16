import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/ui/Badge';
import { Package, ArrowLeft, MapPin, CreditCard, Box } from 'lucide-react';

export default function OrderDetail() {
  const { id } = useParams();
  const [commande, setCommande] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/commandes/${id}`).then(res => {
      setCommande(res.data);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="pt-20"><LoadingSpinner /></div>;
  if (!commande) return <div className="text-center pt-20">Commande introuvable</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link to="/mes-commandes" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-8">
        <ArrowLeft size={16} /> Retour aux commandes
      </Link>
      
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black mb-2 uppercase">Commande #{commande.id.toString().padStart(5, '0')}</h1>
          <p className="text-gray-400 text-sm">Passée le {new Date(commande.date).toLocaleString('fr-FR')}</p>
        </div>
        <Badge variant={commande.statut === 'Livrée' ? 'success' : 'primary'}>{commande.statut}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Info Column */}
        <div className="col-span-1 space-y-6">
          <div className="glass-card p-6">
            <h3 className="font-bold flex items-center gap-2 mb-4 text-white"><MapPin size={18} className="text-primary"/> Livraison</h3>
            {commande.livraison ? (
              <>
                <Badge variant={commande.livraison.statut === 'En préparation' ? 'warning' : 'primary'} className="mb-3 w-auto inline-block">
                  {commande.livraison.statut}
                </Badge>
                <p className="text-gray-300 text-sm leading-relaxed bg-darker p-3 rounded">{commande.livraison.adresse}</p>
              </>
            ) : (
              <p className="text-gray-500 italic">Information non disponible</p>
            )}
          </div>
          
          <div className="glass-card p-6">
            <h3 className="font-bold flex items-center gap-2 mb-4 text-white"><CreditCard size={18} className="text-accent"/> Paiement</h3>
            {commande.paiement ? (
              <>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400 text-sm">Méthode</span>
                  <span className="text-white text-sm font-medium">{commande.paiement.methode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Status</span>
                  <Badge variant={commande.paiement.statut === 'Validé' ? 'success' : 'warning'}>{commande.paiement.statut}</Badge>
                </div>
              </>
            ) : (
              <p className="text-gray-500 italic">Paiement en attente</p>
            )}
          </div>
        </div>

        {/* Products List */}
        <div className="col-span-1 md:col-span-2">
          <div className="glass-card p-6">
            <h3 className="font-bold flex items-center gap-2 mb-6 text-white pb-4 border-b border-white/10"><Box size={18} className="text-primary"/> Articles ({commande.produits.length})</h3>
            
            <div className="space-y-4">
              {commande.produits.map((prod) => (
                <div key={prod.id} className="flex gap-4 items-center bg-darker/50 p-3 rounded-lg">
                  <div className="w-16 h-16 bg-white/5 rounded overflow-hidden flex-shrink-0">
                    {prod.image && <img src={prod.image} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-bold text-white">{prod.nom}</p>
                    <p className="text-xs text-gray-500">Prix unitaire: {prod.pivot.prix_unitaire} €</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Qté: {prod.pivot.quantite}</p>
                    <p className="text-sm font-bold text-primary mt-1">{(prod.pivot.prix_unitaire * prod.pivot.quantite).toFixed(2)} €</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/10 flex justify-end">
              <div className="text-right">
                 <p className="text-gray-400 text-sm mb-1">Total payé</p>
                 <p className="text-3xl font-black text-accent neon-text">{commande.total} €</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
