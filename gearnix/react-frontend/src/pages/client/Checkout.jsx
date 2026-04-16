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
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-[70vh]">
      <h1 className="text-3xl font-black mb-8 uppercase">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Email & Shipping */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-primary"/> Adresse de livraison
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Adresse complète</label>
                <textarea
                  required
                  rows={3}
                  className="w-full bg-dark border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary resize-none"
                  placeholder="123 rue de la victoire, 75001 Paris"
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CreditCard size={20} className="text-accent"/> Mode de paiement
            </h2>
            <div className="space-y-3">
              {['Carte bancaire', 'PayPal', 'Virement bancaire'].map((m) => (
                <label key={m} className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${methode === m ? 'border-accent bg-accent/10' : 'border-white/10 bg-dark hover:border-white/30'}`}>
                  <input
                    type="radio"
                    name="methode"
                    value={m}
                    checked={methode === m}
                    onChange={(e) => setMethode(e.target.value)}
                    className="accent-accent w-4 h-4"
                  />
                  <span className="font-medium">{m}</span>
                </label>
              ))}
            </div>
            
            {methode === 'Carte bancaire' && (
              <div className="mt-4 bg-dark/50 p-4 rounded-lg border border-white/5 text-sm text-gray-400 italic">
                Ceci est une simulation. Aucun paiement réel ne sera effectué.
              </div>
            )}
          </div>
          
          <Button type="submit" disabled={loading || !adresse} className="w-full py-4 text-lg">
             {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" /> Traitement...</span> : `Payer ${total.toFixed(2)} €`}
          </Button>
        </form>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 sticky top-24 bg-darker/80">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
              <ShoppingBag size={20}/> Récapitulatif
            </h2>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {cart.map((item) => (
                 <div key={item.id} className="flex gap-4">
                   <div className="w-16 h-16 rounded overflow-hidden bg-white/5 flex-shrink-0">
                     {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : null}
                   </div>
                   <div className="flex-grow">
                     <p className="text-sm font-bold text-white line-clamp-1">{item.nom}</p>
                     <p className="text-xs text-gray-400">Qté: {item.quantite}</p>
                     <p className="text-sm font-semibold text-primary mt-1">{(item.prix * item.quantite).toFixed(2)} €</p>
                   </div>
                 </div>
              ))}
            </div>
            
            <div className="border-t border-white/10 mt-6 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>Sous-total</span>
                <span>{total.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Livraison</span>
                <span>0.00 €</span>
              </div>
              <div className="flex justify-between items-center pt-4 mt-2 border-t border-white/5 text-lg font-bold">
                <span>Total à régler</span>
                <span className="text-accent">{total.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
