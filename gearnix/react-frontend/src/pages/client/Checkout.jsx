import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { MapPin, CreditCard, ShoppingBag, Loader2 } from 'lucide-react';

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [adresse, setAdresse] = useState('');
  const [methode, setMethode] = useState('Carte bancaire');
  const [loading, setLoading] = useState(false);

  if (cart.length === 0) {
    navigate('/panier');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Créer la commande
      const commandeRes = await api.post('/commandes', {
        produits: cart.map(item => ({ id: item.id, quantite: item.quantite })),
        adresse_livraison: adresse
      });
      
      const commandeId = commandeRes.data.id;

      // 2. Créer le paiement
      await api.post('/paiements', {
        commande_id: commandeId,
        montant: total,
        methode: methode
      });

      clearCart();
      toast.success('Commande validée avec succès !');
      navigate(`/mes-commandes/${commandeId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la validation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lux-container py-8 min-h-[70vh]">
      <div className="relative overflow-hidden rounded-xl2 border border-white/10 bg-white/[0.03] shadow-soft mb-10">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1600&q=80')] bg-cover bg-center opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/60 to-transparent" />
        <div className="relative z-10 p-8 md:p-10">
          <p className="text-xs font-semibold tracking-[0.28em] uppercase text-gray-300">Checkout</p>
          <h1 className="text-3xl md:text-5xl font-black mt-3 text-pearl">Finaliser la commande</h1>
          <p className="text-gray-400 mt-4 max-w-2xl">Adresse de livraison, méthode de paiement et récapitulatif.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Email & Shipping */}
          <div className="lux-card p-7">
            <h2 className="text-xs font-black tracking-[0.26em] uppercase mb-5 flex items-center gap-2 text-pearl">
              <MapPin size={16} className="text-gold"/> Adresse de livraison
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold tracking-[0.22em] uppercase text-gray-400 mb-2">Adresse complète</label>
                <textarea
                  required
                  rows={3}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-pearl focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/30 resize-none"
                  placeholder="123 rue de la victoire, 75001 Paris"
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="lux-card p-7">
            <h2 className="text-xs font-black tracking-[0.26em] uppercase mb-5 flex items-center gap-2 text-pearl">
              <CreditCard size={16} className="text-gold"/> Mode de paiement
            </h2>
            <div className="space-y-3">
              {['Carte bancaire', 'PayPal', 'Virement bancaire'].map((m) => (
                <label key={m} className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${methode === m ? 'border-gold/30 bg-gold/10' : 'border-white/10 bg-white/[0.02] hover:border-gold/20 hover:bg-white/[0.04]'}`}>
                  <input
                    type="radio"
                    name="methode"
                    value={m}
                    checked={methode === m}
                    onChange={(e) => setMethode(e.target.value)}
                    className="accent-[color:rgb(214,178,110)] w-4 h-4"
                  />
                  <span className="font-semibold text-pearl">{m}</span>
                </label>
              ))}
            </div>
            
            {methode === 'Carte bancaire' && (
              <div className="mt-4 bg-white/[0.02] p-4 rounded-xl border border-white/10 text-sm text-gray-400 italic">
                Ceci est une simulation. Aucun paiement réel ne sera effectué.
              </div>
            )}
          </div>
          
          <Button type="submit" disabled={loading || !adresse} className="w-full" size="lg">
             {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" /> Traitement...</span> : `Payer ${total.toFixed(2)} €`}
          </Button>
        </form>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="lux-card p-7 sticky top-24">
            <h2 className="text-xs font-black tracking-[0.26em] uppercase mb-6 flex items-center gap-2 border-b border-white/10 pb-4 text-pearl">
              <ShoppingBag size={16}/> Récapitulatif
            </h2>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {cart.map((item) => (
                 <div key={item.id} className="flex gap-4">
                   <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/[0.03] flex-shrink-0 border border-white/10">
                     {item.image ? <img src={item.image} className="w-full h-full object-cover opacity-90" /> : null}
                   </div>
                   <div className="flex-grow">
                     <p className="text-sm font-black text-pearl line-clamp-1">{item.nom}</p>
                     <p className="text-xs text-gray-400">Qté: {item.quantite}</p>
                     <p className="text-sm font-semibold text-gold mt-1">{(item.prix * item.quantite).toFixed(2)} €</p>
                   </div>
                 </div>
              ))}
            </div>
            
            <div className="border-t border-white/10 mt-6 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>Sous-total</span>
                <span className="text-pearl font-semibold">{total.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Livraison</span>
                <span>0.00 €</span>
              </div>
              <div className="flex justify-between items-center pt-4 mt-2 border-t border-white/5 text-lg font-bold">
                <span>Total à régler</span>
                <span className="text-pearl neon-text">{total.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
