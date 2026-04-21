import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../services/api';
import ProductCard from '../../components/common/ProductCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Search, Filter, X, ChevronDown, ListFilter } from 'lucide-react';

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
      <div className="bg-white border-b border-adi-silver py-6 mb-8">
        <div className="adi-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <nav className="flex items-center gap-2 text-[10px] font-black uppercase text-adi-gray italic mb-2 tracking-widest">
                <Link to="/" className="hover:text-black">Accueil</Link>
                <span>/</span>
                <span className="text-black">Equipement</span>
              </nav>
              <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">
                {selectedCat || 'TOUS LES PRODUITS'} <span className="text-adi-gray font-bold text-2xl">[{products.length}]</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="adi-btn adi-btn-white flex items-center gap-3 text-xs py-3 border-2"
              >
                FILTRER <ListFilter size={16} />
              </button>
              <div className="relative group">
                <select className="adi-btn adi-btn-white text-xs py-3 pr-10 appearance-none border-2">
                  <option>TRIER PAR : NOUVEAUTÉS</option>
                  <option>PRIX (CROISSANT)</option>
                  <option>PRIX (DÉCROISSANT)</option>
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="adi-container">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Sidebar Filters - Desktop */}
          {showFilters && (
            <aside className="w-full lg:w-64 space-y-10 animate-in slide-in-from-left duration-300">
              {/* Category Filter */}
              <div>
                <h3 className="text-sm font-black uppercase italic border-b-2 border-black pb-2 mb-4">Collections</h3>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => setSelectedCat('')}
                    className={`text-left text-xs font-bold uppercase tracking-tight py-2 border-b border-adi-silver hover:bg-adi-silver transition-all px-2 ${!selectedCat ? 'bg-black text-white' : ''}`}
                  >
                    Voir tout
                  </button>
                  {categories.map(cat => (
                    <button 
                      key={cat.nom || cat}
                      onClick={() => setSelectedCat(cat.nom || cat)}
                      className={`text-left text-xs font-bold uppercase tracking-tight py-2 border-b border-adi-silver hover:bg-adi-silver transition-all px-2 ${selectedCat === (cat.nom || cat) ? 'bg-black text-white' : ''}`}
                    >
                      {cat.nom || cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range placeholder */}
              <div>
                <h3 className="text-sm font-black uppercase italic border-b-2 border-black pb-2 mb-4">Prix</h3>
                <div className="flex flex-col gap-2">
                   <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-5 h-5 border-2 border-black rounded-none appearance-none checked:bg-black transition-all" />
                      <span className="text-xs font-bold uppercase">0€ - 50€</span>
                   </label>
                   <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-5 h-5 border-2 border-black rounded-none appearance-none checked:bg-black transition-all" />
                      <span className="text-xs font-bold uppercase">50€ - 200€</span>
                   </label>
                   <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-5 h-5 border-2 border-black rounded-none appearance-none checked:bg-black transition-all" />
                      <span className="text-xs font-bold uppercase">200€+</span>
                   </label>
                </div>
              </div>

              <button 
                onClick={handleReset}
                className="w-full py-3 border-2 border-black text-[10px] font-black uppercase italic hover:bg-black hover:text-white transition-all shadow-none"
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
              <div className="text-center py-32 bg-adi-silver">
                <Search size={48} className="mx-auto mb-6 text-adi-gray" />
                <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-4">AUCUN RÉSULTAT</h2>
                <p className="text-xs font-bold text-adi-gray uppercase mb-8">Essayez d'autres filtres ou recherchez un autre terme.</p>
                <button onClick={handleReset} className="adi-btn adi-btn-black">Voir tout le catalogue</button>
              </div>
            ) : (
              <div className={`grid grid-cols-2 md:grid-cols-3 ${showFilters ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-1 mt-1 border-t border-l border-adi-silver`}>
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
