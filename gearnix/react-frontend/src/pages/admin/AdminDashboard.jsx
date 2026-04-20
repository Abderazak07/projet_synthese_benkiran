import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, Calendar, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ 
    total_users: 0, total_produits: 0, total_commandes: 0, revenue_total: 0,
    revenue_chart: [], user_breakdown: {}, recent_users: [] 
  });

  useEffect(() => {
    api.get('/admin/stats').then(res => setStats(res.data)).catch(() => {});
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="dash-card p-6 flex flex-col group hover:border-[#2c767c]/30 transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        <div className={`w-12 h-12 rounded-2xl bg-slate-50 text-[#2c767c] flex items-center justify-center border border-slate-100 shadow-inner group-hover:scale-110 transition-transform duration-500`}>
          <Icon size={22} strokeWidth={2.5} />
        </div>
        {trend && (
           <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
             <ArrowUpRight size={12}/> {trend}
           </div>
        )}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</p>
      <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
    </div>
  );

  return (
    <div className="space-y-8 w-full max-w-full overflow-hidden">
      <div className="section-header">
        <div className="section-title-group">
          <h1 className="section-title">
            <div className="bullet"><TrendingUp size={20} /></div>
            Tableau de Bord Administration
          </h1>
          <p className="section-description">Centralisation des données et suivi en direct.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">
          <Calendar size={14} className="text-[#2c767c]"/> {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Utilisateurs" value={stats.total_users} icon={Users} color="blue" trend="+12%" />
        <StatCard title="Produits" value={stats.total_produits} icon={Package} color="teal" />
        <StatCard title="Commandes" value={stats.total_commandes} icon={ShoppingCart} color="amber" />
        <StatCard title="Revenue" value={`${parseFloat(stats.revenue_total).toLocaleString('fr-FR')} €`} icon={DollarSign} color="emerald" trend="+24%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 dash-card p-8 h-[450px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Revenus (7 derniers jours)</h3>
            <div className="flex items-center gap-2 text-[10px] font-bold text-[#2c767c]">
               <div className="w-2.5 h-2.5 rounded-full bg-[#2c767c] shadow-[0_0_10px_rgba(44,118,124,0.4)]" /> Volume en euros
            </div>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.revenue_chart} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }} 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderRadius: '16px', 
                    border: '1px solid #e2e8f0', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }} 
                />
                <Bar 
                  dataKey="revenue" 
                  fill="#2c767c" 
                  radius={[8, 8, 8, 8]} 
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dash-card p-0 flex flex-col overflow-hidden">
           <div className="p-6 border-b border-slate-50 bg-slate-50/50">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Propriétaires Récents</h3>
           </div>
           <div className="flex-1 divide-y divide-slate-50 overflow-y-auto">
              {stats.recent_users.map(u => (
                <div key={u.id} className="p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                  <div className="h-10 w-10 rounded-xl bg-[#2c767c]/10 text-[#2c767c] flex items-center justify-center font-black border border-[#2c767c]/10">
                    {u.nom.slice(0,1)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{u.nom}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{u.email}</p>
                  </div>
                  <div className="ml-auto">
                    <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${u.role === 'ADMIN' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                      {u.role}
                    </span>
                  </div>
                </div>
              ))}
           </div>
           <div className="p-4 bg-slate-50/50">
              <button className="w-full py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:border-[#2c767c] hover:text-[#2c767c] transition-all">
                Gérer tous les comptes
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
