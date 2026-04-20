import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Users, Plus, Trash2, Shield, X, ArrowRight, Mail, User } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ nom: '', email: '', password: '', role: 'CLIENT' });
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { fetchUsers(); }, []);
  const fetchUsers = () => api.get('/admin/users').then(res => setUsers(res.data)).catch(() => toast.error("Erreur de chargement"));

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

  return (
    <>
      <div className="dash-table-container bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-white">
          <div className="section-header">
            <div className="section-title-group">
              <h1 className="section-title">
                <div className="bullet"><Users size={20} /></div>
                Utilisateurs
              </h1>
              <p className="section-description">Gérez les comptes clients, fournisseurs et administrateurs.</p>
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
                <th>Utilisateur</th>
                <th>Email</th>
                <th>Rôle actuel</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors group">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 border border-slate-200 uppercase">
                        {u.nom.slice(0, 2)}
                      </div>
                      <p className="font-bold text-slate-900">{u.nom}</p>
                    </div>
                  </td>
                  <td className="text-slate-500 font-medium">{u.email}</td>
                  <td>
                    <select 
                      className="dash-input !py-1.5 !px-3 font-bold !text-[11px] uppercase tracking-wider w-auto"
                      value={u.role}
                      onChange={(e) => changeRole(u.id, e.target.value)}
                    >
                      <option value="CLIENT">Client</option>
                      <option value="FOURNISSEUR">Fournisseur</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                  <td className="text-right">
                    <button onClick={() => setDeleteId(u.id)} className="p-2.5 text-red-500 hover:text-white hover:bg-red-500 rounded-xl transition-all shadow-sm border border-slate-100 bg-slate-50">
                      <Trash2 size={16} />
                    </button>
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
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Utilisateur</h2>
            <button onClick={() => setShowForm(false)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleAddUser} className="p-6 space-y-5">
            <label className="block">
              <span className="dash-form-label"><User size={14} className="inline mr-2"/> Nom complet</span>
              <input required className="dash-input" value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} placeholder="Jean Dupont" />
            </label>
            <label className="block">
              <span className="dash-form-label"><Mail size={14} className="inline mr-2"/> Email</span>
              <input required type="email" className="dash-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="jean@example.com" />
            </label>
            <label className="block">
              <span className="dash-form-label">Mot de passe</span>
              <input required type="password" placeholder="Min. 8 caractères" className="dash-input" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </label>
            <label className="block">
              <span className="dash-form-label"><Shield size={14} className="inline mr-2"/> Rôle assigné</span>
              <select className="dash-input" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                <option value="CLIENT">Client</option>
                <option value="FOURNISSEUR">Fournisseur</option>
                <option value="ADMIN">Administrateur</option>
              </select>
            </label>

            <div className="pt-6 border-t border-slate-100 flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="dash-btn-outline flex-1">Fermer</button>
              <button type="submit" className="dash-btn flex-1">
                Créer compte <ArrowRight size={16} className="ml-2" />
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
              <h3 className="text-xl font-black text-slate-900 text-center mb-2 tracking-tight">Supprimer l'utilisateur ?</h3>
              <p className="text-slate-500 text-center text-sm font-medium mb-8 leading-relaxed">Cette action supprimera également toutes les données liées à ce compte.</p>
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
