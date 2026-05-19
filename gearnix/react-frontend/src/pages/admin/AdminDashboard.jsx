import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Users, Package, ShoppingCart, DollarSign, TrendingUp, Calendar,
  ArrowUpRight, ArrowRight, Activity, Sparkles, Eye, Layers,
  UserCheck, Truck, CreditCard
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total_users: 0, total_produits: 0, total_commandes: 0, revenue_total: 0,
    revenue_chart: [], user_breakdown: {}, recent_users: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then(res => setStats(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      title: 'Chiffre d\'Affaires',
      value: `${parseFloat(stats.revenue_total || 0).toLocaleString('fr-FR')} MAD`,
      icon: DollarSign,
      gradient: 'from-sky to-sky-700',
      bgLight: 'bg-sky/10',
      textColor: 'text-sky',
      borderColor: 'border-sky/20',
      trend: '+24%',
      trendUp: true,
    },
    {
      title: 'Base Clients',
      value: stats.total_users,
      icon: Users,
      gradient: 'from-blue-500 to-indigo-600',
      bgLight: 'bg-blue-500/10',
      textColor: 'text-blue-400',
      borderColor: 'border-blue-500/20',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Inventaire Catalogue',
      value: stats.total_produits,
      icon: Package,
      gradient: 'from-sky-500 to-sky-600',
      bgLight: 'bg-sky-500/10',
      textColor: 'text-sky-400',
      borderColor: 'border-sky-500/20',
    },
    {
      title: 'Volume de Ventes',
      value: stats.total_commandes,
      icon: ShoppingCart,
      gradient: 'from-violet-500 to-purple-600',
      bgLight: 'bg-violet-500/10',
      textColor: 'text-violet-400',
      borderColor: 'border-violet-500/20',
    },
  ];

  const quickLinks = [
    { label: 'Utilisateurs', to: '/admin/utilisateurs', icon: Users, desc: 'Comptes & Accès' },
    { label: 'Catalogue', to: '/admin/produits', icon: Package, desc: 'Gestion articles' },
    { label: 'Catégories', to: '/admin/categories', icon: Sparkles, desc: 'Mise en avant' },
    { label: 'Ventes', to: '/admin/commandes', icon: ShoppingCart, desc: 'Suivi flux' },
    { label: 'Finance', to: '/admin/paiements', icon: CreditCard, desc: 'Transactions' },
    { label: 'Logistique', to: '/admin/livraisons', icon: Truck, desc: 'Expéditions' },
  ];

  return (
    <div className="space-y-10 w-full">
      {/* Header with welcome message */}
      <div className="bg-white border border-adi-silver p-10 relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-adi-silver opacity-30 skew-x-12 translate-x-10" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-5xl font-black uppercase italic tracking-tighter text-black mb-2">
              ADMINISTRATION
            </h1>
            <p className="text-sm font-black uppercase tracking-widest text-adi-gray">
              Contrôle Global — Accessoires Électroniques & High-Tech
            </p>
          </div>
          <div className="bg-black text-white px-6 py-4 flex items-center gap-4 font-black uppercase italic text-sm tracking-widest">
            <Calendar size={20} />
            {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Stat Cards - Adidas Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-white border-2 border-black p-8 hover:bg-adi-silver transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="h-14 w-14 bg-black text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon size={28} />
                </div>
                {card.trend && (
                  <div className="bg-adi-red text-white px-3 py-1 font-black italic text-[10px] uppercase tracking-widest">
                    {card.trend}
                  </div>
                )}
              </div>
              <p className="text-[11px] font-black text-adi-gray uppercase tracking-widest mb-1">{card.title}</p>
              <p className="text-4xl font-black text-black uppercase italic tracking-tighter">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white border border-adi-silver">
          <div className="p-8 border-b border-adi-silver flex items-center justify-between bg-adi-silver/20">
            <h3 className="text-xl font-black uppercase italic tracking-tighter text-black">Revenus (7j)</h3>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-adi-gray">
              <Activity size={16} /> Live Data
            </div>
          </div>
          <div className="p-8 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.revenue_chart}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#000" stopOpacity={0.1} />
                    <stop offset="100%" stopColor="#000" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="0" vertical={false} stroke="#ebedee" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#767677', fontSize: 10, fontWeight: 900 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#767677', fontSize: 10, fontWeight: 900 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '0',
                    border: '2px solid #000',
                    fontSize: '11px',
                    fontWeight: '900',
                    textTransform: 'uppercase'
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#000" strokeWidth={4} fill="url(#revenueGrad)" dot={{ r: 4, fill: '#000', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#e11d48', strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white border border-adi-silver flex flex-col">
          <div className="p-8 border-b border-adi-silver bg-adi-silver/20">
            <h3 className="text-xl font-black uppercase italic tracking-tighter text-black">Inscriptions</h3>
          </div>
          <div className="flex-1 divide-y divide-adi-silver overflow-y-auto max-h-[400px] custom-scrollbar">
            {stats.recent_users.map(u => (
              <div key={u.id} className="p-5 flex items-center gap-4 hover:bg-adi-silver/30 transition-colors">
                <div className="h-12 w-12 bg-black text-white flex items-center justify-center font-black text-lg">
                  {u.nom?.slice(0, 1)?.toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black uppercase italic tracking-tighter text-black">{u.nom}</p>
                  <p className="text-[10px] text-adi-gray font-bold uppercase tracking-widest truncate">{u.email}</p>
                </div>
                <div className="px-3 py-1 bg-adi-silver text-[9px] font-black uppercase italic text-black border border-adi-gray/20">
                  {u.role}
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 bg-adi-silver/10">
            <Link to="/admin/utilisateurs" className="dash-btn w-full">
              Tous les comptes
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="bg-white border border-adi-silver p-10">
        <h3 className="text-2xl font-black uppercase italic tracking-tighter text-black mb-8">Navigation Rapide</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickLinks.map(link => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className="group border border-adi-silver p-6 hover:bg-black hover:text-white transition-all flex flex-col items-center text-center gap-3"
              >
                <Icon size={24} className="group-hover:scale-110 transition-transform" />
                <span className="text-xs font-black uppercase italic tracking-tighter">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
