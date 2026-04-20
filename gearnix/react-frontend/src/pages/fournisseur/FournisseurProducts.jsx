import { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { 
  Package, Plus, Filter, Trash2, Edit, X, Search,
  ArrowRight, Image as ImageIcon, Tag, Hash, DollarSign, Layers
} from 'lucide-react';

export default function FournisseurProducts() {
  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduit, setEditingProduit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [formData, setFormData] = useState({
    nom: '', description: '', prix: '', stock: '', categorie: '', image: null
  });

  const [filterCategory, setFilterCategory] = useState('');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchData = async () => {
    try {
      // Fournisseur needs only his products
      const [pRes, cRes] = await Promise.all([
        api.get('/produits'),
        api.get('/admin/categories')
      ]);
      setProduits(pRes.data);
      setCategories(cRes.data);
    } catch (e) { toast.error("Erreur de chargement"); }
  };

  const filteredProduits = useMemo(() => {
    return produits.filter(p => {
       const matchesSearch = p.nom.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
                             p.id.toString().includes(debouncedSearch);
       const matchesCategory = filterCategory === '' || p.categorie === filterCategory;
       return matchesSearch && matchesCategory;
    });
  }, [produits, debouncedSearch, filterCategory]);

  const handleEdit = (p) => {
    setEditingProduit(p);
    setFormData({
      nom: p.nom, description: p.description, prix: p.prix, 
      stock: p.stock, categorie: p.categorie, image: null
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingProduit(null);
    setFormData({ nom: '', description: '', prix: '', stock: '', categorie: '', image: null });
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading(editingProduit ? 'Mise à jour...' : 'Création...');
    
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) data.append(key, formData[key]);
    });
    if (editingProduit) data.append('_method', 'PUT');

    try {
      const url = editingProduit ? `/produits/${editingProduit.id}` : '/produits';
      await api.post(url, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success(editingProduit ? 'Modification réussie' : 'Ajout réussi', { id: loadingToast });
      resetForm();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur', { id: loadingToast });
    }
  };

  const [deleteId, setDeleteId] = useState(null);
  const executeDelete = async () => {
    const loadingToast = toast.loading('Suppression...');
    try {
      await api.delete(`/produits/${deleteId}`);
      toast.success('Retiré du catalogue', { id: loadingToast });
      setDeleteId(null);
      fetchData();
    } catch (e) { toast.error('Erreur', { id: loadingToast }); }
  };

  return (
    <>
      <div className="dash-table-container shadow-2xl rounded-2xl bg-white border border-slate-200 overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-white">
          <div className="section-header">
            <div className="section-title-group">
              <h1 className="section-title">
                <div className="bullet"><Package size={20} /></div>
                Mes Produits
              </h1>
              <p className="section-description">Gérez vos articles en vente sur Gearnix.</p>
            </div>

            <div className="flex items-center gap-4">
               <div className="hidden md:flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-2 border-slate-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#2c767c]/10 transition-all">
                  <span className="text-slate-400"><Search size={16}/></span>
                  <input placeholder="Rechercher..." className="bg-transparent outline-none text-xs w-48 font-medium" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
               </div>

               <div className="relative">
                 <button 
                   onClick={() => setShowFilterMenu(!showFilterMenu)}
                   className={`dash-btn-outline ${filterCategory ? 'border-[#2c767c] text-[#2c767c] bg-[#2c767c]/5' : ''}`}
                 >
                   <Filter size={18}/>
                 </button>
                 
                 {showFilterMenu && (
                   <div className="absolute top-full mt-2 right-0 w-64 bg-white rounded-2xl border border-slate-100 shadow-2xl z-50 p-2 animate-in zoom-in-95">
                      <div className="p-3 border-b border-slate-50 mb-1">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filtrer par catégorie</p>
                      </div>
                      <button 
                        onClick={() => { setFilterCategory(''); setShowFilterMenu(false); }}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${filterCategory === '' ? 'bg-[#2c767c]/10 text-[#2c767c]' : 'hover:bg-slate-50 text-slate-600'}`}
                      >
                         Tous les produits
                      </button>
                      {categories.map(cat => (
                        <button 
                          key={cat.id}
                          onClick={() => { setFilterCategory(cat.nom); setShowFilterMenu(false); }}
                          className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${filterCategory === cat.nom ? 'bg-[#2c767c]/10 text-[#2c767c]' : 'hover:bg-slate-50 text-slate-600'}`}
                        >
                           {cat.nom}
                        </button>
                      ))}
                   </div>
                 )}
               </div>

               <button onClick={() => setShowForm(true)} className="dash-btn">
                 <Plus size={18} /> Mettre en vente
               </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Catégorie</th>
                <th>Prix de vente</th>
                <th>Disponibilité</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProduits.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                  <td>
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shadow-sm shrink-0">
                         {p.image ? (
                           <img src={p.image.startsWith('http') ? p.image : `http://localhost:8000${p.image}`} className="h-full w-full object-cover" loading="lazy" />
                         ) : (
                           <ImageIcon size={20} className="text-slate-400" />
                         )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-[#2c767c] transition-colors">{p.nom}</p>
                        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">#{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest border border-slate-200">
                      {p.categorie || 'General'}
                    </span>
                  </td>
                  <td>
                    <p className="font-black text-slate-900">{parseFloat(p.prix).toFixed(2)} €</p>
                  </td>
                  <td>
                    {p.stock <= 0 ? (
                      <span className="badge-rejected">Rupture</span>
                    ) : (
                      <span className="badge-accepted">{p.stock} en stock</span>
                    )}
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end items-center gap-2">
                      <button onClick={() => handleEdit(p)} className="p-2.5 text-[#2c767c] hover:text-white hover:bg-[#2c767c] rounded-xl shadow-sm border border-slate-100 bg-slate-50 transition-all">
                         <Edit size={16} />
                      </button>
                      <button onClick={() => setDeleteId(p.id)} className="p-2.5 text-red-500 hover:text-white hover:bg-red-500 rounded-xl shadow-sm border border-slate-100 bg-slate-50 transition-all">
                         <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="dash-side-form-container">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              {editingProduit ? 'Modifier l\'article' : 'Proposer un produit'}
            </h2>
            <button onClick={resetForm} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5 flex flex-col h-[calc(100vh-140px)]">
            <div className="flex-1 space-y-5 overflow-y-auto pr-2 custom-scrollbar">
              <label className="block">
                <span className="dash-form-label"><Tag size={14} className="inline mr-2"/> Nom de l'article</span>
                <input required className="dash-input" value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} placeholder="Nom du produit" />
              </label>

              <label className="block">
                <span className="dash-form-label"><Layers size={14} className="inline mr-2"/> Catégorie</span>
                <select required className="dash-input" value={formData.categorie} onChange={e => setFormData({...formData, categorie: e.target.value})}>
                  <option value="">Sélectionner...</option>
                  {categories.map(c => <option key={c.id} value={c.nom}>{c.nom}</option>)}
                </select>
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="dash-form-label"><DollarSign size={14} className="inline mr-2"/> Prix Public (€)</span>
                  <input required type="number" step="0.01" className="dash-input" value={formData.prix} onChange={e => setFormData({...formData, prix: e.target.value})} />
                </label>
                <label className="block">
                  <span className="dash-form-label"><Hash size={14} className="inline mr-2"/> Stock</span>
                  <input required type="number" className="dash-input" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                </label>
              </div>

              <label className="block">
                <span className="dash-form-label">Description technique</span>
                <textarea className="dash-input min-h-[100px] resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Spécifications..." />
              </label>

              <label className="block">
                <span className="dash-form-label"><ImageIcon size={14} className="inline mr-2"/> Photo du produit</span>
                <div className="relative group/img">
                  <input type="file" className="dash-input opacity-0 absolute inset-0 cursor-pointer z-10" onChange={e => setFormData({...formData, image: e.target.files[0]})} />
                  <div className="dash-input h-32 flex flex-col items-center justify-center border-dashed border-2 group-hover/img:border-[#2c767c] transition-colors">
                    <Plus size={24} className="text-slate-300 group-hover/img:text-[#2c767c] mb-2" />
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Importer une image</p>
                    {formData.image && <p className="mt-2 text-[10px] text-[#2c767c] font-black">{formData.image.name}</p>}
                  </div>
                </div>
              </label>
            </div>
            <div className="pt-6 border-t border-slate-100 flex gap-3">
              <button type="button" onClick={resetForm} className="dash-btn-outline flex-1">Retour</button>
              <button type="submit" className="dash-btn flex-1">
                {editingProduit ? 'Actualiser' : 'Publier'} <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
          </form>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in duration-200">
           <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-200 animate-in zoom-in-95">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-red-100">
                 <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 text-center mb-2 tracking-tight">Supprimer l'article ?</h3>
              <p className="text-slate-500 text-center text-sm font-medium mb-8 leading-relaxed">Cette action supprimera l'offre du magasin. Vous devrez la recréer si vous changez d'avis.</p>
              <div className="flex gap-4">
                 <button onClick={() => setDeleteId(null)} className="dash-btn-outline flex-1 rounded-2xl">Annuler</button>
                 <button onClick={executeDelete} className="dash-btn bg-red-600 hover:bg-red-700 flex-1 rounded-2xl">Confirmer</button>
              </div>
           </div>
        </div>
      )}
    </>
  );
}
