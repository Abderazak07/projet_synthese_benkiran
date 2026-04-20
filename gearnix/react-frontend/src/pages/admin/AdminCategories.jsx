import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
  Tag, Plus, Trash2, Edit, X, ArrowRight, FolderPlus,
  Hash, Image as ImageIcon, Star, StarOff, GripVertical,
  Eye, EyeOff, Package
} from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    nom: '', description: '', image: null, is_featured: false, display_order: 0
  });

  useEffect(() => { fetchCategories(); }, []);
  const fetchCategories = () => api.get('/admin/categories').then(res => setCategories(res.data));

  const handleEdit = (c) => {
    setEditingCategory(c);
    setFormData({
      nom: c.nom,
      description: c.description || '',
      image: null,
      is_featured: c.is_featured,
      display_order: c.display_order || 0
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({ nom: '', description: '', image: null, is_featured: false, display_order: 0 });
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Enregistrement...');

    const data = new FormData();
    data.append('nom', formData.nom);
    data.append('description', formData.description || '');
    data.append('is_featured', formData.is_featured ? '1' : '0');
    data.append('display_order', formData.display_order);
    if (formData.image) data.append('image', formData.image);

    try {
      if (editingCategory) {
        data.append('_method', 'PUT');
        await api.post(`/categories/${editingCategory.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Collection modifiée', { id: loadingToast });
      } else {
        await api.post('/categories', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Collection ajoutée', { id: loadingToast });
      }
      resetForm();
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur', { id: loadingToast });
    }
  };

  const toggleFeatured = async (id) => {
    try {
      await api.put(`/categories/${id}/featured`);
      fetchCategories();
      toast.success('Statut mis à jour');
    } catch (e) { toast.error('Erreur'); }
  };

  const [deleteId, setDeleteId] = useState(null);
  const executeDelete = async () => {
    const loadingToast = toast.loading('Suppression...');
    try {
      await api.delete(`/categories/${deleteId}`);
      toast.success('Collection supprimée', { id: loadingToast });
      setDeleteId(null);
      fetchCategories();
    } catch (e) { toast.error('Erreur', { id: loadingToast }); }
  };

  const featuredCount = categories.filter(c => c.is_featured).length;

  return (
    <>
      <div className="dash-table-container bg-white/[0.03] rounded-2xl border border-white/[0.07] shadow-xl overflow-hidden">
        <div className="p-8 border-b border-white/5 bg-white/[0.03]">
          <div className="section-header">
            <div className="section-title-group">
              <h1 className="section-title">
                <div className="bullet"><Tag size={20} /></div>
                Collections & Catégories
              </h1>
              <p className="section-description">
                Gérez vos catégories et choisissez celles à afficher sur la page d'accueil.
                <span className="ml-2 inline-flex items-center gap-1 text-sky-400 font-bold">
                  <Star size={12} /> {featuredCount} en vedette
                </span>
              </p>
            </div>
            <button onClick={() => setShowForm(true)} className="dash-btn">
              <Plus size={18} /> Nouvelle Collection
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Ordre</th>
                <th>Collection</th>
                <th>Description</th>
                <th>Produits</th>
                <th>Accueil</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(c => (
                <tr key={c.id} className="hover:bg-white/[0.04] transition-colors group">
                  <td>
                    <span className="inline-flex items-center gap-1 text-pearl/40 font-mono text-xs">
                      <GripVertical size={14} className="text-slate-300" />
                      {c.display_order}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-white/[0.05] flex items-center justify-center overflow-hidden border border-white/10 shadow-sm shrink-0">
                        {c.image ? (
                          <img src={c.image} className="h-full w-full object-cover" loading="lazy" alt={c.nom} />
                        ) : (
                          <Tag size={18} className="text-pearl/40" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-white group-hover:text-[#0ea5e9] transition-colors">{c.nom}</p>
                        <p className="text-[10px] font-mono text-pearl/40 uppercase tracking-widest mt-0.5">#{c.id}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="text-sm text-gray-400 max-w-[200px] truncate">
                      {c.description || <span className="italic text-slate-300">Aucune description</span>}
                    </p>
                  </td>
                  <td>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] text-pearl/60 text-[10px] font-black uppercase tracking-widest border border-white/10">
                      <Package size={12} />
                      {c.product_count ?? 0}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => toggleFeatured(c.id)}
                      className={`p-2.5 rounded-xl transition-all shadow-sm border ${
                        c.is_featured
                          ? 'bg-sky-500/10 text-sky-400 border-sky-200 hover:bg-sky-100'
                          : 'bg-white/[0.04] text-pearl/40 border-white/5 hover:bg-white/[0.05] hover:text-pearl/60'
                      }`}
                      title={c.is_featured ? 'Retirer de l\'accueil' : 'Mettre en vedette'}
                    >
                      {c.is_featured ? <Star size={16} /> : <StarOff size={16} />}
                    </button>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end items-center gap-2">
                      <button onClick={() => handleEdit(c)} className="p-2.5 text-[#0ea5e9] hover:text-white hover:bg-[#0ea5e9] rounded-xl shadow-sm border border-white/5 bg-white/[0.04] transition-all">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => setDeleteId(c.id)} className="p-2.5 text-red-500 hover:text-white hover:bg-red-500 rounded-xl shadow-sm border border-white/5 bg-white/[0.04] transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-pearl/40">
                    <Tag size={32} className="mx-auto mb-3 text-slate-300" />
                    <p className="font-bold">Aucune collection</p>
                    <p className="text-sm mt-1">Créez votre première collection pour commencer.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side Form for Create/Edit */}
      {showForm && (
        <div className="dash-side-form-container">
          <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <h2 className="text-lg font-black text-white tracking-tight">
              {editingCategory ? 'Modifier la collection' : 'Nouvelle collection'}
            </h2>
            <button onClick={resetForm} className="p-2 text-pearl/40 hover:text-red-500 transition-colors">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-5 flex flex-col h-[calc(100vh-140px)]">
            <div className="flex-1 space-y-5 overflow-y-auto pr-2 custom-scrollbar">
              <label className="block">
                <span className="dash-form-label"><FolderPlus size={14} className="inline mr-2"/> Nom de la collection</span>
                <input
                  required
                  className="dash-input"
                  value={formData.nom}
                  onChange={e => setFormData({...formData, nom: e.target.value})}
                  placeholder="Ex: Claviers Gaming"
                />
              </label>

              <label className="block">
                <span className="dash-form-label">Description</span>
                <textarea
                  className="dash-input min-h-[80px] resize-none"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Brève description de la collection..."
                  maxLength={500}
                />
                <p className="text-[10px] text-pearl/40 mt-1 text-right">{(formData.description || '').length}/500</p>
              </label>

              <label className="block">
                <span className="dash-form-label"><ImageIcon size={14} className="inline mr-2"/> Image de couverture</span>
                <div className="relative group/img">
                  <input
                    type="file"
                    accept="image/*"
                    className="dash-input opacity-0 absolute inset-0 cursor-pointer z-10"
                    onChange={e => setFormData({...formData, image: e.target.files[0]})}
                  />
                  <div className="dash-input h-32 flex flex-col items-center justify-center border-dashed border-2 group-hover/img:border-[#0ea5e9] transition-colors">
                    {editingCategory?.image && !formData.image ? (
                      <img src={editingCategory.image} className="h-full w-full object-cover rounded-lg" alt="Current" />
                    ) : (
                      <>
                        <Plus size={24} className="text-slate-300 group-hover/img:text-[#0ea5e9] mb-2" />
                        <p className="text-xs text-pearl/40 font-bold uppercase tracking-widest">
                          {formData.image ? formData.image.name : 'Choisir une image'}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="dash-form-label">Ordre d'affichage</span>
                  <input
                    type="number"
                    className="dash-input"
                    value={formData.display_order}
                    onChange={e => setFormData({...formData, display_order: parseInt(e.target.value) || 0})}
                    min={0}
                  />
                </label>
                <div className="flex flex-col">
                  <span className="dash-form-label">Page d'accueil</span>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, is_featured: !formData.is_featured})}
                    className={`dash-input flex items-center justify-center gap-2 font-bold text-sm transition-all cursor-pointer ${
                      formData.is_featured
                        ? 'bg-sky-500/10 text-sky-700 border-sky-300'
                        : 'bg-white/[0.04] text-gray-400'
                    }`}
                  >
                    {formData.is_featured ? <Star size={16} /> : <StarOff size={16} />}
                    {formData.is_featured ? 'En vedette' : 'Masquée'}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 flex gap-3">
              <button type="button" onClick={resetForm} className="dash-btn-outline flex-1">Annuler</button>
              <button type="submit" className="dash-btn flex-1">
                {editingCategory ? 'Sauvegarder' : 'Créer'} <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in duration-200">
           <div className="bg-[#12121a] rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-white/10 animate-in zoom-in-95">
              <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-red-500/20">
                 <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-black text-white text-center mb-2 tracking-tight">Supprimer la collection ?</h3>
              <p className="text-gray-400 text-center text-sm font-medium mb-8 leading-relaxed">
                Cette opération impactera les produits liés à cette catégorie.
              </p>
              <div className="flex gap-4">
                 <button onClick={() => setDeleteId(null)} className="dash-btn-outline flex-1 rounded-2xl">Annuler</button>
                 <button onClick={executeDelete} className="dash-btn bg-red-600 hover:bg-red-700 flex-1 rounded-2xl">Supprimer</button>
              </div>
           </div>
        </div>
      )}
    </>
  );
}
