import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { API_URL } from '../../services/api';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock > 0) {
      addToCart(product, 1);
      toast.success(`${product.nom} ajouté au panier`);
    } else {
      toast.error('Produit épuisé');
    }
  };

  const imageSrc = product.image?.startsWith('http') ? product.image : `${API_URL}${product.image}`;

  return (
    <Link to={`/produits/${product.id}`} className="group block relative bg-transparent border border-transparent hover:border-black transition-all duration-200">
      {/* Product Image Wrapper */}
      <div className="relative aspect-[1/1] overflow-hidden bg-adi-silver">
        <img
          src={imageSrc}
          alt={product.nom}
          className="w-full h-full object-cover"
        />
        
        {/* Wishlist Button - Top Right */}
        <button className="absolute top-3 right-3 p-1 text-black hover:scale-110 transition-all opacity-0 group-hover:opacity-100">
          <Heart size={20} strokeWidth={2.5} />
        </button>

        {/* Badges - Top Left */}
        {product.stock === 0 ? (
          <div className="absolute top-0 left-0 bg-adi-gray text-white text-[10px] font-black uppercase px-2 py-1 italic">
            ÉPUISÉ
          </div>
        ) : product.prix > 200 ? (
          <div className="absolute top-0 left-0 bg-adi-red text-white text-[10px] font-black uppercase px-2 py-1 italic tracking-widest">
            NOUVEAUTÉ
          </div>
        ) : null}

        {/* Price Tag - Bottom Left Floating (Adidas Style) */}
        {product.stock > 0 && (
          <div className="absolute bottom-2 left-2 bg-white px-2 py-1 text-[11px] font-black italic tracking-tighter z-10">
            {parseFloat(product.prix).toFixed(2)} €
          </div>
        )}

        {/* Quick Buy Plus - Bottom Right */}
        <button 
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 w-10 h-10 bg-white border border-adi-silver flex items-center justify-center text-black opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all hover:bg-black hover:text-white"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Product Details - Clean Padding */}
      <div className="py-4 px-3 flex flex-col gap-1 min-h-[80px]">
        <h3 className="text-[13px] font-bold uppercase italic tracking-tighter text-black leading-tight line-clamp-2">
          {product.nom}
        </h3>
        <p className="text-[10px] font-bold text-adi-gray uppercase tracking-widest leading-none">
          {product.categorie}
        </p>
      </div>
    </Link>
  );
}
