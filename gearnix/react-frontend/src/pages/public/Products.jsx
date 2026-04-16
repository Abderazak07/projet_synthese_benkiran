import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import ProductCard from '../../components/common/ProductCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Search, Filter } from 'lucide-react';

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState(params.get('search') || '');
  const [selectedCat, setSelectedCat] = useState(params.get('categorie') || '');

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams();
    if (selectedCat) query.append('categorie', selectedCat);
    if (searchTerm) query.append('search', searchTerm);
    
    setParams(query);
    
    api.get(`/produits?${query.toString()}`).then(res => {
      setProducts(res.data);
    }).finally(() => setLoading(false));
  }, [selectedCat, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2 uppercase">Collectibles & Gears</h1>
        <p className="text-gray-400">Find the perfect weapon for your setup.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="glass-card p-6 sticky top-24">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Filter size={18} className="text-primary"/> Filters
            </h3>
            
            <div className="mb-6 relative">
              <input 
                type="text" 
                placeholder="Rechercher..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary text-white placeholder-gray-500"
              />
              <Search size={16} className="absolute left-3 top-2.5 text-gray-500" />
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Categories</h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => setSelectedCat('')}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${selectedCat === '' ? 'bg-primary/20 text-white font-medium border border-primary/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                  >
                    All Products
                  </button>
                </li>
                {categories.map((cat, i) => (
                  <li key={i}>
                    <button 
                      onClick={() => setSelectedCat(cat)}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${selectedCat === cat ? 'bg-primary/20 text-white font-medium border border-primary/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-400">
                {products.length} {products.length === 1 ? 'produit trouvé' : 'produits trouvés'}
              </div>
              
              {products.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-2">Aucun produit trouvé</h3>
                  <p className="text-gray-400">Essayez de modifier vos filtres.</p>
                  <button onClick={() => {setSearchTerm(''); setSelectedCat('');}} className="mt-4 text-primary hover:text-accent">Réinitialiser les filtres</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
