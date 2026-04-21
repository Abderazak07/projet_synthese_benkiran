import { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Users, Plus, Trash2, Shield, X, ArrowRight, Mail, User, Edit3, Phone, UserCircle, Eye, EyeOff, Calendar, Hash, CheckCircle, Clock, Search, Filter, UserRound } from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => { fetchUsers(); }, []);
  const fetchUsers = () => api.get('/admin/users').then(res => setUsers(res.data)).catch(() => toast.error("Erreur de chargement"));

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const searchStr = debouncedSearch.toLowerCase();
      const matchesSearch = 
        u.nom?.toLowerCase().includes(searchStr) || 
        u.prenom?.toLowerCase().includes(searchStr) || 
        u.email?.toLowerCase().includes(searchStr) || 
        u.id.toString().includes(searchStr);
      
      const matchesRole = filterRole === '' || u.role === filterRole;
      const matchesGenre = filterGenre === '' || u.genre === filterGenre;

      return matchesSearch && matchesRole && matchesGenre;
    });
  }, [users, debouncedSearch, filterRole, filterGenre]);

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
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="relative group">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-pearl/20 group-focus-within:text-sky-400 transition-colors" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Rechercher un utilisateur..." 
                  className="bg-white/[0.03] border border-white/10 rounded-2xl py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-pearl/20 focus:outline-none focus:border-sky-500/50 focus:bg-white/[0.05] transition-all min-w-[280px]"
                />
              </div>

              {/* Filter Tool */}
              <div className="relative">
                <button 
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className={`dash-btn-outline ${filterRole || filterGenre ? 'border-sky-500 text-sky-400 bg-sky-500/5' : ''}`}
                >
                  <Filter size={18} />
                  {(filterRole || filterGenre) && (
                    <span className="ml-2 px-1.5 py-0.5 rounded bg-sky-500 text-white text-[8px] font-black uppercase">
                      {filterRole || filterGenre}
                    </span>
                  )}
                </button>

                {showFilterMenu && (
                  <div className="absolute top-full mt-2 right-0 w-72 bg-[#12121a] rounded-2xl border border-white/10 shadow-2xl z-50 p-4 animate-in zoom-in-95">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                      <p className="text-[10px] font-black text-pearl/40 uppercase tracking-widest">Filtres avancés</p>
                      {(filterRole || filterGenre || searchTerm) && (
                        <button 
                          onClick={() => { setFilterRole(''); setFilterGenre(''); setSearchTerm(''); setShowFilterMenu(false); }}
                          className="text-[9px] font-bold text-red-400 hover:text-red-300 transition-colors"
                        >
                          RÉINITIALISER
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-[9px] font-bold text-pearl/60 uppercase mb-2 ml-1">Par Rôle</p>
                        <div className="grid grid-cols-2 gap-2">
                          {['ADMIN', 'FOURNISSEUR', 'CLIENT'].map(r => (
                            <button 
                              key={r}
                              onClick={() => setFilterRole(filterRole === r ? '' : r)}
                              className={`px-3 py-2 rounded-xl text-[10px] font-bold transition-all border ${filterRole === r ? 'bg-sky-500 border-sky-400 text-white' : 'bg-white/[0.03] border-white/5 text-pearl/40 hover:border-white/20'}`}
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-[9px] font-bold text-pearl/60 uppercase mb-2 ml-1">Par Genre</p>
                        <div className="flex gap-2">
                          {[
                            {id: 'M', label: 'Homme'},
                            {id: 'F', label: 'Femme'},
                            {id: 'Autre', label: 'Autre'}
                          ].map(g => (
                            <button 
                              key={g.id}
                              onClick={() => setFilterGenre(filterGenre === g.id ? '' : g.id)}
                              className={`flex-1 px-3 py-2 rounded-xl text-[10px] font-bold transition-all border ${filterGenre === g.id ? 'bg-pink-500 border-pink-400 text-white' : 'bg-white/[0.03] border-white/5 text-pearl/40 hover:border-white/20'}`}
                            >
                              {g.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button onClick={handleOpenAdd} className="dash-btn">
                <Plus size={18} /> Nouveau Compte
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="dash-table">
            <thead>
              <tr>
                <th className="w-16">ID</th>
                <th>Utilisateur</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Genre</th>
                <th>Rôle</th>
                <th>Date</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
               {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-white/[0.04] transition-colors group">
                  <td className="text-gray-500 font-mono text-xs">#{u.id}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 flex items-center justify-center font-bold text-sky-400 border border-white/10 uppercase">
                        {u.nom?.slice(0, 1)}{u.prenom?.slice(0, 1)}
                      </div>
                      <div>
                        <p className="font-bold text-white whitespace-nowrap">{u.nom} {u.prenom}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {u.genre === 'M' ? <span className="text-[10px] text-sky-400/70">Homme</span> : 
                           u.genre === 'F' ? <span className="text-[10px] text-pink-400/70">Femme</span> : 
                           <span className="text-[10px] text-gray-400/70">Autre</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="text-gray-400 font-medium whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Mail size={12} className="text-gray-600" />
                      {u.email}
                    </div>
                  </td>
                  <td className="text-gray-400 font-medium whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Phone size={12} className="text-gray-600" />
                      {u.telephone || '-'}
                    </div>
                  </td>
                  <td>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                      u.genre === 'M' ? 'bg-sky-500/5 text-sky-400 border-sky-500/10' : 
                      u.genre === 'F' ? 'bg-pink-500/5 text-pink-400 border-pink-500/10' : 
                      'bg-gray-500/5 text-gray-400 border-gray-500/10'
                    }`}>
                      {u.genre === 'M' ? 'H' : u.genre === 'F' ? 'F' : 'A'}
                    </span>
                  </td>
                  <td>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${u.role === 'ADMIN' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        u.role === 'FOURNISSEUR' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="text-gray-500 text-[10px] font-medium whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-gray-300 font-bold">{new Date(u.created_at).toLocaleDateString()}</span>
                      <span className="opacity-50">{new Date(u.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
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
                <input required className="dash-input" value={formData.nom} onChange={e => setFormData({ ...formData, nom: e.target.value })} placeholder="Dupont" />
              </label>
              <label className="block">
                <span className="dash-form-label">Prénom</span>
                <input required className="dash-input" value={formData.prenom} onChange={e => setFormData({ ...formData, prenom: e.target.value })} placeholder="Jean" />
              </label>
            </div>

            <label className="block">
              <span className="dash-form-label"><Mail size={14} className="inline mr-2" /> Email</span>
              <input required type="email" className="dash-input" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="jean@example.com" />
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="dash-form-label"><Phone size={14} className="inline mr-2" /> Téléphone</span>
                <input className="dash-input" value={formData.telephone} onChange={e => setFormData({ ...formData, telephone: e.target.value })} placeholder="06..." />
              </label>
              <label className="block">
                <span className="dash-form-label"><UserCircle size={14} className="inline mr-2" /> Genre</span>
                <select className="dash-input" value={formData.genre} onChange={e => setFormData({ ...formData, genre: e.target.value })}>
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
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
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
              <span className="dash-form-label"><Shield size={14} className="inline mr-2" /> Rôle assigné</span>
              <select className="dash-input" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
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
