import { useState, useEffect } from 'react';
import api from '../../services/api';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    api.get('/admin/users').then(res => setUsers(res.data));
  };

  const changeRole = async (id, role) => {
    try {
      await api.put(`/admin/users/${id}`, { role });
      toast.success('Rôle mis à jour');
      fetchUsers();
    } catch (err) {
      toast.error('Erreur lors de la mise à jour du rôle');
    }
  };

  const deleteUser = async (id) => {
    if (confirm('Supprimer cet utilisateur ? Cette action est irréversible.')) {
      try {
        await api.delete(`/admin/users/${id}`);
        toast.success('Utilisateur supprimé');
        fetchUsers();
      } catch (err) {
        toast.error('Erreur');
      }
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="dash-title">Utilisateurs</h1>
        <p className="dash-muted text-sm">Gérez les rôles et supprimez les comptes si besoin.</p>
      </div>

      <div className="dash-card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-slate-600 text-xs font-semibold uppercase tracking-wider">ID</th>
              <th className="p-4 text-slate-600 text-xs font-semibold uppercase tracking-wider">Nom</th>
              <th className="p-4 text-slate-600 text-xs font-semibold uppercase tracking-wider">Email</th>
              <th className="p-4 text-slate-600 text-xs font-semibold uppercase tracking-wider">Rôle</th>
              <th className="p-4 text-slate-600 text-xs font-semibold uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50">
                <td className="p-4 text-slate-700 font-semibold">#{u.id}</td>
                <td className="p-4 font-semibold text-slate-900">{u.nom}</td>
                <td className="p-4 text-slate-600">{u.email}</td>
                <td className="p-4">
                  <select 
                    className="bg-white border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2f7a78] focus:ring-1 focus:ring-[#2f7a78]/25"
                    value={u.role}
                    onChange={(e) => changeRole(u.id, e.target.value)}
                  >
                    <option value="CLIENT">Client</option>
                    <option value="FOURNISSEUR">Fournisseur</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => deleteUser(u.id)} className="text-red-600 hover:text-red-700 p-2 border border-red-200 rounded-lg bg-red-50 transition-colors" title="Supprimer l'utilisateur">
                     <Trash2 size={16}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
