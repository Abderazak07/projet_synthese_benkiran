import { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { 
  Package, Plus, Search, Filter, Trash2, Edit, X, 
  ArrowRight, Image as ImageIcon, Tag, Hash, DollarSign, Layers, Check, Clock
} from 'lucide-react';

export default function AdminProducts() {
  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduit, setEditingProduit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkDeleteMode, setBulkDeleteMode] = useState(false);

  const [formData, setFormData] = useState({
    nom: '', description: '', prix: '', stock: '', categorie: '', image: null, image2: null, image3: null, image4: null
  });

  const [filterCategory, setFilterCategory] = useState('');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  useEffect(() => {
    fetchData();
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchData = async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        api.get('/admin/produits'),
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
      stock: p.stock, categorie: p.categorie, image: null, image2: null, image3: null, image4: null
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingProduit(null);
    setFormData({ nom: '', description: '', prix: '', stock: '', categorie: '', image: null, image2: null, image3: null, image4: null });
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
      toast.success(editingProduit ? 'Produit modifié' : 'Produit ajouté', { id: loadingToast });
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
      toast.success('Produit supprimé', { id: loadingToast });
      setDeleteId(null);
      fetchData();
    } catch (e) { toast.error('Erreur', { id: loadingToast }); }
  };

  const toggleSelectProduct = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredProduits.length) {
      setSelectedIds(new Set());
    } else {
      const allIds = new Set(filteredProduits.map(p => p.id));
      setSelectedIds(allIds);
    }
  };

  const executeBulkDelete = async () => {
    const loadingToast = toast.loading('Suppression en cours...');
    try {
      await Promise.all(Array.from(selectedIds).map(id => api.delete(`/produits/${id}`)));
      toast.success(`${selectedIds.size} produit(s) supprimé(s)`, { id: loadingToast });
      setSelectedIds(new Set());
      setBulkDeleteMode(false);
      fetchData();
    } catch (e) { 
      toast.error('Erreur lors de la suppression', { id: loadingToast }); 
    }
  };

  const approveProduit = async (id) => {
    const loadingToast = toast.loading('Approbation en cours...');
    try {
      await api.put(`/admin/produits/${id}/approve`);
      toast.success('Produit approuvé et publié!', { id: loadingToast });
      fetchData();
    } catch (e) { toast.error('Erreur lors de l\'approbation', { id: loadingToast }); }
  };

  const rejectProduit = async (id) => {
    const loadingToast = toast.loading('Rejet en cours...');
    try {
      await api.delete(`/admin/produits/${id}/reject`);
      toast.success('Produit rejeté', { id: loadingToast });
      fetchData();
    } catch (e) { toast.error('Erreur lors du rejet', { id: loadingToast }); }
  };

  return (
    <>
      <div className="dash-table-container shadow-2xl rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden">
        {/* Header Section */}
        <div className="p-8 border-b border-white/5 bg-white/[0.03]">
          <div className="section-header">
            <div className="section-title-group">
              <h1 className="section-title">
                <div className="bullet"><Package size={20} /></div>
                Catalogue Produits
              </h1>
              <p className="section-description">
                {filteredProduits.length} articles · 
                <span className="ml-2 font-bold text-amber-600">{filteredProduits.filter(p => !p.is_approved).length} en attente d'approbation</span>
              </p>
            </div>

            <div className="flex items-center gap-4">
               {/* Filter Button with Dropdown */}
               <div className="relative">
                 <button 
                   onClick={() => setShowFilterMenu(!showFilterMenu)}
                   className={`dash-btn-outline ${filterCategory ? 'border-[#0ea5e9] text-[#0ea5e9] bg-[#0ea5e9]/5' : ''}`}
                 >
                   <Filter size={18}/>
                   {filterCategory && <span className="ml-2 text-[10px] font-black uppercase tracking-widest">{filterCategory}</span>}
                 </button>
                 
                 {showFilterMenu && (
                   <div className="absolute top-full mt-2 right-0 w-64 bg-white/[0.03] rounded-2xl border border-white/5 shadow-2xl z-50 p-2 animate-in zoom-in-95">
                      <div className="p-3 border-b border-white/[0.03] mb-1">
                         <p className="text-[10px] font-black text-pearl/40 uppercase tracking-widest">Filtrer par catégorie</p>
                      </div>
                      <button 
                        onClick={() => { setFilterCategory(''); setShowFilterMenu(false); }}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${filterCategory === '' ? 'bg-[#0ea5e9]/10 text-[#0ea5e9]' : 'hover:bg-white/[0.04] text-pearl/60'}`}
                      >
                         Tous les produits
                      </button>
                      {categories.map(cat => (
                        <button 
                          key={cat.id}
                          onClick={() => { setFilterCategory(cat.nom); setShowFilterMenu(false); }}
                          className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${filterCategory === cat.nom ? 'bg-[#0ea5e9]/10 text-[#0ea5e9]' : 'hover:bg-white/[0.04] text-pearl/60'}`}
                        >
                           {cat.nom}
                        </button>
                      ))}
                   </div>
                 )}
               </div>

               {selectedIds.size > 0 && (
                 <button
                   onClick={() => setBulkDeleteMode(true)}
                   className="dash-btn bg-red-600 hover:bg-red-700 hover:shadow-red-600/20"
                 >
                   <Trash2 size={18} /> Supprimer ({selectedIds.size})
                 </button>
               )}

               <button onClick={() => setShowForm(true)} className="dash-btn">
                 <Plus size={18} /> Ajouter un produit
               </button>
            </div>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="dash-table">
            <thead>
              <tr>
                <th className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === filteredProduits.length && filteredProduits.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-white/20 bg-white/[0.05] text-[#0ea5e9] focus:ring-[#0ea5e9] focus:ring-2"
                  />
                </th>
                <th>Produit</th>
                <th>Catégorie</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>Statut</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProduits.map(p => (
                <tr key={p.id} className={`hover:bg-white/[0.04] transition-colors group ${selectedIds.has(p.id) ? 'bg-[#0ea5e9]/5' : ''}`}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(p.id)}
                      onChange={() => toggleSelectProduct(p.id)}
                      className="rounded border-white/20 bg-white/[0.05] text-[#0ea5e9] focus:ring-[#0ea5e9] focus:ring-2"
                    />
                  </td>
                  <td>
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-white/[0.05] flex items-center justify-center overflow-hidden border border-white/10 shadow-sm shrink-0">
                         {p.image ? (
                           <img src={p.image.startsWith('http') ? p.image : `http://localhost:8000${p.image}`} className="h-full w-full object-cover" loading="lazy" />
                         ) : (
                           <ImageIcon size={20} className="text-pearl/40" />
                         )}
                      </div>
                      <div>
                        <p className="font-bold text-white group-hover:text-[#0ea5e9] transition-colors">{p.nom}</p>
                        <p className="text-[10px] font-mono text-pearl/40 uppercase tracking-widest mt-0.5">#{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="px-3 py-1 rounded-full bg-[#0ea5e9]/10 text-[#0ea5e9] text-[10px] font-black uppercase tracking-widest border border-[#0ea5e9]/20">
                      {p.categorie || 'SANS CATEGORIE'}
                    </span>
                  </td>
                  <td>
                    <p className="font-black text-white">{parseFloat(p.prix).toFixed(2)} €</p>
                  </td>
                  <td>
                    {p.stock <= 0 ? (
                      <span className="badge-rejected">Rupture</span>
                    ) : p.stock <= 5 ? (
                      <span className="badge-new">Critique ({p.stock})</span>
                    ) : (
                      <span className="badge-accepted">{p.stock} unités</span>
                    )}
                  </td>
                  <td>
                    {p.is_approved ? (
                      <span className="badge-accepted flex items-center gap-1"><Check size={14} /> Approuvé</span>
                    ) : (
                      <span className="badge-review flex items-center gap-1"><Clock size={14} /> En attente</span>
                    )}
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end items-center gap-2">
                      {!p.is_approved ? (
                        <>
                          <button onClick={() => approveProduit(p.id)} className="p-2.5 text-emerald-600 hover:text-white hover:bg-emerald-600 rounded-xl transition-all shadow-sm border border-white/5 bg-white/[0.04] tooltip" title="Approuver">
                            <Check size={16} />
                          </button>
                          <button onClick={() => rejectProduit(p.id)} className="p-2.5 text-red-500 hover:text-white hover:bg-red-500 rounded-xl transition-all shadow-sm border border-white/5 bg-white/[0.04] tooltip" title="Rejeter">
                            <Trash2 size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEdit(p)} className="p-2.5 text-[#0ea5e9] hover:text-white hover:bg-[#0ea5e9] rounded-xl transition-all shadow-sm border border-white/5 bg-white/[0.04]">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => setDeleteId(p.id)} className="p-2.5 text-red-500 hover:text-white hover:bg-red-500 rounded-xl transition-all shadow-sm border border-white/5 bg-white/[0.04]">
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side Form Container - Exactement comme le design de référence */}
      {showForm && (
        <div className="dash-side-form-container">
          <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <h2 className="text-lg font-black text-white tracking-tight">
              {editingProduit ? 'Modifier Produit' : 'Nouveau Produit'}
            </h2>
            <button onClick={resetForm} className="p-2 text-pearl/40 hover:text-red-500 transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5 flex flex-col h-full">
            <div className="flex-1 space-y-5 overflow-y-auto pr-2 custom-scrollbar">
              <label className="block">
                <span className="dash-form-label"><Tag size={14} className="inline mr-2"/> Nom du produit</span>
                <input required className="dash-input" value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} placeholder="Ex: Souris Gaming RGB" />
              </label>

              <label className="block">
                <span className="dash-form-label"><Layers size={14} className="inline mr-2"/> Catégorie</span>
                <select required className="dash-input" value={formData.categorie} onChange={e => setFormData({...formData, categorie: e.target.value})}>
                  <option value="">Choisir...</option>
                  {categories.map(c => <option key={c.id} value={c.nom}>{c.nom}</option>)}
                </select>
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="dash-form-label"><DollarSign size={14} className="inline mr-2"/> Prix (€)</span>
                  <input required type="number" step="0.01" className="dash-input" value={formData.prix} onChange={e => setFormData({...formData, prix: e.target.value})} />
                </label>
                <label className="block">
                  <span className="dash-form-label"><Hash size={14} className="inline mr-2"/> Stock</span>
                  <input required type="number" className="dash-input" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                </label>
              </div>

              <label className="block">
                <span className="dash-form-label">Description</span>
                <textarea className="dash-input min-h-[100px] resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Détails du produit..." />
              </label>

              <label className="block">
                <span className="dash-form-label"><ImageIcon size={14} className="inline mr-2"/> Images du produit (4 images)</span>
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((num) => {
                    const fieldName = num === 1 ? 'image' : `image${num}`;
                    return (
                      <div key={num} className="relative group/img">
                        <input 
                          type="file" 
                          className="dash-input opacity-0 absolute inset-0 cursor-pointer z-10" 
                          onChange={e => setFormData({...formData, [fieldName]: e.target.files[0]})} 
                        />
                        <div className="dash-input h-32 flex flex-col items-center justify-center border-dashed border-2 group-hover/img:border-[#0ea5e9] transition-colors">
                          <Plus size={20} className="text-slate-300 group-hover/img:text-[#0ea5e9] mb-1" />
                          <p className="text-[9px] text-pearl/40 font-bold uppercase tracking-widest">Image {num}</p>
                          {formData[fieldName] && <p className="mt-2 text-[8px] text-emerald-400 font-bold text-center truncate px-1">{formData[fieldName].name}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </label>
            </div>

            <div className="pt-6 border-t border-white/5 flex gap-3">
              <button type="button" onClick={resetForm} className="dash-btn-outline flex-1">Annuler</button>
              <button type="submit" className="dash-btn flex-1">
                {editingProduit ? 'Sauvegarder' : 'Ajouter'} <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Confirmation Modal (Custom alert style) */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in duration-200">
           <div className="bg-[#12121a] rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-white/10 animate-in zoom-in-95">
              <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-red-500/20">
                 <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-black text-white text-center mb-2 tracking-tight">Supprimer le produit ?</h3>
              <p className="text-gray-400 text-center text-sm font-medium mb-8 leading-relaxed">Cette action est irréversible. Le produit sera définitivement retiré du catalogue.</p>
              <div className="flex gap-4">
                 <button onClick={() => setDeleteId(null)} className="dash-btn-outline flex-1 rounded-2xl">Non, annuler</button>
                 <button onClick={executeDelete} className="dash-btn bg-red-600 hover:bg-red-700 hover:shadow-red-600/20 flex-1 rounded-2xl">Oui, supprimer</button>
              </div>
           </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {bulkDeleteMode && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in duration-200">
           <div className="bg-[#12121a] rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-white/10 animate-in zoom-in-95">
              <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-red-500/20">
                 <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-black text-white text-center mb-2 tracking-tight">Supprimer {selectedIds.size} produit(s) ?</h3>
              <p className="text-gray-400 text-center text-sm font-medium mb-8 leading-relaxed">Cette action est irréversible. Les produits sélectionnés seront définitivement retirés du catalogue.</p>
              <div className="flex gap-4">
                 <button onClick={() => { setBulkDeleteMode(false); setSelectedIds(new Set()); }} className="dash-btn-outline flex-1 rounded-2xl">Non, annuler</button>
                 <button onClick={executeBulkDelete} className="dash-btn bg-red-600 hover:bg-red-700 hover:shadow-red-600/20 flex-1 rounded-2xl">Oui, supprimer</button>
              </div>
           </div>
        </div>
      )}
    </>
  );
}
