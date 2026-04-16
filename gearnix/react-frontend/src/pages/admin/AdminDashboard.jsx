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
      <div className="mb-4">
        <h1 className="dash-title">Tableau de bord</h1>
        <p className="dash-muted text-sm">Vue d’ensemble des performances et des données clés.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="dash-card p-6 flex flex-col justify-between border-l-4 border-l-blue-500">
          <div className="flex justify-between items-start mb-4">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Utilisateurs</p>
            <Users size={20} className="text-blue-500" />
          </div>
          <p className="text-3xl font-semibold text-slate-900">{stats.total_users}</p>
        </div>

        <div className="dash-card p-6 flex flex-col justify-between border-l-4 border-l-[#2f7a78]">
          <div className="flex justify-between items-start mb-4">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Produits</p>
            <Package size={20} className="text-[#2f7a78]" />
          </div>
          <p className="text-3xl font-semibold text-slate-900">{stats.total_produits}</p>
        </div>

        <div className="dash-card p-6 flex flex-col justify-between border-l-4 border-l-[#2f7a78]">
          <div className="flex justify-between items-start mb-4">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Commandes</p>
            <ShoppingCart size={20} className="text-[#2f7a78]" />
          </div>
          <p className="text-3xl font-semibold text-slate-900">{stats.total_commandes}</p>
        </div>

        <div className="dash-card p-6 flex flex-col justify-between border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-start mb-4">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Chiffre d’affaires</p>
            <DollarSign size={20} className="text-green-500" />
          </div>
          <p className="text-3xl font-semibold text-slate-900">{stats.revenue_total} <span className="text-lg">€</span></p>
        </div>
      </div>

      <div className="dash-card p-6 h-96">
        <h3 className="text-sm font-semibold mb-6 text-slate-900">Historique du chiffre d’affaires</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip cursor={{ fill: 'rgba(15,23,42,0.04)' }} contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#0f172a' }} />
            <Bar dataKey="revenue" fill="#2f7a78" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
