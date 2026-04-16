import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e) => {
    e.preventDefault(); // allow using link wrapper but stopping button click nav
    addToCart(product);
    toast.success(`${product.nom} ajouté au panier !`);
  }

  return (
    <div className="glass-card product-card p-4 flex flex-col h-full relative overflow-hidden group">
      {product.stock === 0 && (
        <div className="absolute top-2 right-2 bg-red-500/80 text-white text-xs px-2 py-1 rounded-full z-10 font-bold backdrop-blur">
          Rupture
        </div>
      )}
      <Link to={`/produits/${product.id}`} className="flex-grow flex flex-col">
        <div className="h-48 w-full rounded-lg overflow-hidden bg-white/5 mb-4 relative">
          {product.image ? (
             <img
               src={/^(https?:)?\/\//.test(product.image) ? product.image : `http://localhost:8000${product.image}`}
               alt={product.nom}
               className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
             />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/20">Pas d'image</div>
          )}
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent"></div>
        </div>
        
        <div className="flex flex-col flex-grow">
          <p className="text-xs text-primary mb-1 uppercase tracking-wider font-semibold">{product.categorie}</p>
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{product.nom}</h3>
          
          <div className="mt-auto flex items-center justify-between">
            <span className="text-xl font-black text-accent neon-text">{product.prix} €</span>
          </div>
        </div>
      </Link>
      
      <button 
        onClick={handleAddToCart}
        disabled={product.stock === 0}
        className={`mt-4 flex items-center justify-center gap-2 w-full py-2 rounded-lg font-semibold transition-all duration-300 ${
          product.stock > 0 
           ? 'bg-white/10 hover:bg-primary text-white border border-white/10 hover:border-primary hover:shadow-[0_0_15px_rgba(124,58,237,0.5)]' 
           : 'bg-white/5 text-gray-500 cursor-not-allowed cursor-not-allowed'
        }`}
      >
        <ShoppingCart size={18} />
        {product.stock > 0 ? 'Ajouter' : 'Indisponible'}
      </button>
    </div>
  );
}
