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
    api.get('/produits').then(res => {
      setFeaturedProducts(res.data.slice(0, 6)); // First 6 products
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden -mt-16">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&q=80')] bg-cover bg-center opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-dark/40 via-dark/80 to-dark"></div>
        
        <div className="relative z-10 text-center max-w-4xl px-4">
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Redefine Your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent neon-text">Gaming Experience</span>
          </h1>
          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
            Engineered for uncompromising performance and unparalleled immersion. Elevate your setup with our elite gear.
          </p>
          <Link to="/produits" className="glow-btn inline-flex items-center justify-center text-white font-bold text-lg px-8 py-4 rounded-full">
            Shop The Collection
          </Link>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform">
                <Truck size={32} />
              </div>
              <h3 className="text-white font-bold mb-2">Free Shipping</h3>
              <p className="text-xs text-gray-400">On all orders over $100</p>
            </div>
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4 text-accent group-hover:scale-110 transition-transform">
                <RotateCcw size={32} />
              </div>
              <h3 className="text-white font-bold mb-2">Return Policy</h3>
              <p className="text-xs text-gray-400">30 days money back</p>
            </div>
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform">
                <PiggyBank size={32} />
              </div>
              <h3 className="text-white font-bold mb-2">Save Money</h3>
              <p className="text-xs text-gray-400">Best prices guaranteed</p>
            </div>
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4 text-accent group-hover:scale-110 transition-transform">
                <HeadphonesIcon size={32} />
              </div>
              <h3 className="text-white font-bold mb-2">Support 24/7</h3>
              <p className="text-xs text-gray-400">We care about you</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-black text-center mb-12 tracking-wide uppercase">Shop By Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Keyboards', img: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500' },
            { name: 'Gaming Mouse', img: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500' },
            { name: 'Headphones', img: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500' },
            { name: 'Controllers', img: 'https://images.unsplash.com/photo-1600000000000-000000000000?w=500' },
          ].map((cat, i) => (
            <Link to={`/produits?categorie=${cat.name}`} key={i} className="group relative h-64 rounded-xl overflow-hidden glass-card">
              <img src={cat.img} alt={cat.name} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay group-hover:scale-110 transition-transform duration-700 opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-darker via-dark/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 w-full translate-y-2 group-hover:translate-y-0 transition-transform">
                <h3 className="text-xl font-bold text-white mb-1">{cat.name}</h3>
                <span className="text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                  Shop Now &rarr;
                </span>
                <div className="w-12 h-1 bg-accent mt-3 opacity-0 group-hover:opacity-100 transition-all shadow-[0_0_10px_#ec4899]"></div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Rated Products */}
      <section className="py-20 bg-darker/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black mb-4 tracking-wide uppercase">Top Rated Products</h2>
            <p className="text-gray-400">Master your battleground with our elite-reviewed gear</p>
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
          
          <div className="text-center mt-12">
            <Link to="/produits" className="inline-block border border-primary/50 text-white px-8 py-3 rounded-full hover:bg-primary/10 transition-colors font-medium">
              View All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
