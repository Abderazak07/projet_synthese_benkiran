import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { API_URL } from '../../services/api';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Veuillez vous connecter pour ajouter au panier');
      navigate('/login');
      return;
    }

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
        
        {/* Badges - Top Left */}
        {product.stock === 0 ? (
          <div className="absolute top-0 left-0 bg-adi-gray text-white text-[10px] font-black uppercase px-2 py-1 italic">
            ÉPUISÉ
          </div>
        ) : product.prix_original ? (
          <div className="absolute top-0 left-0 bg-[#e11d48] text-white text-[10px] font-black uppercase px-3 py-1 italic tracking-widest animate-pulse">
            SOLD
          </div>
        ) : product.prix > 200 ? (
          <div className="absolute top-0 left-0 bg-adi-red text-white text-[10px] font-black uppercase px-2 py-1 italic tracking-widest">
            NOUVEAUTÉ
          </div>
        ) : null}

        {/* Price Tag - Bottom Left Floating (Adidas Style) */}
        {product.stock > 0 && (
          <div className="absolute bottom-2 left-2 bg-white px-2.5 py-1.5 text-[11px] font-black italic tracking-tighter z-10 flex flex-col items-start leading-none shadow-sm rounded-md border border-black/5">
            {product.prix_original && (
              <div className="flex items-center gap-1 mb-0.5 opacity-60">
                <span className="text-gray-400 line-through font-bold text-[9px]">
                  {parseFloat(product.prix_original).toFixed(2)} MAD
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <span className={product.prix_original ? "text-[#e11d48]" : "text-black"}>
                {parseFloat(product.prix).toFixed(2)} MAD
              </span>
            </div>
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
