import { useState, useEffect } from 'react';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import { Edit, Trash2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [nom, setNom] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    api.get('/admin/categories').then(res => setCategories(res.data)).catch(() => {});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, { nom });
        toast.success('Catégorie mise à jour');
      } else {
        await api.post('/categories', { nom });
        toast.success('Catégorie ajoutée');
      }
      setNom('');
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      toast.error('Impossible d’enregistrer la catégorie');
    }
  };

  const handleEdit = (index) => {
    setEditingId(index.id);
    setNom(index.nom);
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette catégorie ?')) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Catégorie supprimée');
      fetchCategories();
    } catch (err) {
      toast.error('Impossible de supprimer la catégorie');
    }
  };

  return (
    <div className="space-y-6">
      <div className="dash-card p-6">
        <div className="mb-4">
          <h1 className="dash-title">Catégories</h1>
          <p className="dash-muted text-sm">Ajoutez, modifiez ou supprimez les catégories disponibles pour les produits.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-[1fr_auto] items-end">
          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-semibold">Nom de la catégorie</span>
            <input
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Ex : Claviers"
              required
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2f7a78]/20 focus:border-[#2f7a78]"
            />
          </label>
          <button type="submit" className="w-full md:w-auto dash-btn">
            <Plus size={16} /> {editingId ? 'Mettre à jour' : 'Ajouter'}
          </button>
        </form>
      </div>

      <div className="dash-card p-0 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-slate-600 text-xs font-semibold uppercase tracking-wider">ID</th>
              <th className="p-4 text-slate-600 text-xs font-semibold uppercase tracking-wider">Nom</th>
              <th className="p-4 text-slate-600 text-xs font-semibold uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {categories.length === 0 ? (
              <tr>
                <td colSpan="3" className="py-10 text-center text-slate-500">Aucune catégorie trouvée.</td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id ?? category.nom} className="hover:bg-slate-50">
                  <td className="p-4 text-slate-700 font-semibold">#{category.id ?? '-'}</td>
                  <td className="p-4 text-slate-900 font-semibold">{category.nom ?? category}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => handleEdit(category)} className="dash-btn-ghost">
                      <Edit size={14} /> Modifier
                    </button>
                    <button type="button" onClick={() => handleDelete(category.id)} className="dash-btn-ghost border-red-200 text-red-700 hover:bg-red-50">
                      <Trash2 size={14} /> Supprimer
                    </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
