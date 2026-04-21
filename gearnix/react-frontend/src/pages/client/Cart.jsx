import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { X, ShoppingCart, ArrowRight, Minus, Plus, Truck, RotateCcw } from 'lucide-react';
import { API_URL } from '../../services/api';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, total, count } = useCart();

  if (cart.length === 0) {
    return (
      <div className="bg-white min-h-[70vh] flex flex-col items-center justify-center px-4 font-sans">
        <div className="w-24 h-24 bg-adi-silver flex items-center justify-center mb-8 border-2 border-black">
          <ShoppingCart size={40} className="text-black" />
        </div>
        <h2 className="text-4xl font-black italic text-black mb-4 uppercase tracking-tighter">VOTRE PANIER EST VIDE</h2>
        <p className="text-adi-gray mb-10 max-w-sm text-center font-bold uppercase tracking-tight">
          Il semblerait que vous n'ayez pas encore ajouté d'articles. Commencez votre session de jeu maintenant.
        </p>
        <Link to="/produits">
          <button className="adi-btn adi-btn-black px-12 py-4">DÉCOUVRIR LE CATALOGUE</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-[70vh] pb-20 font-sans">
      <div className="adi-container">
        {/* Header */}
        <div className="pt-10 pb-8 flex items-end gap-4 border-b-2 border-black">
          <h1 className="text-4xl md:text-5xl font-black italic text-black tracking-tighter uppercase leading-none">VOTRE PANIER</h1>
          <span className="text-lg font-bold text-adi-gray uppercase mb-1">[{count} ARTICLE{count > 1 ? 'S' : ''}]</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-10">
          {/* Items Section */}
          <div className="lg:col-span-8 flex flex-col">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-6 py-8 border-b border-adi-silver group">
                {/* Image */}
                <div className="w-32 h-32 md:w-48 md:h-48 bg-adi-silver flex-shrink-0 relative overflow-hidden">
                  <img
                    src={item.image?.startsWith('http') ? item.image : `${API_URL}${item.image}`}
                    alt={item.nom}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>

                {/* Info */}
                <div className="flex-grow flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <p className="text-[10px] text-[#4f46e5] font-black uppercase italic tracking-widest mb-1">{item.categorie}</p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-black hover:text-adi-red transition-all"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    <Link to={`/produits/${item.id}`} className="text-lg md:text-xl font-black italic text-black uppercase tracking-tighter hover:bg-black hover:text-white inline-block px-1 -ml-1 transition-all">
                      {item.nom}
                    </Link>
                    <p className="text-sm font-black italic mt-2">{parseFloat(item.prix).toFixed(2)} €</p>
                  </div>

                  <div className="flex items-center gap-6 mt-4 md:mt-0">
                    <div className="flex items-center border-2 border-black bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantite - 1)}
                        className="px-3 py-1 font-black text-black hover:bg-adi-silver transition-all"
                      ><Minus size={14} /></button>
                      <span className="w-10 text-center font-black text-sm border-x-2 border-black py-1">{item.quantite}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantite + 1)}
                        disabled={item.quantite >= item.stock}
                        className="px-3 py-1 font-black text-black hover:bg-adi-silver transition-all disabled:opacity-20"
                      ><Plus size={14} /></button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-[10px] font-black uppercase italic border-b-2 border-black hover:text-adi-red hover:border-adi-red transition-all"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Sub-info banner */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-adi-silver p-6 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <Truck size={18} />
                  <span className="text-xs font-black uppercase italic">LIVRAISON GRATUITE</span>
                </div>
                <p className="text-[10px] font-bold text-adi-gray leading-tight">OFFRTE POUR TOUTE COMMANDE SUPÉRIEURE À 100€.</p>
              </div>
              <div className="bg-adi-silver p-6 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <RotateCcw size={18} />
                  <span className="text-xs font-black uppercase italic">RETOURS SOUS 30 JOURS</span>
                </div>
                <p className="text-[10px] font-bold text-adi-gray leading-tight">RETOURNEZ VOS ARTICLES FACILEMENT SANS FRAIS.</p>
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="lg:col-span-4 mt-8 md:mt-0">
            <div className="sticky top-24 space-y-6">
              <div className="border-2 border-black p-8">
                <h2 className="text-xl font-black italic uppercase tracking-tighter mb-8 border-b-2 border-adi-silver pb-4">RÉSUMÉ DU PANIER</h2>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold uppercase text-adi-gray tracking-tight">{count} ARTICLE{count > 1 ? 'S' : ''}</span>
                    <span className="font-black italic">{total.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-bold uppercase text-adi-gray tracking-tight">LIVRAISON</span>
                    <span className="text-emerald-600 font-black italic">GRATUIT</span>
                  </div>
                </div>

                <div className="border-t-2 border-black pt-6 mb-8 flex justify-between items-end">
                  <span className="text-lg font-black italic uppercase">TOTAL</span>
                  <span className="text-2xl font-black italic">{total.toFixed(2)} €</span>
                </div>

                <Link to="/checkout" className="block w-full">
                  <button className="w-full adi-btn adi-btn-black py-4 flex items-center justify-center gap-4 group">
                    COMMANDER <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </Link>
              </div>

              <div className="p-8 bg-adi-silver">
                <h3 className="text-xs font-black uppercase italic mb-4">MÉTHODES DE PAIEMENT</h3>
                <div className="flex flex-wrap gap-3 grayscale opacity-60">
                  {['VISA', 'MASTERCARD', 'PAYPAL', 'APPLE PAY'].map(m => (
                    <div key={m} className="px-3 py-1 bg-white border border-adi-silver font-black italic text-[9px]">{m}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
