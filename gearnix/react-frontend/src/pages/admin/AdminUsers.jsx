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
    <div className="p-8">
      <h1 className="text-2xl font-black mb-6 uppercase text-primary">Gestion Utilisateurs</h1>
      <div className="glass-card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="p-4 text-gray-400 font-semibold">ID</th>
              <th className="p-4 text-gray-400 font-semibold">Nom</th>
              <th className="p-4 text-gray-400 font-semibold">Email</th>
              <th className="p-4 text-gray-400 font-semibold">Rôle</th>
              <th className="p-4 text-gray-400 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-white/[0.02]">
                <td className="p-4">#{u.id}</td>
                <td className="p-4 font-medium text-white">{u.nom}</td>
                <td className="p-4 text-gray-300">{u.email}</td>
                <td className="p-4">
                  <select 
                    className="bg-transparent border border-white/20 text-white rounded p-1 text-sm outline-none focus:border-primary px-2"
                    value={u.role}
                    onChange={(e) => changeRole(u.id, e.target.value)}
                  >
                    <option className="bg-dark text-white" value="CLIENT">Client</option>
                    <option className="bg-dark text-white" value="FOURNISSEUR">Fournisseur</option>
                    <option className="bg-dark text-white" value="ADMIN">Admin</option>
                  </select>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => deleteUser(u.id)} className="text-red-400 hover:text-red-300 p-2 border border-red-500/20 rounded-lg bg-red-500/10 transition-colors" title="Supprimer l'utilisateur">
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
