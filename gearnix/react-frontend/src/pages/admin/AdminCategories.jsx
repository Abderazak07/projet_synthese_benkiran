import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Tag, Plus, Trash2, Edit, X, ArrowRight, FolderPlus, Hash } from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ nom: '' });

  useEffect(() => { fetchCategories(); }, []);
  const fetchCategories = () => api.get('/admin/categories').then(res => setCategories(res.data));

  const handleEdit = (c) => {
    setEditingCategory(c);
    setFormData({ nom: c.nom });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({ nom: '' });
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Enregistrement...');
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, formData);
        toast.success('Catégorie modifiée', { id: loadingToast });
      } else {
        await api.post('/categories', formData);
        toast.success('Catégorie ajoutée', { id: loadingToast });
      }
      resetForm();
      fetchCategories();
    } catch (err) { toast.error('Erreur', { id: loadingToast }); }
  };

  const [deleteId, setDeleteId] = useState(null);
  const executeDelete = async () => {
    const loadingToast = toast.loading('Suppression...');
    try {
      await api.delete(`/categories/${deleteId}`);
      toast.success('Catégorie supprimée', { id: loadingToast });
      setDeleteId(null);
      fetchCategories();
    } catch (e) { toast.error('Erreur', { id: loadingToast }); }
  };

  return (
    <>
      <div className="dash-table-container bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-white">
          <div className="section-header">
            <div className="section-title-group">
              <h1 className="section-title">
                <div className="bullet"><Tag size={20} /></div>
                Catégories
              </h1>
              <p className="section-description">Gérez les segments de votre catalogue produits.</p>
            </div>
            <button onClick={() => setShowForm(true)} className="dash-btn">
              <Plus size={18} /> Nouvelle Catégorie
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="dash-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom de la catégorie</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="font-mono text-[10px] text-slate-400">#{c.id}</td>
                  <td>
                    <div className="flex items-center gap-3">
                       <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#2c767c]/10 group-hover:text-[#2c767c] transition-all">
                          <Hash size={14} />
                       </div>
                       <p className="font-bold text-slate-900">{c.nom}</p>
                    </div>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end items-center gap-2">
                      <button onClick={() => handleEdit(c)} className="p-2.5 text-[#2c767c] hover:text-white hover:bg-[#2c767c] rounded-xl shadow-sm border border-slate-100 bg-slate-50 transition-all">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => setDeleteId(c.id)} className="p-2.5 text-red-500 hover:text-white hover:bg-red-500 rounded-xl shadow-sm border border-slate-100 bg-slate-50 transition-all">
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
              {editingCategory ? 'Modifier' : 'Nouvelle catégorie'}
            </h2>
            <button onClick={resetForm} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <label className="block">
              <span className="dash-form-label"><FolderPlus size={14} className="inline mr-2"/> Nom de la catégorie</span>
              <input required className="dash-input" value={formData.nom} onChange={e => setFormData({ nom: e.target.value })} placeholder="Ex: Périphériques" />
            </label>
            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button type="button" onClick={resetForm} className="dash-btn-outline flex-1">Annuler</button>
              <button type="submit" className="dash-btn flex-1">
                Confirmer <ArrowRight size={16} className="ml-2" />
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
              <h3 className="text-xl font-black text-slate-900 text-center mb-2 tracking-tight">Supprimer la catégorie ?</h3>
              <p className="text-slate-500 text-center text-sm font-medium mb-8 leading-relaxed">Cette opération impactera les produits liés à cette catégorie.</p>
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
