import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Button from '../../components/ui/Button';
import { Trash2, ShoppingCart, ArrowRight } from 'lucide-react';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, total, count } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <ShoppingCart size={48} className="text-gray-500" />
        </div>
        <h2 className="text-3xl font-black mb-4">Votre panier est vide</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Discover our premium gear collection.</p>
        <Link to="/produits">
          <Button className="px-8 py-3">Découvrir les produits</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-[70vh]">
      <h1 className="text-3xl font-black mb-8 uppercase flex items-center gap-3">
        <ShoppingCart className="text-primary"/> Mon Panier <span className="text-gray-500 text-xl font-medium">({count} articles)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
             <div key={item.id} className="glass-card flex p-4 items-center gap-4 relative">
               <div className="w-24 h-24 bg-darker rounded-lg overflow-hidden flex-shrink-0 relative">
                 {item.image ? (
                   <img src={item.image} alt={item.nom} className="w-full h-full object-cover mix-blend-lighten" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">Pas d'image</div>
                 )}
               </div>
               
               <div className="flex-grow">
                 <p className="text-xs text-primary mb-1 font-bold">{item.categorie}</p>
                 <Link to={`/produits/${item.id}`} className="text-lg font-bold text-white hover:text-primary transition-colors line-clamp-1">
                   {item.nom}
                 </Link>
                 <p className="font-black text-accent mt-2">{item.prix} €</p>
               </div>
               
               <div className="flex flex-col items-end gap-3 flex-shrink-0">
                 <button 
                   onClick={() => removeFromCart(item.id)}
                   className="text-gray-400 hover:text-red-500 transition-colors p-1"
                 >
                   <Trash2 size={18} />
                 </button>
                 
                 <div className="flex items-center border border-white/20 rounded-lg overflow-hidden bg-darker">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantite - 1)}
                      className="px-3 py-1 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    >-</button>
                    <span className="w-10 text-center font-bold text-sm">{item.quantite}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantite + 1)}
                      className="px-3 py-1 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                      disabled={item.quantite >= item.stock}
                    >+</button>
                  </div>
               </div>
             </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="glass-card p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Résumé de la commande</h2>
            
            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>Sous-total ({count} articles)</span>
                <span className="font-medium text-white">{total.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Frais de livraison</span>
                <span className="text-green-400 font-medium">Gratuit</span>
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-4 mb-8">
              <div className="flex justify-between items-end">
                <span className="text-gray-300 font-medium">Total</span>
                <span className="text-3xl font-black text-accent neon-text">{total.toFixed(2)} €</span>
              </div>
            </div>

            <Link to="/checkout" className="block">
              <Button className="w-full flex items-center justify-center gap-2 py-4">
                Procéder au paiement <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
