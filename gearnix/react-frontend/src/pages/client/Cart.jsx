import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Button from '../../components/ui/Button';
import { Trash2, ShoppingCart, ArrowRight } from 'lucide-react';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, total, count } = useCart();

  if (cart.length === 0) {
    return (
      <div className="lux-container py-16 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-white/[0.03] rounded-full border border-white/10 flex items-center justify-center mb-6 shadow-soft">
          <ShoppingCart size={48} className="text-gray-500" />
        </div>
        <h2 className="text-3xl font-black mb-4 text-pearl">Votre panier est vide</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Discover our premium gear collection.</p>
        <Link to="/produits">
          <Button size="lg" className="px-8">Découvrir les produits</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="lux-container py-8 min-h-[70vh]">
      <div className="relative overflow-hidden rounded-xl2 border border-white/10 bg-white/[0.03] shadow-soft mb-10">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?w=1600&q=80')] bg-cover bg-center opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/60 to-transparent" />
        <div className="relative z-10 p-8 md:p-10">
          <p className="text-xs font-semibold tracking-[0.28em] uppercase text-gray-300">Panier</p>
          <h1 className="text-3xl md:text-5xl font-black mt-3 text-pearl flex items-center gap-4">
            Mon panier <span className="text-gray-500 text-base md:text-lg font-semibold tracking-[0.18em] uppercase">({count} articles)</span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
             <div key={item.id} className="lux-card flex p-5 items-center gap-5 relative">
               <div className="w-24 h-24 bg-white/[0.03] rounded-xl overflow-hidden flex-shrink-0 relative border border-white/10">
                 {item.image ? (
                   <img src={item.image} alt={item.nom} className="w-full h-full object-cover opacity-90" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">Pas d'image</div>
                 )}
               </div>
               
               <div className="flex-grow">
                 <p className="text-[11px] text-sky-500 mb-2 font-semibold uppercase tracking-[0.22em]">{item.categorie}</p>
                 <Link to={`/produits/${item.id}`} className="text-lg font-black text-pearl hover:text-sky-500 transition-colors line-clamp-1">
                   {item.nom}
                 </Link>
                 <p className="font-black text-pearl mt-3">{item.prix} €</p>
               </div>
               
               <div className="flex flex-col items-end gap-3 flex-shrink-0">
                 <button 
                   onClick={() => removeFromCart(item.id)}
                   className="text-gray-400 hover:text-red-300 transition-colors p-1"
                 >
                   <Trash2 size={18} />
                 </button>
                 
                 <div className="flex items-center border border-white/10 rounded-xl overflow-hidden bg-white/[0.02]">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantite - 1)}
                      className="px-3 py-1.5 text-gray-300 hover:text-pearl hover:bg-white/[0.06] transition-colors"
                    >-</button>
                    <span className="w-10 text-center font-black text-sm text-pearl">{item.quantite}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantite + 1)}
                      className="px-3 py-1.5 text-gray-300 hover:text-pearl hover:bg-white/[0.06] transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
                      disabled={item.quantite >= item.stock}
                    >+</button>
                  </div>
               </div>
             </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="lux-card p-7 sticky top-24">
            <h2 className="text-xs font-black tracking-[0.26em] uppercase mb-6 border-b border-white/10 pb-4 text-pearl">Résumé de la commande</h2>
            
            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>Sous-total ({count} articles)</span>
                <span className="font-semibold text-pearl">{total.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Frais de livraison</span>
                <span className="text-green-400 font-medium">Gratuit</span>
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-4 mb-8">
              <div className="flex justify-between items-end">
                <span className="text-gray-300 font-medium">Total</span>
                <span className="text-3xl font-black text-pearl neon-text">{total.toFixed(2)} €</span>
              </div>
            </div>

            <Link to="/checkout" className="block">
              <Button size="lg" className="w-full flex items-center justify-center gap-2">
                Procéder au paiement <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
