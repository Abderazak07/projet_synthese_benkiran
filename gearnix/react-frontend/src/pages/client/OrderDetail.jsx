import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { API_URL } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/ui/Badge';
import { Package, ArrowLeft, MapPin, CreditCard, Box, ChevronRight, Truck, Info } from 'lucide-react';

export default function OrderDetail() {
  const { id } = useParams();
  const [commande, setCommande] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/commandes/${id}`).then(res => {
      setCommande(res.data);
    }).finally(() => setLoading(false));
  }, [id]);

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

  if (!commande) return (
    <div className="min-h-screen bg-white flex items-center justify-center font-sans">
      <div className="text-center">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4">COMMANDE INTROUVABLE</h2>
        <Link to="/mes-commandes" className="adi-btn adi-btn-black">RETOUR AUX COMMANDES</Link>
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-[70vh] pb-20 font-sans">
      <div className="adi-container">
        
        {/* Navigation Breadcrumb */}
        <div className="py-6 border-b border-adi-silver mb-8 flex items-center justify-between">
           <nav className="flex items-center gap-2 text-[10px] font-black uppercase text-adi-gray italic tracking-widest">
              <Link to="/mes-commandes" className="hover:text-black">Mes commandes</Link>
              <span>/</span>
              <span className="text-black">Détail #{commande.id}</span>
           </nav>
           <Link to="/mes-commandes" className="text-xs font-black uppercase underline flex items-center gap-2">
              <ArrowLeft size={14} /> RETOUR
           </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none mb-2">
              DETAILS COMMANDE
            </h1>
            <p className="text-sm font-bold text-adi-gray uppercase italic tracking-widest">
              PASSÉE LE {new Date(commande.date).toLocaleString('fr-FR').toUpperCase()}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-[10px] font-black uppercase italic text-adi-gray tracking-widest">STATUT ACTUEL</span>
            <Badge variant={getStatusVariant(commande.statut)} className="px-6 py-2 text-xs font-black italic uppercase border-2">
              {commande.statut}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Info Columns */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Products List */}
            <div className="border-2 border-black p-8">
              <h3 className="text-xl font-black italic uppercase tracking-tighter mb-8 border-b-2 border-adi-silver pb-4 flex items-center gap-3">
                <Box size={20} /> ARTICLES COMPRIS ({commande.produits.length})
              </h3>
              
              <div className="space-y-6">
                {commande.produits.map((prod) => (
                  <div key={prod.id} className="flex gap-6 group">
                    <div className="w-24 h-24 bg-adi-silver flex-shrink-0 border border-adi-silver group-hover:border-black transition-all overflow-hidden">
                      {prod.image && (
                        <img 
                          src={prod.image.startsWith('http') ? prod.image : `${API_URL}${prod.image}`} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                          alt="" 
                        />
                      )}
                    </div>
                    <div className="flex-grow min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="text-lg font-black italic uppercase tracking-tighter truncate group-hover:bg-black group-hover:text-white inline-block px-1 -ml-1 transition-all">{prod.nom}</h4>
                        <p className="text-[10px] font-bold text-adi-gray uppercase mt-1">QUANTITÉ: {prod.pivot.quantite} | PRIX UNITAIRE: {prod.pivot.prix_unitaire} €</p>
                      </div>
                      <p className="text-lg font-black italic">{(prod.pivot.prix_unitaire * prod.pivot.quantite).toFixed(2)} €</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t-2 border-black flex justify-end">
                <div className="text-right">
                   <p className="text-[10px] font-black uppercase text-adi-gray italic mb-2 tracking-widest">TOTAL RÉGLÉ</p>
                   <p className="text-5xl font-black italic">{parseFloat(commande.total).toFixed(2)} €</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: Details */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Shipping Info */}
            <div className="bg-adi-silver p-8 border-2 border-adi-silver">
              <h3 className="text-sm font-black italic uppercase tracking-widest mb-6 flex items-center gap-2">
                <MapPin size={16} /> ADRESSE DE LIVRAISON
              </h3>
              {commande.livraison ? (
                <div className="space-y-4">
                  <Badge variant={commande.livraison.statut === 'En préparation' ? 'warning' : 'primary'} className="text-[9px] font-black italic uppercase border">
                    {commande.livraison.statut}
                  </Badge>
                  <p className="text-xs font-bold text-black leading-relaxed uppercase tracking-tight">
                    {commande.livraison.adresse}
                  </p>
                  <div className="flex items-center gap-2 text-adi-gray italic mt-4 pt-4 border-t border-white/40">
                     <Truck size={14} />
                     <span className="text-[9px] font-black uppercase">Livraison Standard Gearnix</span>
                  </div>
                </div>
              ) : (
                <p className="text-adi-gray italic text-[10px] font-bold uppercase">CHARGEMENT DES INFOS...</p>
              )}
            </div>

            {/* Payment Info */}
            <div className="bg-white p-8 border-2 border-black">
              <h3 className="text-sm font-black italic uppercase tracking-widest mb-6 flex items-center gap-2">
                <CreditCard size={16} /> PAIEMENT
              </h3>
              {commande.paiement ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-adi-gray uppercase tracking-widest">MÉTHODE</span>
                    <span className="text-xs font-black italic uppercase">{commande.paiement.methode}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-adi-gray uppercase tracking-widest">STATUS</span>
                    <Badge variant={commande.paiement.statut === 'Validé' ? 'success' : 'warning'} className="text-[9px] font-black italic uppercase border">
                      {commande.paiement.statut}
                    </Badge>
                  </div>
                  <div className="pt-4 border-t border-adi-silver mt-4">
                     <p className="text-[10px] font-bold text-adi-gray leading-tight uppercase italic">La facture a été envoyée à votre adresse email associée.</p>
                  </div>
                </div>
              ) : (
                <p className="text-adi-gray italic text-[10px] font-bold uppercase">PAIEMENT PENDING...</p>
              )}
            </div>

            {/* Help Prompt */}
            <div className="p-8 border-2 border-dashed border-adi-silver">
               <h3 className="text-xs font-black uppercase italic mb-3 flex items-center gap-2">
                 <Info size={14} /> BESOIN D'AIDE ?
               </h3>
               <p className="text-[10px] font-bold text-adi-gray uppercase leading-tight mb-4">Contactez notre support pour toute question relative à cette commande.</p>
               <button className="text-[10px] font-black uppercase underline hover:text-black transition-all">SERVICE CLIENT</button>
            </div>
            
          </div>

        </div>
      </div>
    </div>
  );
}
