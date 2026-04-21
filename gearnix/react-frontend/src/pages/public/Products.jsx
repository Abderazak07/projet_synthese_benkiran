import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../services/api';
import ProductCard from '../../components/common/ProductCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Search, ChevronDown, ListFilter } from 'lucide-react';

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState(params.get('search') || '');
  const [selectedCat, setSelectedCat] = useState(params.get('categorie') || '');

  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(Array.isArray(res.data) ? res.data : []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (selectedCat) query.append('categorie', selectedCat);
        if (searchTerm) query.append('search', searchTerm);
        setParams(query, { replace: true });

        const res = await api.get(`/produits?${query.toString()}`);
        if (isMounted) setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        if (isMounted) setProducts([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProducts();
    return () => { isMounted = false; };
  }, [selectedCat, searchTerm]);

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCat('');
  };

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">

      {/* Category Header Bar */}
      <div className="bg-white border-b border-adi-silver py-8 mb-8 sticky top-[80px] z-40">
        <div className="adi-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <nav className="flex items-center gap-2 text-[10px] font-black uppercase text-adi-gray italic mb-2 tracking-widest">
                <Link to="/" className="hover:text-black transition-all">Accueil</Link>
                <span>/</span>
                <span className="text-black">Equipement Gaming</span>
              </nav>
              <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">
                {selectedCat || 'TOUT LE CATALOGUE'} <span className="text-adi-gray font-bold text-2xl">[{products.length}]</span>
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`adi-btn flex items-center gap-3 text-[10px] py-4 px-8 border-2 transition-all ${showFilters ? 'bg-black text-white border-black' : 'bg-white text-black border-adi-silver hover:border-black'}`}
              >
                FILTRER <ListFilter size={16} />
              </button>
              <div className="relative group hidden md:block">
                <select className="adi-btn bg-white text-black border-adi-silver hover:border-black text-[10px] py-4 pl-8 pr-12 appearance-none border-2 outline-none font-black uppercase italic tracking-widest cursor-pointer">
                  <option>TRIER PAR : NOUVEAUTÉS</option>
                  <option>PRIX (CROISSANT)</option>
                  <option>PRIX (DÉCROISSANT)</option>
                </select>
                <ChevronDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="adi-container">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Sidebar Filters - Desktop */}
          {showFilters && (
            <aside className="w-full lg:w-72 space-y-12 animate-in slide-in-from-left duration-500">
              {/* Category Filter */}
              <div>
                <h3 className="text-xs font-black uppercase italic tracking-[0.2em] border-b-2 border-black pb-4 mb-6">Collections</h3>
                <div className="flex flex-col">
                  <button
                    onClick={() => setSelectedCat('')}
                    className={`text-left text-[11px] font-black uppercase tracking-widest py-4 border-b border-adi-silver hover:bg-adi-silver transition-all px-4 ${!selectedCat ? 'bg-black text-white border-black' : 'text-black'}`}
                  >
                    Voir tout le stock
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.nom || cat}
                      onClick={() => setSelectedCat(cat.nom || cat)}
                      className={`text-left text-[11px] font-black uppercase tracking-widest py-4 border-b border-adi-silver hover:bg-adi-silver transition-all px-4 ${selectedCat === (cat.nom || cat) ? 'bg-black text-white border-black' : 'text-black'}`}
                    >
                      {cat.nom || cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range placeholder */}
              <div>
                <h3 className="text-xs font-black uppercase italic tracking-[0.2em] border-b-2 border-black pb-4 mb-6">Gamme de Prix</h3>
                <div className="flex flex-col gap-4">
                  {[
                    { label: 'Entrée de gamme (0€-50€)', count: 12 },
                    { label: 'Performance (50€-200€)', count: 45 },
                    { label: 'Elite (200€+)', count: 8 }
                  ].map((range, i) => (
                    <label key={i} className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center gap-4">
                         <div className="w-5 h-5 border-2 border-adi-silver group-hover:border-black transition-all flex items-center justify-center">
                            <div className="w-2.5 h-2.5 bg-black scale-0 group-hover:scale-100 transition-transform" />
                         </div>
                         <span className="text-[10px] font-bold uppercase tracking-tight text-adi-gray group-hover:text-black transition-colors">{range.label}</span>
                      </div>
                      <span className="text-[9px] font-black text-adi-silver group-hover:text-black transition-colors">({range.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-4 border-2 border-black text-[10px] font-black uppercase italic hover:bg-black hover:text-white transition-all shadow-xl bg-white"
              >
                RÉINITIALISER LES FILTRES
              </button>
            </aside>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="py-32 flex items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-40 bg-adi-silver border-2 border-dashed border-adi-gray/20">
                <Search size={64} className="mx-auto mb-8 text-adi-gray opacity-20" />
                <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4">AUCUN RÉSULTAT</h2>
                <p className="text-xs font-black text-adi-gray uppercase tracking-widest mb-10 italic">Nous n'avons pas trouvé de produits correspondant à vos critères.</p>
                <button onClick={handleReset} className="adi-btn adi-btn-black px-12">RÉINITIALISER</button>
              </div>
            ) : (
              <div className={`grid grid-cols-2 md:grid-cols-3 ${showFilters ? 'xl:grid-cols-3' : 'xl:grid-cols-4'} gap-1 border-t border-l border-adi-silver`}>
                {products.map(product => (
                  <div key={product.id} className="border-r border-b border-adi-silver">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
