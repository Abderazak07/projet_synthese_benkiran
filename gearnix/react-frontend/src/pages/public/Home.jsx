import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import api, { API_URL } from '../../services/api';
import ProductCard from '../../components/common/ProductCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/homepage')
      .then(res => setData(res.data))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><LoadingSpinner /></div>;

  const featuredProducts = data?.featuredProducts || [];
  const categories = data?.categories || [];

  return (
    <div className="bg-white min-h-screen text-black font-sans selection:bg-black selection:text-white">
      
      {/* 1. PIXEL PERFECT HERO SECTION */}
      <section className="relative w-full h-[90vh] overflow-hidden bg-adi-silver">
        <img 
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2560" 
          alt="Sports Gear" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10" />
        
        <div className="relative z-10 h-full adi-container flex flex-col justify-end pb-32">
          <div className="max-w-3xl text-white">
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-[0.85] mb-8 animate-in slide-in-from-left duration-700">
              LE JEU SANS <br /> CONCESSION
            </h1>
            <p className="text-xl md:text-2xl font-bold uppercase tracking-tight mb-10 max-w-xl animate-in slide-in-from-left duration-1000">
              Découvrez la nouvelle collection Elite Gaming. <br /> Conçue au Maroc, pour les pros.
            </p>
            <div className="flex flex-wrap gap-4 animate-in slide-in-from-left duration-1000">
              <Link to="/produits" className="adi-btn adi-btn-white py-5 px-10 flex items-center gap-4 group">
                ACHETER MAINTENANT <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link to="/produits" className="adi-btn bg-transparent text-white border-white hover:bg-white hover:text-black py-5 px-10 flex items-center gap-4 group">
                VOIR LES OFFRES <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STILL HOT / TRENDING SLIDER */}
      <section className="py-20 md:py-32">
        <div className="adi-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-5xl font-black italic tracking-tighter mb-2">QUOI DE NEUF ?</h2>
              <p className="text-sm font-bold text-adi-gray uppercase tracking-widest italic">LES DERNIERS ARRIVAGES CHEZ GEARNIX MAROC</p>
            </div>
            <div className="flex items-center gap-4 border-b-4 border-black pb-4 self-start md:self-auto">
               <Link to="/produits" className="text-sm font-black italic uppercase tracking-widest hover:bg-black hover:text-white px-2">Voir Tout</Link>
               <div className="flex gap-2">
                 <button className="p-2 border border-adi-silver hover:border-black"><ChevronLeft size={20}/></button>
                 <button className="p-2 border border-adi-silver hover:border-black"><ChevronRight size={20}/></button>
               </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-1 border-t border-l border-adi-silver">
            {featuredProducts.length > 0 ? featuredProducts.slice(0, 4).map(product => (
              <div key={product.id} className="border-r border-b border-adi-silver">
                <ProductCard product={product} />
              </div>
            )) : Array(4).fill(0).map((_, i) => (
              <div key={i} className="aspect-square bg-adi-silver border-r border-b border-adi-silver animate-pulse" />
            ))}
          </div>
        </div>
      </section>

      {/* 3. ADIDAS STYLE "MUST HAVES" GRID (Split layout) */}
      <section className="py-20 bg-adi-silver">
        <div className="adi-container">
          <h2 className="text-5xl font-black italic tracking-tighter mb-12">MUST HAVES</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            
            {/* Massive Promo 1 */}
            <div className="group relative aspect-[16/9] overflow-hidden bg-black">
              <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80" alt="" />
              <div className="absolute inset-x-10 bottom-10">
                <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4">PERFORMANCE ULTIME</h3>
                <Link to="/produits" className="adi-btn adi-btn-white py-3 px-8 text-xs">DÉCOUVRIR</Link>
              </div>
            </div>

            {/* Massive Promo 2 */}
            <div className="group relative aspect-[16/9] overflow-hidden bg-black">
              <img src="https://images.unsplash.com/photo-1629429464245-4874dd394881?q=80&w=1200" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80" alt="" />
              <div className="absolute inset-x-10 bottom-10">
                <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4">STYLE GAMING</h3>
                <Link to="/produits" className="adi-btn adi-btn-white py-3 px-8 text-xs">VOIR LA COLLECTION</Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. STORY SECTION (History) */}
      <section className="py-32">
        <div className="adi-container grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 relative aspect-video group overflow-hidden">
             <img src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1500" className="w-full h-full object-cover grayscale brightness-50 group-hover:scale-105 transition-transform duration-1000" alt="" />
             <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white transition-all group">
                  <Play className="text-white fill-white group-hover:text-black group-hover:fill-black transition-all ml-1" size={32} />
                </button>
             </div>
          </div>
          <div className="lg:col-span-5">
             <h4 className="text-xl font-bold uppercase italic text-adi-gray mb-4 tracking-widest">NOTRE HISTOIRE</h4>
             <h2 className="text-6xl font-black italic tracking-tighter uppercase leading-[0.9] mb-8">TOUJOURS EN <br /> MOUVEMENT</h2>
             <p className="text-lg font-bold text-black/70 mb-10 leading-snug">
               Depuis notre création, Gearnix s'est donné pour mission d'équiper les meilleurs gamers du Maroc avec des technologies de pointe. Nous ne nous arrêtons jamais de innover.
             </p>
             <Link to="/about" className="adi-btn adi-btn-black py-4 px-12 group">
                LIRE LA SUITE <ArrowRight size={20} className="ml-4 group-hover:translate-x-2 transition-transform" />
             </Link>
          </div>
        </div>
      </section>

      {/* 5. LOCALIZATION BANNER (Gearnix Maroc Special) */}
      <section className="bg-black py-20 text-white text-center">
        <div className="adi-container max-w-4xl">
           <h2 className="text-5xl font-black italic tracking-tighter mb-6 uppercase">PARTAGEZ VOTRE STYLE #GEARNIXMAROC</h2>
           <p className="text-lg font-bold text-white/60 mb-12 italic uppercase tracking-widest">POSTEZ VOTRE SETUP SUR INSTAGRAM POUR TENTER DE GAGNER UN PACK ELITE TOUS LES MOIS.</p>
           <div className="flex justify-center gap-6">
              <Link to="/register" className="adi-btn adi-btn-white">REJOINDRE LE CLUB</Link>
           </div>
        </div>
      </section>

    </div>
  );
}
