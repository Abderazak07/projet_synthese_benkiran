import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Users, Plus, Trash2, Shield, X, ArrowRight, Mail, User, Edit3, Phone, UserCircle, Eye, EyeOff } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ 
    nom: '', 
    prenom: '',
    email: '', 
    telephone: '',
    genre: 'M',
    password: '', 
    role: 'CLIENT' 
  });
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { fetchUsers(); }, []);
  const fetchUsers = () => api.get('/admin/users').then(res => setUsers(res.data)).catch(() => toast.error("Erreur de chargement"));

  const handleEditClick = (user) => {
    setEditId(user.id);
    setShowPassword(false);
    setFormData({
      nom: user.nom || '',
      prenom: user.prenom || '',
      email: user.email || '',
      telephone: user.telephone || '',
      genre: user.genre || 'M',
      password: '', // On ne remplit pas le mot de passe par défaut
      role: user.role || 'CLIENT'
    });
    setShowForm(true);
  };

  const handleOpenAdd = () => {
    setEditId(null);
    setShowPassword(false);
    setFormData({ nom: '', prenom: '', email: '', telephone: '', genre: 'M', password: '', role: 'CLIENT' });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading(editId ? 'Mise à jour...' : 'Création...');
    try {
      if (editId) {
        await api.put(`/admin/users/${editId}`, formData);
        toast.success('Compte mis à jour', { id: loadingToast });
      } else {
        await api.post('/register', formData);
        toast.success('Compte créé', { id: loadingToast });
      }
      setShowForm(false);
      fetchUsers();
    } catch (err) { 
      toast.error(err.response?.data?.message || 'Erreur', { id: loadingToast }); 
    }
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

  return (
    <>
      <div className="dash-table-container bg-white/[0.03] rounded-2xl border border-white/[0.07] shadow-xl overflow-hidden">
        <div className="p-8 border-b border-white/5 bg-white/[0.03]">
          <div className="section-header">
            <div className="section-title-group">
              <h1 className="section-title">
                <div className="bullet"><Users size={20} /></div>
                Utilisateurs
              </h1>
              <p className="section-description">Gérez les comptes clients, fournisseurs et administrateurs.</p>
            </div>
            <button onClick={handleOpenAdd} className="dash-btn">
              <Plus size={18} /> Nouveau Compte
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Email</th>
                <th>Rôle actuel</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="hover:bg-white/[0.04] transition-colors group">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-white/[0.05] flex items-center justify-center font-bold text-gray-400 border border-white/10 uppercase">
                        {u.nom.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-bold text-white">{u.nom} {u.prenom}</p>
                        <p className="text-[10px] text-gray-500 font-medium">{u.telephone || 'Pas de numéro'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-gray-400 font-medium">{u.email}</td>
                  <td>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      u.role === 'ADMIN' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      u.role === 'FOURNISSEUR' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                      'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEditClick(u)} className="p-2.5 text-sky-400 hover:text-white hover:bg-sky-500 rounded-xl transition-all shadow-sm border border-white/5 bg-white/[0.04]">
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => setDeleteId(u.id)} className="p-2.5 text-red-500 hover:text-white hover:bg-red-500 rounded-xl transition-all shadow-sm border border-white/5 bg-white/[0.04]">
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
          <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <h2 className="text-lg font-black text-white tracking-tight">
              {editId ? 'Modifier Utilisateur' : 'Nouveau Compte'}
            </h2>
            <button onClick={() => setShowForm(false)} className="p-2 text-pearl/40 hover:text-red-500 transition-colors">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="dash-form-label">Nom</span>
                <input required className="dash-input" value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} placeholder="Dupont" />
              </label>
              <label className="block">
                <span className="dash-form-label">Prénom</span>
                <input required className="dash-input" value={formData.prenom} onChange={e => setFormData({...formData, prenom: e.target.value})} placeholder="Jean" />
              </label>
            </div>
            
            <label className="block">
              <span className="dash-form-label"><Mail size={14} className="inline mr-2"/> Email</span>
              <input required type="email" className="dash-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="jean@example.com" />
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="dash-form-label"><Phone size={14} className="inline mr-2"/> Téléphone</span>
                <input className="dash-input" value={formData.telephone} onChange={e => setFormData({...formData, telephone: e.target.value})} placeholder="06..." />
              </label>
              <label className="block">
                <span className="dash-form-label"><UserCircle size={14} className="inline mr-2"/> Genre</span>
                <select className="dash-input" value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value})}>
                  <option value="M">Homme</option>
                  <option value="F">Femme</option>
                  <option value="Autre">Autre</option>
                </select>
              </label>
            </div>

            <label className="block">
              <span className="dash-form-label">Mot de passe {editId && '(Laisser vide pour ne pas changer)'}</span>
              <div className="relative">
                <input 
                  required={!editId} 
                  type={showPassword ? "text" : "password"} 
                  placeholder="********" 
                  className="dash-input pr-12" 
                  value={formData.password} 
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-sky-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>
            <label className="block">
              <span className="dash-form-label"><Shield size={14} className="inline mr-2"/> Rôle assigné</span>
              <select className="dash-input" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                <option value="CLIENT">Client</option>
                <option value="FOURNISSEUR">Fournisseur</option>
                <option value="ADMIN">Administrateur</option>
              </select>
            </label>

            <div className="pt-6 border-t border-white/5 flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="dash-btn-outline flex-1">Annuler</button>
              <button type="submit" className="dash-btn flex-1">
                {editId ? 'Enregistrer' : 'Créer'} <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
          </form>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in duration-200">
           <div className="bg-[#12121a] rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-white/10 animate-in zoom-in-95">
              <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-red-500/20">
                 <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-black text-white text-center mb-2 tracking-tight">Supprimer l'utilisateur ?</h3>
              <p className="text-gray-400 text-center text-sm font-medium mb-8 leading-relaxed">Cette action supprimera également toutes les données liées à ce compte.</p>
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
