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
    <div className="space-y-8">
      <div className="glass-card p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-primary/70">Catégories</p>
            <h1 className="text-3xl font-black">Gestion des catégories</h1>
            <p className="text-gray-400 mt-2">Ajoutez, modifiez ou supprimez les catégories disponibles pour les produits.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-[1fr_auto] items-end">
          <label className="space-y-2 text-sm text-gray-300">
            <span className="font-semibold">Nom de la catégorie</span>
            <input
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Ex : Claviers"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </label>
          <Button type="submit" className="w-full md:w-auto bg-gradient-to-r from-primary to-accent text-white">
            <Plus size={16} /> {editingId ? 'Mettre à jour' : 'Ajouter'}
          </Button>
        </form>
      </div>

      <div className="glass-card p-6 overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-left text-gray-400 uppercase text-xs tracking-[0.24em]">
              <th className="pb-3">ID</th>
              <th className="pb-3">Nom</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {categories.length === 0 ? (
              <tr>
                <td colSpan="3" className="py-8 text-center text-gray-400">Aucune catégorie trouvée.</td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id ?? category.nom} className="hover:bg-white/5 transition-colors duration-200">
                  <td className="py-4 pr-6 text-gray-300">#{category.id ?? '-'}</td>
                  <td className="py-4 text-white font-medium">{category.nom ?? category}</td>
                  <td className="py-4 text-right flex justify-end gap-2">
                    <button type="button" onClick={() => handleEdit(category)} className="rounded-xl border border-white/10 px-4 py-2 text-sm text-primary hover:bg-white/5 transition">
                      <Edit size={14} /> Modifier
                    </button>
                    <button type="button" onClick={() => handleDelete(category.id)} className="rounded-xl border border-red-500/20 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition">
                      <Trash2 size={14} /> Supprimer
                    </button>
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
