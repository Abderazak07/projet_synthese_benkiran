import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { ShoppingCart, Check, ShieldCheck, ArrowLeft, Palette, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantite, setQuantite] = useState(1);
  const [color, setColor] = useState('Noir');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    api.get(`/produits/${id}`).then(res => {
      setProduct(res.data);
      setCurrentImageIndex(0);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="pt-20"><LoadingSpinner /></div>;
  if (!product) return <div className="text-center pt-20">Produit introuvable</div>;

  // Get all available images
  const images = [product.image, product.image2, product.image3, product.image4].filter(Boolean);
  const currentImage = images.length > 0 ? images[currentImageIndex] : null;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleAddToCart = () => {
    addToCart(product, quantite);
    toast.success(`${quantite}x ${product.nom} ajouté(s) au panier`);
  };

  return (
    <div className="lux-container py-8">
      <div className="flex items-center justify-between gap-6 mb-8">
        <Link to="/produits" className="inline-flex items-center gap-2 text-gray-400 hover:text-sky-500 transition-colors">
          <ArrowLeft size={16} /> Retour au catalogue
        </Link>
        <div className="hidden md:flex items-center gap-2">
          <Badge variant="neutral">Collection</Badge>
          <Badge>{product.categorie}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: media */}
        <div className="lg:col-span-7">
          <div className="relative overflow-hidden rounded-xl2 border border-white/10 bg-white/[0.03] shadow-soft">
            <div className="absolute inset-0 opacity-[0.06] bg-lux-grid bg-[size:60px_60px]" />
            <div className="relative p-4 md:p-5">
              {/* Main Image with Navigation */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-graphite flex items-center justify-center border border-white/10 group">
                {currentImage ? (
                  <img
                    src={/^(https?:)?\/\//.test(currentImage) ? currentImage : `http://localhost:8000${currentImage}`}
                    alt={product.nom}
                    className="w-full h-full object-cover transition-transform duration-300"
                  />
                ) : (
                  <span className="text-gray-600">Pas d'image</span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />

                {/* Navigation Buttons */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                      type="button"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                      type="button"
                      aria-label="Next image"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {currentImageIndex + 1}/{images.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="mt-5 grid grid-cols-4 gap-4">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleThumbnailClick(idx)}
                      className={`relative rounded-xl overflow-hidden border-2 aspect-[4/3] transition-all ${
                        currentImageIndex === idx
                          ? 'border-sky-500 opacity-100'
                          : 'border-white/10 opacity-75 hover:opacity-95'
                      }`}
                      type="button"
                    >
                      <img
                        src={/^(https?:)?\/\//.test(img) ? img : `http://localhost:8000${img}`}
                        alt={`Détail ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/65 to-transparent" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: info/options */}
        <div className="lg:col-span-5">
          <div className="lux-card p-7 md:p-8">
            <p className="text-xs font-semibold tracking-[0.28em] uppercase text-gray-400">New · Gear edition</p>
            <h1 className="text-3xl md:text-4xl font-black text-pearl mt-4 leading-tight">{product.nom}</h1>

            <div className="mt-6 flex items-center gap-4">
              <div className="text-3xl font-black text-pearl neon-text">{product.prix} €</div>
              {product.stock > 0 ? (
                <Badge variant="success" className="gap-1">
                  <Check size={14} /> En stock ({product.stock})
                </Badge>
              ) : (
                <Badge variant="danger">Rupture</Badge>
              )}
            </div>

            <div className="mt-6 h-px lux-hairline" />

            <p className="text-gray-300 leading-relaxed mt-6 whitespace-pre-line">
              {product.description || 'Aucune description fournie.'}
            </p>

            {/* Options (color selection) */}
            <div className="mt-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Palette size={16} className="text-sky-500" />
                  <p className="text-xs font-black tracking-[0.22em] uppercase text-pearl">Color</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Noir', swatch: 'bg-black' },
                    { label: 'Graphite', swatch: 'bg-zinc-700' },
                    { label: 'Bleu', swatch: 'bg-sky-500' },
                  ].map((c) => (
                    <button
                      key={c.label}
                      onClick={() => setColor(c.label)}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold tracking-[0.18em] uppercase border transition-colors ${
                        color === c.label
                          ? 'bg-sky-500/12 border-sky-500/30 text-pearl'
                          : 'bg-white/[0.02] border-white/10 text-gray-300 hover:border-sky-500/20 hover:bg-white/[0.04]'
                      }`}
                      type="button"
                    >
                      <span className={`h-3 w-3 rounded-full ${c.swatch} border border-white/20`} />
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quantity + CTA */}
            <div className="mt-8 lux-card p-5 bg-white/[0.02]">
              <div className="flex items-end gap-5">
                <div className="w-36">
                  <label className="block text-xs font-semibold tracking-[0.22em] uppercase text-gray-400 mb-2">
                    Quantité
                  </label>
                  <div className="flex items-center border border-white/10 rounded-xl overflow-hidden bg-white/[0.02]">
                    <button
                      onClick={() => setQuantite(Math.max(1, quantite - 1))}
                      className="px-4 py-2.5 text-gray-300 hover:text-pearl hover:bg-white/[0.06] transition-colors"
                      type="button"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantite}
                      onChange={e =>
                        setQuantite(
                          Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1))
                        )
                      }
                      className="w-full text-center bg-transparent border-none focus:ring-0 p-2 font-black text-pearl"
                      min="1"
                      max={product.stock}
                    />
                    <button
                      onClick={() => setQuantite(Math.min(product.stock, quantite + 1))}
                      className="px-4 py-2.5 text-gray-300 hover:text-pearl hover:bg-white/[0.06] transition-colors"
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex-1">
                  <Button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="w-full py-4 text-base font-black"
                    size="lg"
                  >
                    <ShoppingCart size={20} />
                    {product.stock > 0 ? 'Add to bag' : 'Indisponible'}
                  </Button>
                  <p className="mt-3 text-[11px] text-gray-500 tracking-[0.18em] uppercase">
                    Couleur: {color}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 text-xs text-gray-400 justify-center">
                <ShieldCheck size={16} className="text-sky-500" />
                Paiement sécurisé • Retour sous 30 jours
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
