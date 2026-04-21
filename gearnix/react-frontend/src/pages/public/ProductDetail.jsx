import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { API_URL } from '../../services/api';
import { useCart } from '../../context/CartContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ShoppingCart, Heart, ShieldCheck, ArrowLeft, Truck, ChevronDown, Info } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantite, setQuantite] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/produits/${id}`);
        setProduct(res.data);
      } catch (err) {
        toast.error('Produit introuvable');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product.stock > 0) {
      addToCart(product, quantite);
      toast.success(`${product.nom} ajouté au panier`);
    } else {
      toast.error('Produit épuisé');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><LoadingSpinner /></div>;
  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h2 className="text-3xl font-black italic uppercase mb-6">PRODUIT INTROUVABLE</h2>
      <Link to="/produits" className="adi-btn adi-btn-black px-10">RETOUR AU CATALOGUE</Link>
    </div>
  );

  const getImageSrc = (img) => {
    if (!img) return '';
    return /^(https?:)?\/\//.test(img) ? img : `${API_URL}${img}`;
  };

  const images = [product.image, product.image2, product.image3, product.image4].filter(Boolean);

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      <div className="adi-container">
        {/* Navigation / Breadcrumbs */}
        <div className="pt-10 pb-8">
          <Link to="/produits" className="text-xs font-black uppercase italic flex items-center gap-2 hover:text-adi-gray transition-all">
            <ArrowLeft size={16} /> RETOUR AU CATALOGUE
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Left Column: Media Gallery */}
          <div className="lg:col-span-8 flex flex-col md:flex-row gap-4">
            {/* Desktop Thumbnails */}
            <div className="hidden md:flex flex-col gap-2 w-20 flex-shrink-0">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`aspect-square border-2 transition-all ${activeImage === idx ? 'border-black' : 'border-transparent bg-adi-silver hover:border-black/50'}`}
                >
                  <img src={getImageSrc(img)} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 bg-adi-silver relative aspect-[1/1] overflow-hidden group">
              <img
                src={getImageSrc(images[activeImage])}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                alt={product.nom}
              />
              <button className="absolute top-6 right-6 p-4 bg-white hover:scale-110 transition-transform shadow-sm">
                <Heart size={24} />
              </button>
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                  <span className="bg-black text-white font-black italic text-xl px-10 py-4">SÉRIE LIMITÉE - ÉPUISÉ</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Information & Actions */}
          <div className="lg:col-span-4 flex flex-col gap-10">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black italic text-[#4f46e5] uppercase tracking-[0.2em]">{product.categorie}</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-5 h-1.5 bg-black" />)}
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none mb-6">
                {product.nom}
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-black italic text-adi-red">{parseFloat(product.prix).toFixed(2)} €</span>
                <span className="text-sm text-adi-gray line-through font-bold">{(parseFloat(product.prix) * 1.2).toFixed(2)} €</span>
                <span className="bg-adi-red text-white text-[10px] font-black px-3 py-1.5 italic tracking-widest">-20% SALE</span>
              </div>
            </div>

            {/* Selection Logic */}
            <div className="space-y-10">
               <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest mb-4">SÉLECTIONNER LA QUANTITÉ</label>
                  <div className="grid grid-cols-5 gap-2">
                     {[1,2,3,4,5].map(q => (
                       <button
                         key={q}
                         onClick={() => setQuantite(q)}
                         disabled={q > product.stock}
                         className={`py-5 border-2 font-black italic transition-all ${quantite === q 
                           ? 'bg-black text-white border-black shadow-lg translate-y-[-2px]' 
                           : 'bg-white text-black border-adi-silver hover:border-black'} 
                           ${q > product.stock ? 'opacity-20 cursor-not-allowed border-dashed' : ''}`}
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
                    className="w-full adi-btn adi-btn-black py-6 text-xl flex items-center justify-center gap-4 group disabled:opacity-20"
                  >
                    AJOUTER AU PANIER <ShoppingCart size={24} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="w-full h-16 border-2 border-adi-silver text-black font-black italic uppercase tracking-widest flex items-center justify-center gap-3 hover:border-black transition-all">
                    WISHLIST <Heart size={20} />
                  </button>
               </div>
            </div>

            {/* Trust Propositions */}
            <div className="border-y border-adi-silver py-8 space-y-6">
               <div className="flex items-center gap-4">
                  <Truck size={22} />
                  <span className="text-xs font-bold uppercase tracking-tight leading-tight">Livraison express gratuite sur cet article d'élite</span>
               </div>
               <div className="flex items-center gap-4">
                  <ShieldCheck size={22} />
                  <span className="text-xs font-bold uppercase tracking-tight leading-tight">Authenticité Gearnix Performance Garantie 2 Ans</span>
               </div>
               <div className="flex items-center gap-4">
                  <Info size={22} />
                  <span className="text-xs font-bold uppercase tracking-tight leading-tight">Paiement ultra-sécurisé & Retours gratuits sous 30 jours</span>
               </div>
            </div>

            {/* Accordion mockup */}
            <div className="space-y-1">
               {['DESCRIPTION TECHNIQUE', 'SPÉCIFICATIONS DÉTAILLÉES', 'CONSEILS D\'UTILISATION'].map(title => (
                 <button key={title} className="w-full flex items-center justify-between py-6 border-b border-adi-silver group hover:border-black transition-all text-left">
                    <span className="text-xs font-black uppercase italic tracking-widest">{title}</span>
                    <ChevronDown size={18} className="text-adi-gray group-hover:text-black transition-colors" />
                 </button>
               ))}
            </div>
          </div>
        </div>

        {/* Extended Description Section */}
        <div className="mt-32 max-w-4xl border-l-[12px] border-black pl-12">
           <h2 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase leading-[0.85] mb-10">
             {product.nom} <br /> 
             <span className="text-adi-gray">LA PERFORMANCE SANS COMPROMIS.</span>
           </h2>
           <p className="text-xl md:text-2xl font-bold text-black/90 leading-snug mb-12 italic tracking-tight">
             {product.description || 'Conçu pour briser les records, cet équipement redéfinit les standards de la compétition. Une ingénierie de précision au service d\'une réactivité sans faille et d\'une durabilité exceptionnelle.'}
           </p>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-adi-silver p-12">
              <div className="space-y-3">
                 <h4 className="text-lg font-black italic uppercase tracking-wider">INGÉNIERIE D'ÉLITE</h4>
                 <p className="text-sm font-medium text-adi-gray leading-relaxed">Matériaux premium sélectionnés pour leur durabilité extrême et leur légèreté incomparable. Chaque watt est optimisé.</p>
              </div>
              <div className="space-y-3">
                 <h4 className="text-lg font-black italic uppercase tracking-wider">DESIGN MINIMALISTE</h4>
                 <p className="text-sm font-medium text-adi-gray leading-relaxed">Optimisé pour une prise en main instinctive et une fatigue réduite lors des sessions prolongées. L'esthétique au service du sport.</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
