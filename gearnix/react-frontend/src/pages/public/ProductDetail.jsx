import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { API_URL } from '../../services/api';
import { useCart } from '../../context/CartContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ShoppingCart, Heart, ShieldCheck, ArrowLeft, Truck, RotateCcw, Share2, Ruler, ChevronDown, Plus, Minus, Info } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantite, setQuantite] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    api.get(`/produits/${id}`).then(res => {
      setProduct(res.data);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-4">Produit introuvable</h2>
        <Link to="/produits" className="adi-btn adi-btn-black">Retour au catalogue</Link>
      </div>
    </div>
  );

  const handleAddToCart = () => {
    addToCart(product, quantite);
    toast.success(`${quantite}x ${product.nom} ajouté(s) au panier`);
  };

  const getImageSrc = (img) => {
    if (!img) return null;
    return /^(https?:)?\/\//.test(img) ? img : `${API_URL}${img}`;
  };

  const images = [
    product.image,
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1000&q=80',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1000&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&q=80',
  ].filter(Boolean);

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      <div className="adi-container">
        
        {/* Breadcrumb & Navigation */}
        <div className="py-6 flex items-center justify-between border-b border-adi-silver mb-8">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-adi-gray italic tracking-widest">
            <Link to="/" className="hover:text-black">Accueil</Link>
            <span>/</span>
            <Link to="/produits" className="hover:text-black">Equipement</Link>
            <span>/</span>
            <span className="text-black">{product.nom}</span>
          </div>
          <Link to="/produits" className="text-[10px] font-black uppercase underline flex items-center gap-2">
            <ArrowLeft size={12} /> RETOUR
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          
          {/* Left Column: Massive Image Display */}
          <div className="lg:col-span-8 flex flex-col md:flex-row gap-4">
            {/* Desktop Thumbnails */}
            <div className="hidden md:flex flex-col gap-2 w-20 flex-shrink-0">
              {images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`aspect-square border-2 ${activeImage === idx ? 'border-black' : 'border-transparent bg-adi-silver'}`}
                >
                  <img src={getImageSrc(img)} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>
            
            {/* Main Image */}
            <div className="flex-1 bg-adi-silver relative aspect-[1/1] overflow-hidden">
               <img 
                 src={getImageSrc(images[activeImage])} 
                 className="w-full h-full object-cover" 
                 alt={product.nom} 
               />
               <button className="absolute top-6 right-6 p-3 bg-white hover:scale-110 transition-transform">
                 <Heart size={24} />
               </button>
               {product.stock === 0 && (
                 <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                    <span className="bg-black text-white font-black italic text-xl px-10 py-4">SÉRIE LIMITÉE - ÉPUISÉ</span>
                 </div>
               )}
            </div>
          </div>

          {/* Right Column: Product Actions */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black italic text-[#4f46e5] uppercase tracking-[0.2em]">{product.categorie}</span>
                <div className="flex gap-0.5">
                   {[1,2,3,4,5].map(i => <div key={i} className="w-4 h-1 bg-black" />)}
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none mb-4">
                {product.nom}
              </h1>
              <div className="flex items-center gap-4">
                 <span className="text-3xl font-black italic text-adi-red">{parseFloat(product.prix).toFixed(2)} €</span>
                 <span className="text-sm text-adi-gray line-through font-bold">{(parseFloat(product.prix) * 1.2).toFixed(2)} €</span>
                 <span className="bg-adi-red text-white text-[10px] font-black px-2 py-1 italic">-20% SALE</span>
              </div>
            </div>

            {/* Product Selector Logic (Quantité in Adidas style) */}
            <div className="space-y-6">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-widest mb-3">SÉLECTIONNER LA QUANTITÉ</label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map(q => (
                    <button 
                      key={q}
                      onClick={() => setQuantite(q)}
                      disabled={q > product.stock}
                      className={`py-4 border-2 font-black italic transition-all ${
                        quantite === q 
                          ? 'bg-black text-white border-black' 
                          : 'bg-white text-black border-adi-silver hover:border-black'
                      } ${q > product.stock ? 'opacity-20 cursor-not-allowed border-dashed' : ''}`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full adi-btn adi-btn-black py-5 text-lg flex items-center justify-center gap-4 group"
                >
                  AJOUTER AU PANIER <ShoppingCart size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="w-full adi-btn adi-btn-white py-5 flex items-center justify-center gap-3">
                  WISHLIST <Heart size={20} />
                </button>
              </div>
            </div>

            {/* Trust Points */}
            <div className="border-y border-adi-silver py-6 space-y-4">
              <div className="flex items-center gap-4">
                 <Truck size={20} />
                 <span className="text-xs font-bold uppercase tracking-tight">Livraison gratuite et retours sous 30 jours</span>
              </div>
              <div className="flex items-center gap-4">
                 <ShieldCheck size={20} />
                 <span className="text-xs font-bold uppercase tracking-tight">Garantie Gearnix Performance 2 Ans</span>
              </div>
              <div className="flex items-center gap-4">
                 <Info size={20} />
                 <span className="text-xs font-bold uppercase tracking-tight">Paiement 100% sécurisé (SSL Encryption)</span>
              </div>
            </div>

            {/* Accordion mockup */}
            <div className="space-y-0.5">
               {['DESCRIPTION', 'SPÉCIFICATIONS TECHNIQUES', 'CONSEILS D\'UTILISATION'].map(title => (
                 <button key={title} className="w-full flex items-center justify-between py-4 border-b border-adi-silver group hover:border-black transition-all">
                    <span className="text-xs font-black uppercase italic tracking-widest">{title}</span>
                    <ChevronDown size={16} className="text-adi-gray group-hover:text-black" />
                 </button>
               ))}
            </div>
          </div>
        </div>

        {/* Product Long Description */}
        <div className="mt-24 max-w-4xl">
           <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-6">{product.nom} : LA PERFORMANCE À L'ÉTAT PUR</h2>
           <p className="text-lg font-bold text-black/80 leading-relaxed mb-6">
             {product.description || 'Conçu pour l\'élite, cet équipement allie une ingénierie de pointe à une esthétique minimaliste. Chaque composant a été optimisé pour offrir une réactivité maximale et une durabilité exceptionnelle dans les conditions les plus intenses.'}
           </p>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 bg-adi-silver p-10">
              <div>
                <h4 className="font-black italic uppercase mb-2">PERFORMANCE OPTIMISÉE</h4>
                <p className="text-sm font-medium text-adi-gray">Technologie de pointe intégrée pour une précision accrue.</p>
              </div>
              <div>
                <h4 className="font-black italic uppercase mb-2">DESIGN ICONIQUE</h4>
                <p className="text-sm font-medium text-adi-gray">Look épuré inspiré par les standards professionnels.</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
