import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { Edit, Trash2, Plus } from 'lucide-react';

export default function FournisseurProducts() {
  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ nom: '', description: '', prix: 0, stock: 0, categorie: '', imageFile: null });
  const { user } = useAuth();

  useEffect(() => {
    fetchProduits();
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    api.get('/categories').then(res => setCategories(res.data)).catch(() => setCategories([]));
  };

  const fetchProduits = () => {
    api.get('/produits').then(res => {
      // Filtrer les produits pour n'afficher que ceux du fournisseur connecté
      setProduits(res.data.filter(p => p.fournisseur_id === user.id));
    });
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ nom: '', description: '', prix: 0, stock: 0, categorie: '', imageFile: null });
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingId(p.id);
    setFormData({ nom: p.nom, description: p.description || '', prix: p.prix, stock: p.stock, categorie: p.categorie, imageFile: null });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append('nom', formData.nom);
      payload.append('description', formData.description);
      payload.append('prix', formData.prix);
      payload.append('stock', formData.stock);
      payload.append('categorie', formData.categorie);
      if (formData.imageFile) payload.append('image', formData.imageFile);

      if (editingId) {
        await api.put(`/produits/${editingId}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Produit modifié avec succès');
      } else {
        await api.post('/produits', payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Produit ajouté');
      }

      setIsModalOpen(false);
      fetchProduits();
    } catch (err) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      try {
        await api.delete(`/produits/${id}`);
        toast.success('Produit supprimé');
        fetchProduits();
      } catch (err) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="dash-title">Mes produits</h1>
          <p className="dash-muted text-sm">Gérez votre catalogue et mettez à jour les stocks.</p>
        </div>
        <button onClick={openAddModal} className="dash-btn"><Plus size={16}/> Ajouter</button>
      </div>

      <div className="dash-card overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-slate-600 text-xs font-semibold uppercase tracking-wider">Nom</th>
              <th className="p-4 text-slate-600 text-xs font-semibold uppercase tracking-wider">Catégorie</th>
              <th className="p-4 text-slate-600 text-xs font-semibold uppercase tracking-wider">Prix</th>
              <th className="p-4 text-slate-600 text-xs font-semibold uppercase tracking-wider">Stock</th>
              <th className="p-4 text-slate-600 text-xs font-semibold uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {produits.map(p => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="p-4 text-slate-900 font-semibold">{p.nom}</td>
                <td className="p-4 text-slate-600">{p.categorie}</td>
                <td className="p-4 text-slate-900 font-bold">{p.prix} €</td>
                <td className="p-4">
                  <span className={`font-semibold ${p.stock < 10 ? 'text-red-700 bg-red-50 border border-red-200 px-2 py-1 rounded-lg' : 'text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg'}`}>
                    {p.stock}
                  </span>
                </td>
                <td className="p-4 text-right flex justify-end gap-3">
                  <button onClick={() => openEditModal(p)} className="text-slate-600 hover:text-slate-900"><Edit size={16}/></button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-700"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {produits.length === 0 && (
          <p className="text-center p-6 text-slate-500">Vous n'avez pas encore de produits.</p>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="dash-card p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-slate-900">{editingId ? 'Modifier le Produit' : 'Nouveau Produit'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4">
                <label className="space-y-2 text-sm text-slate-700">
                  <span className="font-semibold">Nom du produit</span>
                  <input
                    type="text"
                    placeholder="Nom"
                    required
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2f7a78]/20 focus:border-[#2f7a78]"
                    value={formData.nom}
                    onChange={e => setFormData({...formData, nom: e.target.value})}
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-700">
                  <span className="font-semibold">Description</span>
                  <textarea
                    placeholder="Description"
                    rows="3"
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2f7a78]/20 focus:border-[#2f7a78]"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-700">
                  <span className="font-semibold">Catégorie</span>
                  <select
                    required
                    value={formData.categorie}
                    onChange={e => setFormData({...formData, categorie: e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2f7a78]/20 focus:border-[#2f7a78]"
                  >
                    <option value="" disabled>Choisissez une catégorie</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="space-y-2 text-sm text-slate-700">
                    <span className="font-semibold">Prix (€)</span>
                    <input
                      type="number"
                      placeholder="Prix"
                      required
                      step="0.01"
                      className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2f7a78]/20 focus:border-[#2f7a78]"
                      value={formData.prix}
                      onChange={e => setFormData({...formData, prix: e.target.value})}
                    />
                  </label>

                  <label className="space-y-2 text-sm text-slate-700">
                    <span className="font-semibold">Stock</span>
                    <input
                      type="number"
                      placeholder="Stock"
                      required
                      className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2f7a78]/20 focus:border-[#2f7a78]"
                      value={formData.stock}
                      onChange={e => setFormData({...formData, stock: e.target.value})}
                    />
                  </label>
                </div>

                <label className="space-y-2 text-sm text-slate-700">
                  <span className="font-semibold">Image du produit</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full text-sm text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#2f7a78] file:text-white hover:file:bg-[#2a6c6a] bg-white border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2f7a78]/20"
                    onChange={e => setFormData({...formData, imageFile: e.target.files[0] || null})}
                  />
                  {formData.imageFile && (
                    <p className="text-xs text-slate-500">Fichier sélectionné : {formData.imageFile.name}</p>
                  )}
                </label>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button type="button" className="flex-1 dash-btn-ghost" onClick={() => setIsModalOpen(false)}>
                  Annuler
                </button>
                <button type="submit" className="flex-1 dash-btn">
                  {editingId ? 'Sauvegarder' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
