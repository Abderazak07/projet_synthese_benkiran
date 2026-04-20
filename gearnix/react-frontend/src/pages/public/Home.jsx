import { Link } from 'react-router-dom';
import { Truck, RotateCcw, PiggyBank, HeadphonesIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import ProductCard from '../../components/common/ProductCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/produits?limit=6').then(res => {
      setFeaturedProducts(res.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero Section (watch-store like) */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden -mt-16">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&q=80')] bg-cover bg-center opacity-35" />
        <div className="absolute inset-0 bg-lux-hero" />
        <div className="absolute inset-0 opacity-[0.06] bg-lux-grid bg-[size:60px_60px]" />

        <div className="relative z-10 lux-container pt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <p className="text-xs font-semibold tracking-[0.28em] uppercase text-gray-300 mb-4">
                Édition 2026 · Collection premium
              </p>
              <h1 className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tight">
                Upgrade ton
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-copper neon-text">
                  setup gaming
                </span>
              </h1>
              <p className="text-base md:text-lg text-gray-300 mt-6 max-w-xl">
                Une sélection haut de gamme pensée pour la performance, le confort et un rendu esthétique impeccable.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link to="/produits" className="lux-pill glow-btn text-ink font-black">
                  Shop now
                </Link>
                <Link
                  to="/produits"
                  className="lux-pill border border-white/15 bg-white/[0.02] text-pearl hover:bg-white/[0.05] hover:border-gold/35"
                >
                  Voir la collection
                </Link>
              </div>
              <div className="mt-10 h-px w-full lux-hairline" />
              <div className="mt-8 grid grid-cols-2 gap-6 text-sm">
                <div className="lux-card p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-gray-400 mb-2">Nouveautés</p>
                  <p className="font-black text-pearl">Drops chaque semaine</p>
                </div>
                <div className="lux-card p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-gray-400 mb-2">Qualité</p>
                  <p className="font-black text-pearl">Sélection testée</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
                <Link
                  to="/produits"
                  className="md:col-span-6 relative overflow-hidden rounded-xl2 border border-white/10 bg-white/[0.03] shadow-soft group min-h-[280px]"
                >
                  <img
                    src="https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?w=1600&q=80"
                    alt="Collection premium"
                    className="absolute inset-0 h-full w-full object-cover opacity-55 group-hover:opacity-70 group-hover:scale-[1.03] transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/30 to-transparent" />
                  <div className="relative z-10 p-8 md:p-10 max-w-md">
                    <p className="text-xs font-semibold tracking-[0.26em] uppercase text-gray-300 mb-3">Le meilleur du moment</p>
                    <h2 className="text-3xl md:text-4xl font-black leading-tight text-pearl">
                      Découvre la nouvelle
                      <br />
                      édition premium
                    </h2>
                    <span className="mt-6 inline-flex items-center gap-2 text-gold text-sm font-semibold tracking-wide">
                      Shop now <span aria-hidden>→</span>
                    </span>
                  </div>
                </Link>

                {[
                  { label: 'Claviers', value: 'Keyboards', img: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=900&q=80' },
                  { label: 'Souris', value: 'Mice', img: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=900&q=80' },
                  { label: 'Casques', value: 'Headphones', img: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=900&q=80' },
                  { label: 'Manettes', value: 'Controllers', img: 'https://images.unsplash.com/photo-1592839719941-8e2651039d01?w=900&q=80' },
                ].map((cat) => (
                  <Link
                    to={`/produits?categorie=${cat.value}`}
                    key={cat.value}
                    className="md:col-span-3 relative overflow-hidden rounded-xl2 border border-white/10 bg-white/[0.03] shadow-soft group min-h-[170px]"
                  >
                    <img
                      src={cat.img}
                      alt={cat.label}
                      className="absolute inset-0 h-full w-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-[1.05] transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                    <div className="relative z-10 p-6">
                      <p className="text-xs uppercase tracking-[0.22em] text-gray-300">Collection</p>
                      <h3 className="mt-2 text-xl font-black text-pearl">{cat.label}</h3>
                      <span className="mt-4 inline-flex items-center gap-2 text-gold text-xs font-semibold tracking-[0.18em] uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                        Explorer <span aria-hidden>→</span>
                      </span>
                    </div>
                  </Link>
                ))}
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
              { icon: Truck, title: 'Livraison rapide', sub: 'À partir de 100 € d’achat', tone: 'gold' },
              { icon: RotateCcw, title: 'Retour facile', sub: '30 jours satisfait ou remboursé', tone: 'gold' },
              { icon: PiggyBank, title: 'Prix compétitifs', sub: 'Meilleur rapport qualité/prix', tone: 'gold' },
              { icon: HeadphonesIcon, title: 'Support 24/7', sub: 'Une équipe à votre écoute', tone: 'gold' },
            ].map((it) => {
              const Icon = it.icon;
              return (
                <div key={it.title} className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mb-4 text-gold border border-gold/15 shadow-[0_0_0_1px_rgba(214,178,110,0.10)]">
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

      {/* Shop by collection */}
      <section className="lux-section">
        <div className="lux-container">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-[0.28em] uppercase text-gray-400">Watch-style layout, gaming content</p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-pearl mt-3">Shop by collection</h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Des collections pensées comme des “editions” : esthétique, performance et confort.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Women's collection", value: 'Headphones', img: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1200&q=80' },
              { label: 'Smart gear', value: 'Keyboards', img: 'https://images.unsplash.com/photo-1511467687858-23d3ce510e1cb?w=1200&q=80' },
              { label: "Men's collection", value: 'Mice', img: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=1200&q=80' },
            ].map((c) => (
              <Link
                to={`/produits?categorie=${c.value}`}
                key={c.label}
                className="group relative overflow-hidden rounded-xl2 border border-white/10 bg-white/[0.03] shadow-soft"
              >
                <div className="absolute inset-0">
                  <img src={c.img} alt={c.label} className="h-full w-full object-cover opacity-55 group-hover:opacity-70 group-hover:scale-[1.03] transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
                </div>
                <div className="relative z-10 p-8 min-h-[340px] flex flex-col justify-end">
                  <p className="text-xs uppercase tracking-[0.26em] text-gray-300">Collection</p>
                  <h3 className="text-2xl font-black text-pearl mt-2">{c.label}</h3>
                  <span className="mt-5 inline-flex items-center gap-2 text-gold text-xs font-semibold tracking-[0.18em] uppercase">
                    Shop now <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="py-20 bg-coal/40 border-t border-white/10">
        <div className="lux-container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <p className="text-xs font-semibold tracking-[0.28em] uppercase text-gray-400">Sélection</p>
              <h2 className="text-3xl md:text-4xl font-black text-pearl mt-3">Nos meilleurs produits</h2>
            </div>
            <Link
              to="/produits"
              className="lux-pill border border-white/15 bg-white/[0.02] text-pearl hover:bg-white/[0.05] hover:border-gold/35 self-start md:self-auto"
            >
              Voir tous les produits
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
