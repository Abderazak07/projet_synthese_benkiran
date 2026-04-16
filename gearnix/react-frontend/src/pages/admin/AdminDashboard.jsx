import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Users, Package, ShoppingCart, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total_users: 0, total_produits: 0, total_commandes: 0, revenue_total: 0 });

  useEffect(() => {
    api.get('/admin/stats').then(res => setStats(res.data)).catch(() => {});
  }, []);

  const data = [
    { name: 'Mon', revenue: 400 },
    { name: 'Tue', revenue: 300 },
    { name: 'Wed', revenue: 550 },
    { name: 'Thu', revenue: 200 },
    { name: 'Fri', revenue: 700 },
    { name: 'Sat', revenue: 1000 },
    { name: 'Sun', revenue: 850 },
  ];

  return (
    <div className="flex bg-darker/50 min-h-[calc(100vh-4rem)]">
      {/* Sidebar admin simplifiée */}
      <div className="w-64 glass-card m-4 rounded-xl flex flex-col p-4 border-white/10 hidden md:flex">
        <h2 className="text-xl font-black text-primary mb-8 px-2">ADMIN PANEL</h2>
        <nav className="space-y-2 flex-grow">
          <Link to="/admin" className="block px-4 py-3 rounded-lg bg-primary/20 text-white font-medium border border-primary/30">Dashboard</Link>
          <Link to="/admin/utilisateurs" className="block px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors">Users</Link>
          <Link to="/admin/produits" className="block px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors">Products</Link>
          <Link to="/admin/commandes" className="block px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors">Orders</Link>
          <Link to="/admin/paiements" className="block px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors">Payments</Link>
          <Link to="/admin/livraisons" className="block px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors">Deliveries</Link>
        </nav>
      </div>

      <div className="flex-1 p-4 md:p-8">
        <h1 className="text-3xl font-black mb-8 uppercase">Overview</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6 flex flex-col justify-between border-l-4 border-l-blue-500">
            <div className="flex justify-between items-start mb-4">
              <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Users</p>
              <Users size={20} className="text-blue-500" />
            </div>
            <p className="text-3xl font-black text-white">{stats.total_users}</p>
          </div>
          
          <div className="glass-card p-6 flex flex-col justify-between border-l-4 border-l-primary">
            <div className="flex justify-between items-start mb-4">
              <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Products</p>
              <Package size={20} className="text-primary" />
            </div>
            <p className="text-3xl font-black text-white">{stats.total_produits}</p>
          </div>
          
          <div className="glass-card p-6 flex flex-col justify-between border-l-4 border-l-orange-500">
            <div className="flex justify-between items-start mb-4">
              <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Orders</p>
              <ShoppingCart size={20} className="text-orange-500" />
            </div>
            <p className="text-3xl font-black text-white">{stats.total_commandes}</p>
          </div>
          
          <div className="glass-card p-6 flex flex-col justify-between border-l-4 border-l-green-500">
            <div className="flex justify-between items-start mb-4">
              <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Revenue</p>
              <DollarSign size={20} className="text-green-500" />
            </div>
            <p className="text-3xl font-black text-white">{stats.revenue_total} <span className="text-lg">€</span></p>
          </div>
        </div>
        
        <div className="glass-card p-6 h-96">
          <h3 className="font-bold mb-6 text-gray-300">Revenue Overview (Simulated)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#1a1a1a', border: '1px solid #333'}} />
              <Bar dataKey="revenue" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
