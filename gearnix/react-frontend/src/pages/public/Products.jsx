import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import ProductCard from '../../components/common/ProductCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Search, Filter } from 'lucide-react';
import Button from '../../components/ui/Button';

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
    <div className="lux-container py-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl2 border border-white/10 bg-white/[0.03] shadow-soft mb-10">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?w=1600&q=80')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/60 to-transparent" />
        <div className="relative z-10 p-8 md:p-10">
          <p className="text-xs font-semibold tracking-[0.28em] uppercase text-gray-300">Catalogue</p>
          <h1 className="text-3xl md:text-5xl font-black mt-3 text-pearl">Équipements gaming</h1>
          <p className="text-gray-400 mt-4 max-w-2xl">
            Trouvez le meilleur équipement pour votre setup. Filtrez par collection et recherchez en temps réel.
          </p>
        </div>
      </div>

      {/* Top filters bar */}
      <div className="lux-card p-5 md:p-6 mb-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-xs font-black tracking-[0.26em] uppercase flex items-center gap-2 text-pearl">
              <Filter size={16} className="text-sky-500" /> Filtres
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setSelectedCat('');
              }}
            >
              Réinitialiser
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-7 relative">
              {/* Search bar removed as per request */}
            </div>

            <div className="md:col-span-5">
              <select
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-pearl focus:outline-none focus:border-sky-500/40 focus:ring-1 focus:ring-sky-500/30"
              >
                <option className="bg-graphite text-pearl" value="">
                  Toutes les collections
                </option>
                {categories.map((cat) => (
                  <option key={cat} className="bg-graphite text-pearl" value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products grid */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-400">
              {products.length} {products.length === 1 ? 'produit trouvé' : 'produits trouvés'}
            </div>
            <div className="text-xs text-gray-500 tracking-[0.22em] uppercase">
              {selectedCat ? `Collection: ${selectedCat}` : 'Toutes les collections'}
            </div>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20 bg-white/[0.03] rounded-xl2 border border-white/10">
              <h3 className="text-xl font-black text-pearl mb-2 tracking-wide">Aucun produit trouvé</h3>
              <p className="text-gray-400">Essayez de modifier vos filtres.</p>
              <div className="mt-6 flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCat('');
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
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
  );
}
