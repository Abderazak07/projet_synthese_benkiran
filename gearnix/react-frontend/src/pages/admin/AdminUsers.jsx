import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Users, Plus, Trash2, X, ArrowRight, User as UserIcon } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [formData, setFormData] = useState({ nom: '', email: '', password: '', role: 'CLIENT' });
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { fetchUsers(); }, []);
  const fetchUsers = async () => {
    setLoading(true);
    try {
       const res = await api.get('/admin/users');
       setUsers(res.data);
    } catch (err) {
       toast.error("Erreur de chargement des données");
    } finally {
       setLoading(false);
    }
  };

  const changeRole = async (id, role) => {
    try {
      await api.put(`/admin/users/${id}`, { role });
      toast.success('Rôle mis à jour');
      fetchUsers();
    } catch (err) { toast.error('Erreur'); }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Création...');
    try {
      await api.post('/register', formData);
      toast.success('Compte créé', { id: loadingToast });
      setShowForm(false);
      setFormData({ nom: '', email: '', password: '', role: 'CLIENT' });
      fetchUsers();
    } catch (err) { toast.error(err.response?.data?.message || 'Erreur', { id: loadingToast }); }
  };

  const executeDelete = async () => {
    const loadingToast = toast.loading('Suppression...');
    try {
      await api.delete(`/admin/users/${deleteId}`);
      toast.success('Utilisateur supprimé', { id: loadingToast });
      setDeleteId(null);
      fetchUsers();
    } catch (err) { toast.error('Erreur', { id: loadingToast }); }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === users.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(users.map(u => u.id));
    }
  };

  const toggleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Voulez-vous supprimer les ${selectedIds.length} utilisateur(s) sélectionné(s) ?`)) return;
    const loadingToast = toast.loading('Suppression en cours...');
    try {
      await Promise.all(selectedIds.map(id => api.delete(`/admin/users/${id}`)));
      toast.success('Sélection supprimée', { id: loadingToast });
      setSelectedIds([]);
      fetchUsers();
    } catch (e) {
      toast.error('Erreur lors de la suppression', { id: loadingToast });
    }
  };

  return (
    <>
      <div className="dash-table-container mb-12">
        <div className="p-8 border-b border-adi-silver">
          <div className="section-header">
            <div>
              <h1 className="section-title">Utilisateurs</h1>
              <p className="section-description">Gestion des comptes clients, techniciens et fournisseurs d'accessoires high-tech</p>
            </div>
            <button onClick={() => setShowForm(true)} className="dash-btn">
              <Plus size={18} /> Nouveau Compte
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="dash-table">
            <thead>
              <tr>
                <th className="w-12 text-center">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300 text-[#0ea5e9] focus:ring-[#0ea5e9] cursor-pointer"
                    checked={users.length > 0 && selectedIds.length === users.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>Utilisateur</th>
                <th>Email</th>
                <th>Rôle</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-20">
                    <div className="flex flex-col items-center gap-4">
                       <div className="w-10 h-10 border-4 border-adi-silver border-t-black rounded-full animate-spin"></div>
                       <p className="font-black uppercase italic text-xs tracking-widest text-adi-gray">Chargement des données...</p>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-20 font-black uppercase italic text-adi-gray">
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              ) : (
                users.map(u => (
                  <tr key={u.id}>
                    <td className="text-center">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-gray-300 text-[#0ea5e9] focus:ring-[#0ea5e9] cursor-pointer"
                        checked={selectedIds.includes(u.id)}
                        onChange={() => toggleSelectOne(u.id)}
                      />
                    </td>
                    <td>
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-black text-white flex items-center justify-center font-black rounded-lg">
                          {u.nom.slice(0, 2).toUpperCase()}
                        </div>
                        <p className="font-black uppercase italic tracking-tighter text-sm text-gray-900">{u.nom}</p>
                      </div>
                    </td>
                    <td className="font-bold text-gray-800">{u.email}</td>
                    <td>
                      <select 
                        className="dash-input h-[35px] !py-0 !px-3 font-black text-[10px] uppercase italic tracking-wider w-auto"
                        value={u.role}
                        onChange={(e) => changeRole(u.id, e.target.value)}
                      >
                        <option value="CLIENT">Client</option>
                        <option value="FOURNISSEUR">Fournisseur</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>
                    <td className="text-right">
                      <button onClick={() => setDeleteId(u.id)} className="p-3 text-red-500 hover:bg-red-600 hover:text-white transition-all border border-adi-silver rounded-xl bg-white/[0.04]">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white border-2 border-black shadow-2xl rounded-2xl px-8 py-4 flex items-center gap-8 z-50 animate-in slide-in-from-bottom duration-300">
          <p className="text-xs font-black uppercase text-black tracking-wider flex items-center gap-2">
            <UserIcon size={16} /> {selectedIds.length} sélectionné(s)
          </p>
          <button 
            onClick={handleBulkDelete}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg hover:shadow-red-600/20"
          >
            <Trash2 size={14} /> Supprimer la sélection
          </button>
        </div>
      )}

      {showForm && (
        <div className="dash-side-form-container">
          <div className="p-6 border-b border-black bg-black flex items-center justify-between">
            <h2 className="text-lg font-black text-white uppercase italic tracking-tighter">Créer Utilisateur</h2>
            <button onClick={() => setShowForm(false)} className="text-white hover:rotate-90 transition-transform">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleAddUser} className="p-8 space-y-6">
            <div>
              <span className="dash-form-label">Nom complet *</span>
              <input required className="dash-input" value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} placeholder="EX: JEAN DUPONT" />
            </div>
            <div>
              <span className="dash-form-label">Adresse Email *</span>
              <input required type="email" className="dash-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="EX: JEAN@SHOP.COM" />
            </div>
            <div>
              <span className="dash-form-label">Mot de passe *</span>
              <input required type="password" placeholder="MIN. 8 CARACTÈRES" className="dash-input" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>
            <div>
              <span className="dash-form-label">Rôle assigné *</span>
              <select className="dash-input" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                <option value="CLIENT">CLIENT</option>
                <option value="FOURNISSEUR">FOURNISSEUR</option>
                <option value="ADMIN">ADMINISTRATEUR</option>
              </select>
            </div>

            <div className="pt-6 border-t border-adi-silver flex gap-4">
              <button type="button" onClick={() => setShowForm(false)} className="dash-btn-outline flex-1">Annuler</button>
              <button type="submit" className="dash-btn flex-1">
                Confirmer <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100]">
           <div className="bg-white p-10 max-w-md w-full border-4 border-black shadow-[20px_20px_0_0_rgba(0,0,0,1)] rounded-3xl">
              <h3 className="text-3xl font-black text-black uppercase italic tracking-tighter mb-4">Attention</h3>
              <p className="text-adi-gray text-sm font-bold uppercase tracking-tight mb-8 leading-tight">Voulez-vous vraiment supprimer cet utilisateur ? Cette action est irréversible.</p>
              <div className="flex gap-4">
                 <button onClick={() => setDeleteId(null)} className="dash-btn-outline flex-1">Annuler</button>
                 <button onClick={executeDelete} className="dash-btn bg-red-600 border-red-600 flex-1 hover:bg-red-700">Supprimer</button>
              </div>
           </div>
        </div>
      )}
    </>
  );
}
