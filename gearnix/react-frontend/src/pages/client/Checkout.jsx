import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import api, { API_URL } from '../../services/api';
import toast from 'react-hot-toast';
import { MapPin, CreditCard, ShieldCheck, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';

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
      const commandeRes = await api.post('/commandes', {
        produits: cart.map(item => ({ id: item.id, quantite: item.quantite })),
        adresse_livraison: adresse
      });
      const commandeId = commandeRes.data.id;

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
    <div className="bg-white min-h-[70vh] pb-20 font-sans">
      <div className="adi-container">

        {/* Header */}
        <div className="pt-10 pb-8 border-b-2 border-black flex items-end justify-between">
          <div>
            <nav className="flex items-center gap-2 text-[10px] font-black uppercase text-adi-gray italic mb-2 tracking-widest">
              <Link to="/panier" className="hover:text-black">Panier</Link>
              <span>/</span>
              <span className="text-black">Checkout</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-black italic text-black tracking-tighter uppercase leading-none">PAIEMENT</h1>
          </div>
          <Link to="/panier" className="text-xs font-black uppercase underline flex items-center gap-2">
            <ArrowLeft size={14} /> RETOUR AU PANIER
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-10">
          <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-8">

            {/* Shipping */}
            <div className="border-2 border-black p-8">
              <h2 className="text-xl font-black italic uppercase tracking-tighter mb-6 flex items-center gap-3">
                <MapPin size={20} /> ADRESSE DE LIVRAISON
              </h2>
              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-widest text-adi-gray">COORDONNÉES COMPLÈTES</label>
                <textarea
                  required
                  rows={3}
                  className="w-full bg-adi-silver border-2 border-adi-silver focus:border-black p-4 text-black font-bold text-sm outline-none transition-all resize-none font-bold"
                  placeholder="NOM PRÉNOM, ADRESSE, VILLE, CODE POSTAL"
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                />
              </div>
            </div>

            {/* Payment */}
            <div className="border-2 border-black p-8">
              <h2 className="text-xl font-black italic uppercase tracking-tighter mb-6 flex items-center gap-3">
                <CreditCard size={20} /> MODE DE PAIEMENT
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {['Carte bancaire', 'PayPal', 'Virement'].map((m) => (
                  <label key={m} className={`flex flex-col items-center justify-center gap-3 p-6 border-2 cursor-pointer transition-all ${
                    methode === m
                      ? 'border-black bg-black text-white'
                      : 'border-adi-silver bg-white text-adi-gray hover:border-black hover:text-black'
                  }`}>
                    <input
                      type="radio"
                      name="methode"
                      value={m}
                      checked={methode === m}
                      onChange={(e) => setMethode(e.target.value)}
                      className="hidden"
                    />
                    <span className="font-black italic uppercase text-xs tracking-widest">{m}</span>
                  </label>
                ))}
              </div>

              {methode === 'Carte bancaire' && (
                <div className="mt-8 bg-adi-silver p-6 border-l-4 border-black">
                   <div className="flex items-center gap-3 mb-2">
                      <ShieldCheck size={18} className="text-black" />
                      <span className="text-xs font-black uppercase italic">Paiement ultra-sécurisé</span>
                   </div>
                   <p className="text-[10px] font-bold text-adi-gray uppercase leading-tight">Simulation de paiement activée. Aucune transaction réelle ne sera effectuée sur votre compte.</p>
                </div>
              )}
            </div>

            <button
               type="submit"
               disabled={loading || !adresse}
               className="w-full adi-btn adi-btn-black py-5 text-xl flex items-center justify-center gap-4 group disabled:opacity-30"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>VALIDER ET PAYER {total.toFixed(2)} € <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" /></>
              )}
            </button>
          </form>

          {/* Recapitulation */}
          <div className="lg:col-span-4">
             <div className="sticky top-24 border-2 border-black p-8">
                <h2 className="text-xl font-black italic uppercase tracking-tighter mb-8 border-b-2 border-adi-silver pb-4">VOTRE COMMANDE</h2>

                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar border-b-2 border-adi-silver pb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="w-16 h-16 bg-adi-silver flex-shrink-0 border border-adi-silver group-hover:border-black transition-all">
                        <img src={item.image?.startsWith('http') ? item.image : `${API_URL}${item.image}`} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-[10px] font-black italic text-black uppercase truncate">{item.nom}</p>
                        <p className="text-[10px] font-bold text-adi-gray">QTÉ: {item.quantite} | {item.prix} €/u</p>
                        <p className="text-[11px] font-black italic mt-1">{(item.prix * item.quantite).toFixed(2)} €</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-3">
                   <div className="flex justify-between text-xs font-bold uppercase text-adi-gray">
                      <span>SOUS-TOTAL</span>
                      <span className="font-black italic text-black">{total.toFixed(2)} €</span>
                   </div>
                   <div className="flex justify-between text-xs font-bold uppercase text-adi-gray">
                      <span>LIVRAISON</span>
                      <span className="font-black italic text-emerald-600">GRATUITE</span>
                   </div>
                   <div className="border-t-2 border-black pt-4 mt-4 flex justify-between items-end">
                      <span className="text-lg font-black italic uppercase">TOTAL</span>
                      <span className="text-2xl font-black italic">{total.toFixed(2)} €</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
