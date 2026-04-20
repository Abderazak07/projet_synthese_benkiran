import { Link } from 'react-router-dom';
import { Truck, RotateCcw, PiggyBank, HeadphonesIcon, Package, ArrowRight, ShoppingBag, Layers } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import ProductCard from '../../components/common/ProductCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/homepage')
      .then(res => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = data?.categories || [];
  const featuredProducts = data?.featuredProducts || [];
  const heroProduct = data?.heroProduct || null;
  const stats = data?.stats || { totalProducts: 0, totalCategories: 0 };

  // Pick the first category with an image for the hero banner
  const heroCategoryImage = heroProduct?.image || null;

  // Pick up to 4 categories for the hero grid
  const topCategories = categories.slice(0, 4);
  // Featured collections — admin-curated for the "Nos collections" section
  const collectionCategories = data?.featuredCollections || categories.slice(0, 6);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden -mt-16">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{
            backgroundImage: heroCategoryImage
              ? `url(${heroCategoryImage})`
              : "url('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&q=80')"
          }}
        />
        <div className="absolute inset-0 bg-lux-hero" />
        <div className="absolute inset-0 opacity-[0.06] bg-lux-grid bg-[size:60px_60px]" />

        <div className="relative z-10 lux-container pt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <p className="text-xs font-semibold tracking-[0.28em] uppercase text-gray-300 mb-4">
                Édition {new Date().getFullYear()} · {stats.totalProducts} produits disponibles
              </p>
              <h1 className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tight">
                Upgrade ton
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-sky-600 neon-text">
                  setup gaming
                </span>
              </h1>
              <p className="text-base md:text-lg text-gray-300 mt-6 max-w-xl">
                {stats.totalProducts > 0
                  ? `${stats.totalProducts} produits dans ${stats.totalCategories} catégories — performance, confort et esthétique premium.`
                  : 'Une sélection haut de gamme pensée pour la performance, le confort et un rendu esthétique impeccable.'}
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link to="/produits" className="lux-pill glow-btn text-ink font-black">
                  Explorer la boutique
                </Link>
                {categories.length > 0 && (
                  <Link
                    to={`/produits?categorie=${encodeURIComponent(categories[0].nom)}`}
                    className="lux-pill border border-white/15 bg-white/[0.02] text-pearl hover:bg-white/[0.05] hover:border-sky-500/35"
                  >
                    {categories[0].nom}
                  </Link>
                )}
              </div>
              <div className="mt-10 h-px w-full lux-hairline" />
              <div className="mt-8 grid grid-cols-2 gap-6 text-sm">
                <div className="lux-card p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-gray-400 mb-2">Catalogue</p>
                  <p className="font-black text-pearl">{stats.totalProducts} produits</p>
                </div>
                <div className="lux-card p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-gray-400 mb-2">Catégories</p>
                  <p className="font-black text-pearl">{stats.totalCategories} collections</p>
                </div>
              </div>
            </div>

            {/* Hero right — dynamic category cards */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
                {/* Featured hero card — latest product or first category */}
                {heroProduct && (
                  <Link
                    to={`/produits/${heroProduct.id}`}
                    className="md:col-span-6 relative overflow-hidden rounded-xl2 border border-white/10 bg-white/[0.03] shadow-soft group min-h-[280px]"
                  >
                    {heroProduct.image && (
                      <img
                        src={heroProduct.image}
                        alt={heroProduct.nom}
                        className="absolute inset-0 h-full w-full object-cover opacity-55 group-hover:opacity-70 group-hover:scale-[1.03] transition-all duration-700"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/30 to-transparent" />
                    <div className="relative z-10 p-8 md:p-10 max-w-md">
                      <p className="text-xs font-semibold tracking-[0.26em] uppercase text-gray-300 mb-3">
                        {heroProduct.categorie || 'Nouveauté'}
                      </p>
                      <h2 className="text-3xl md:text-4xl font-black leading-tight text-pearl">
                        {heroProduct.nom}
                      </h2>
                      <p className="text-gray-300 mt-3 text-sm line-clamp-2">{heroProduct.description}</p>
                      <span className="mt-6 inline-flex items-center gap-2 text-sky-500 text-sm font-semibold tracking-wide">
                        {parseFloat(heroProduct.prix).toFixed(2)} € <span aria-hidden>→</span>
                      </span>
                    </div>
                  </Link>
                )}

                {/* Category cards from database */}
                {topCategories.map((cat) => (
                  <Link
                    to={`/produits?categorie=${encodeURIComponent(cat.nom)}`}
                    key={cat.nom}
                    className="md:col-span-3 relative overflow-hidden rounded-xl2 border border-white/10 bg-white/[0.03] shadow-soft group min-h-[170px]"
                  >
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.nom}
                        className="absolute inset-0 h-full w-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-[1.05] transition-all duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#0ea5e9]/30 to-ink/80" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                    <div className="relative z-10 p-6">
                      <p className="text-xs uppercase tracking-[0.22em] text-gray-300">Collection</p>
                      <h3 className="mt-2 text-xl font-black text-pearl">{cat.nom}</h3>
                      <p className="mt-1 text-xs text-gray-400">{cat.product_count} produit{cat.product_count !== 1 ? 's' : ''}</p>
                      <span className="mt-4 inline-flex items-center gap-2 text-sky-500 text-xs font-semibold tracking-[0.18em] uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                        Explorer <span aria-hidden>→</span>
                      </span>
                    </div>
                  </Link>
                ))}

                {/* Show a "See all" card if there are more than 4 categories */}
                {categories.length > 4 && (
                  <Link
                    to="/produits"
                    className="md:col-span-3 relative overflow-hidden rounded-xl2 border border-sky-500/20 bg-sky-500/[0.04] shadow-soft group min-h-[170px] flex items-center justify-center"
                  >
                    <div className="text-center p-6">
                      <div className="w-12 h-12 rounded-full bg-sky-500/10 flex items-center justify-center mx-auto mb-3 text-sky-500 border border-sky-500/20 group-hover:bg-sky-500/20 transition-colors">
                        <ArrowRight size={22} />
                      </div>
                      <p className="text-pearl font-black">Voir toutes</p>
                      <p className="text-xs text-gray-400 mt-1">{categories.length} catégories</p>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-y border-white/10 bg-white/[0.01]">
        <div className="lux-container py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Truck, title: 'Livraison rapide', sub: 'À partir de 100 € d\'achat' },
              { icon: RotateCcw, title: 'Retour facile', sub: '30 jours satisfait ou remboursé' },
              { icon: PiggyBank, title: 'Prix compétitifs', sub: 'Meilleur rapport qualité/prix' },
              { icon: HeadphonesIcon, title: 'Support 24/7', sub: 'Une équipe à votre écoute' },
            ].map((it) => {
              const Icon = it.icon;
              return (
                <div key={it.title} className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-sky-500/10 flex items-center justify-center mb-4 text-sky-500 border border-sky-500/15 shadow-[0_0_0_1px_rgba(14,165,233,0.10)]">
                    <Icon size={26} />
                  </div>
                  <h3 className="text-pearl font-black mb-2 tracking-wide">{it.title}</h3>
                  <p className="text-xs text-gray-400">{it.sub}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Shop by collection — Dynamic from DB */}
      {collectionCategories.length > 0 && (
        <section className="lux-section">
          <div className="lux-container">
            <div className="text-center mb-14">
              <p className="text-xs font-semibold tracking-[0.28em] uppercase text-gray-400">
                {stats.totalCategories} catégories disponibles
              </p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-pearl mt-3">
                Nos collections
              </h2>
              <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                Explorez nos gammes de produits organisées par catégorie, directement depuis notre catalogue.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {collectionCategories.map((cat) => (
                <Link
                  to={`/produits?categorie=${encodeURIComponent(cat.nom)}`}
                  key={cat.nom}
                  className="group relative overflow-hidden rounded-xl2 border border-white/10 bg-white/[0.03] shadow-soft"
                >
                  <div className="absolute inset-0">
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.nom}
                        className="h-full w-full object-cover opacity-55 group-hover:opacity-70 group-hover:scale-[1.03] transition-all duration-700"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-[#0ea5e9]/40 via-ink/60 to-ink" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
                  </div>
                  <div className="relative z-10 p-8 min-h-[340px] flex flex-col justify-end">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm text-[10px] font-bold text-white/70 uppercase tracking-widest border border-white/10">
                        <Package size={12} />
                        {cat.product_count} produit{cat.product_count !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-pearl mt-1">{cat.nom}</h3>
                    {cat.description && (
                      <p className="text-sm text-gray-300/70 mt-2 line-clamp-2">{cat.description}</p>
                    )}
                    <span className="mt-5 inline-flex items-center gap-2 text-sky-500 text-xs font-semibold tracking-[0.18em] uppercase">
                      Explorer <span aria-hidden>→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured products — Dynamic from DB */}
      <section className="py-20 bg-coal/40 border-t border-white/10">
        <div className="lux-container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <p className="text-xs font-semibold tracking-[0.28em] uppercase text-gray-400">Sélection</p>
              <h2 className="text-3xl md:text-4xl font-black text-pearl mt-3">Nos derniers produits</h2>
              <p className="text-gray-400 mt-2 text-sm">Les ajouts les plus récents à notre catalogue.</p>
            </div>
            <Link
              to="/produits"
              className="lux-pill border border-white/15 bg-white/[0.02] text-pearl hover:bg-white/[0.05] hover:border-sky-500/35 self-start md:self-auto"
            >
              Voir tous les produits
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 lux-card">
              <ShoppingBag size={48} className="mx-auto text-gray-500 mb-4" />
              <h3 className="text-xl font-black text-pearl mb-2">Aucun produit pour le moment</h3>
              <p className="text-gray-400">Les produits ajoutés apparaîtront ici automatiquement.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
