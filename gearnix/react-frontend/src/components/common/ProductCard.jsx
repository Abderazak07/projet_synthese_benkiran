import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';
import Button from '../ui/Button';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e) => {
    e.preventDefault(); // allow using link wrapper but stopping button click nav
    addToCart(product);
    toast.success(`${product.nom} ajouté au panier !`);
  }

  return (
    <div className="product-card p-4 flex flex-col h-full relative overflow-hidden group">
      {product.stock === 0 && (
        <div className="absolute top-3 right-3 bg-red-500/70 text-white text-[11px] px-3 py-1 rounded-full z-10 font-black backdrop-blur border border-red-500/20">
          Rupture
        </div>
      )}
      <Link to={`/produits/${product.id}`} className="flex-grow flex flex-col">
        <div className="h-52 w-full rounded-xl overflow-hidden bg-white/[0.03] mb-4 relative border border-white/10">
          {product.image ? (
             <img
               src={/^(https?:)?\/\//.test(product.image) ? product.image : `http://localhost:8000${product.image}`}
               alt={product.nom}
               className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
             />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/20">Pas d'image</div>
          )}
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
        </div>
        
        <div className="flex flex-col flex-grow">
          <p className="text-[11px] text-gold mb-2 uppercase tracking-[0.22em] font-semibold">{product.categorie}</p>
          <h3 className="text-lg font-black text-pearl mb-3 line-clamp-2 leading-snug">{product.nom}</h3>
          
          <div className="mt-auto flex items-center justify-between">
            <span className="text-xl font-black text-pearl neon-text">{product.prix} €</span>
            <span className="text-[11px] text-gray-500 tracking-[0.22em] uppercase">
              {product.stock > 0 ? `Stock ${product.stock}` : 'Indisponible'}
            </span>
          </div>
        </div>
      </Link>
      
      <Button
        onClick={handleAddToCart}
        disabled={product.stock === 0}
        className="mt-4 w-full"
        size="sm"
        variant={product.stock > 0 ? 'primary' : 'outline'}
      >
        <ShoppingCart size={18} />
        {product.stock > 0 ? 'Ajouter' : 'Indisponible'}
      </Button>
    </div>
  );
}
