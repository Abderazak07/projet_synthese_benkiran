import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/ui/Button';
import { ShoppingCart, Check, ShieldCheck, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantite, setQuantite] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    api.get(`/produits/${id}`).then(res => {
      setProduct(res.data);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="pt-20"><LoadingSpinner /></div>;
  if (!product) return <div className="text-center pt-20">Produit introuvable</div>;

  const handleAddToCart = () => {
    addToCart(product, quantite);
    toast.success(`${quantite}x ${product.nom} ajouté(s) au panier`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/produits" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-8">
        <ArrowLeft size={16} /> Retour aux produits
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="glass-card p-4 rounded-2xl">
           <div className="aspect-square rounded-xl overflow-hidden bg-darker flex items-center justify-center relative">
             {product.image ? (
               <img
                 src={/^(https?:)?\/\//.test(product.image) ? product.image : `http://localhost:8000${product.image}`}
                 alt={product.nom}
                 className="w-full h-full object-cover"
               />
             ) : (
               <span className="text-gray-600">Pas d'image</span>
             )}
             <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent"></div>
           </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-6">
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">{product.categorie}</span>
            <h1 className="text-4xl font-black text-white mb-4 leading-tight">{product.nom}</h1>
            <div className="flex items-center gap-4 border-b border-white/10 pb-6 mb-6">
              <span className="text-3xl font-black text-accent neon-text">{product.prix} €</span>
              {product.stock > 0 ? (
                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30 flex items-center gap-1">
                  <Check size={14} /> En Stock ({product.stock})
                </span>
              ) : (
                <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-bold border border-red-500/30">
                  Rupture de stock
                </span>
              )}
            </div>
            
            <p className="text-gray-300 leading-relaxed mb-6 whitespace-pre-line">
              {product.description || "Aucune description fournie."}
            </p>
          </div>

          <div className="mt-auto glass-card p-6">
            <div className="flex items-end gap-6 mb-6">
              <div className="w-32">
                <label className="block text-sm font-medium text-gray-400 mb-2">Quantité</label>
                <div className="flex items-center border border-white/20 rounded-lg overflow-hidden bg-darker">
                  <button 
                    onClick={() => setQuantite(Math.max(1, quantite - 1))}
                    className="px-4 py-2 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  >-</button>
                  <input 
                    type="number" 
                    value={quantite} 
                    onChange={e => setQuantite(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                    className="w-full text-center bg-transparent border-none focus:ring-0 p-2 font-bold"
                    min="1"
                    max={product.stock}
                  />
                  <button 
                    onClick={() => setQuantite(Math.min(product.stock, quantite + 1))}
                    className="px-4 py-2 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  >+</button>
                </div>
              </div>
              <div className="flex-1">
                <Button 
                   onClick={handleAddToCart}
                   disabled={product.stock === 0}
                   className="w-full flex items-center justify-center gap-2 py-4 text-lg"
                >
                  <ShoppingCart size={20} />
                  {product.stock > 0 ? 'Ajouter au panier' : 'Indisponible'}
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-400 justify-center">
              <ShieldCheck size={16} className="text-green-400" />
              Garantie sécurisée • Retour sous 30 jours
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
