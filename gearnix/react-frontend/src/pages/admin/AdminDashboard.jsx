import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, Package, ShoppingCart, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total_users: 0, total_produits: 0, total_commandes: 0, revenue_total: 0 });

  useEffect(() => {
    api.get('/admin/stats').then(res => setStats(res.data)).catch(() => {});
  }, []);

  const data = [
    { name: 'Lun', revenue: 400 },
    { name: 'Mar', revenue: 300 },
    { name: 'Mer', revenue: 550 },
    { name: 'Jeu', revenue: 200 },
    { name: 'Ven', revenue: 700 },
    { name: 'Sam', revenue: 1000 },
    { name: 'Dim', revenue: 850 },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2 uppercase">Tableau de bord</h1>
        <p className="text-gray-400">Vue d’ensemble des performances et des données clés.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-card p-6 flex flex-col justify-between border-l-4 border-l-blue-500">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Utilisateurs</p>
            <Users size={20} className="text-blue-500" />
          </div>
          <p className="text-3xl font-black text-white">{stats.total_users}</p>
        </div>

        <div className="glass-card p-6 flex flex-col justify-between border-l-4 border-l-primary">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Produits</p>
            <Package size={20} className="text-primary" />
          </div>
          <p className="text-3xl font-black text-white">{stats.total_produits}</p>
        </div>

        <div className="glass-card p-6 flex flex-col justify-between border-l-4 border-l-orange-500">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Commandes</p>
            <ShoppingCart size={20} className="text-orange-500" />
          </div>
          <p className="text-3xl font-black text-white">{stats.total_commandes}</p>
        </div>

        <div className="glass-card p-6 flex flex-col justify-between border-l-4 border-l-green-500">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Chiffre d’affaires</p>
            <DollarSign size={20} className="text-green-500" />
          </div>
          <p className="text-3xl font-black text-white">{stats.revenue_total} <span className="text-lg">€</span></p>
        </div>
      </div>

      <div className="glass-card p-6 h-96">
        <h3 className="font-bold mb-6 text-gray-300">Historique du chiffre d’affaires</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
            <Bar dataKey="revenue" fill="#7c3aed" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
