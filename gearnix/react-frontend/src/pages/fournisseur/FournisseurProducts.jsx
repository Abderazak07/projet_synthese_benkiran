import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { Edit, Trash2, Plus } from 'lucide-react';

export default function FournisseurProducts() {
  const [produits, setProduits] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ nom: '', description: '', prix: 0, stock: 0, categorie: '', image: '' });
  const { user } = useAuth();

  useEffect(() => {
    fetchProduits();
  }, []);

  const fetchProduits = () => {
    api.get('/produits').then(res => {
      // Filtrer les produits pour n'afficher que ceux du fournisseur connecté
      setProduits(res.data.filter(p => p.fournisseur_id === user.id));
    });
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ nom: '', description: '', prix: 0, stock: 0, categorie: '', image: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingId(p.id);
    setFormData({ nom: p.nom, description: p.description || '', prix: p.prix, stock: p.stock, categorie: p.categorie, image: p.image || '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/produits/${editingId}`, formData);
        toast.success('Produit modifié avec succès');
      } else {
        await api.post('/produits', formData);
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
    <div className="p-8 max-w-7xl mx-auto min-h-[70vh]">
      <div className="flex justify-between items-center mb-6">
         <h1 className="text-2xl font-black uppercase text-primary">Mes Produits</h1>
         <Button onClick={openAddModal} className="flex items-center gap-2"><Plus size={16}/> Ajouter un produit</Button>
      </div>

      <div className="glass-card overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="p-4 text-gray-400">Nom</th>
              <th className="p-4 text-gray-400">Catégorie</th>
              <th className="p-4 text-gray-400">Prix</th>
              <th className="p-4 text-gray-400">Stock</th>
              <th className="p-4 text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {produits.map(p => (
              <tr key={p.id} className="hover:bg-white/[0.02]">
                <td className="p-4 text-white font-medium">{p.nom}</td>
                <td className="p-4 text-gray-300">{p.categorie}</td>
                <td className="p-4 text-accent font-bold">{p.prix} €</td>
                <td className="p-4">
                  <span className={`font-bold ${p.stock < 10 ? 'text-red-400 bg-red-400/10 px-2 py-1 rounded' : 'text-green-400'}`}>
                    {p.stock}
                  </span>
                </td>
                <td className="p-4 text-right flex justify-end gap-3">
                  <button onClick={() => openEditModal(p)} className="text-blue-400 hover:text-blue-300"><Edit size={16}/></button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-300"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {produits.length === 0 && (
          <p className="text-center p-6 text-gray-400">Vous n'avez pas encore de produits.</p>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 w-full max-w-md bg-darker">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Modifier le Produit' : 'Nouveau Produit'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Nom" required className="w-full bg-dark p-2 border border-white/10 rounded focus:border-primary outline-none" value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} />
              <textarea placeholder="Description" rows="2" className="w-full bg-dark p-2 border border-white/10 rounded focus:border-primary outline-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              <input type="text" placeholder="Catégorie" required className="w-full bg-dark p-2 border border-white/10 rounded focus:border-primary outline-none" value={formData.categorie} onChange={e => setFormData({...formData, categorie: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Prix" required step="0.01" className="w-full bg-dark p-2 border border-white/10 rounded focus:border-primary outline-none" value={formData.prix} onChange={e => setFormData({...formData, prix: e.target.value})} />
                <input type="number" placeholder="Stock" required className="w-full bg-dark p-2 border border-white/10 rounded focus:border-primary outline-none" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
              </div>
              <input type="url" placeholder="URL Image" className="w-full bg-dark p-2 border border-white/10 rounded focus:border-primary outline-none" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
              
              <div className="flex gap-4 mt-6">
                <Button type="button" variant="ghost" className="flex-1" onClick={() => setIsModalOpen(false)}>Annuler</Button>
                <Button type="submit" className="flex-1">{editingId ? 'Sauvegarder' : 'Créer'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
