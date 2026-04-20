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
      value: `${parseFloat(stats.revenue_total || 0).toLocaleString('fr-FR')} €`,
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
    { label: 'Collections', to: '/admin/categories', icon: Sparkles, desc: 'Mise en avant' },
    { label: 'Ventes', to: '/admin/commandes', icon: ShoppingCart, desc: 'Suivi flux' },
    { label: 'Finance', to: '/admin/paiements', icon: CreditCard, desc: 'Transactions' },
    { label: 'Logistique', to: '/admin/livraisons', icon: Truck, desc: 'Expéditions' },
  ];

  return (
    <div className="space-y-8 w-full max-w-full overflow-hidden">
      {/* Header with welcome message & date */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d0d12] via-[#16161e] to-[#0c1a25] p-8 shadow-xl border border-sky/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky/15 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />
        <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-sky-700/10 rounded-full blur-2xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-sky/10 flex items-center justify-center border border-sky/20">
                <Activity size={20} className="text-sky" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-pearl/50">Tableau de bord</span>
            </div>
            <h1 className="text-3xl font-black text-pearl tracking-tight">
              Bienvenue, Administrateur
            </h1>
            <p className="text-pearl/60 mt-2 text-sm font-medium">
              Vue d'ensemble de votre plateforme GEARNIX. Toutes vos métriques en temps réel.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/15 self-start">
            <Calendar size={16} className="text-sky" />
            <span className="text-sm font-bold text-pearl/80">
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="group relative bg-white/[0.03] rounded-2xl border border-white/5 p-6 hover:shadow-2xl hover:border-sky/30 hover:bg-white/[0.05] transition-all duration-500 overflow-hidden">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.gradient} opacity-[0.04] rounded-full -translate-y-8 translate-x-8 group-hover:opacity-[0.08] group-hover:scale-125 transition-all duration-700`} />
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-5">
                  <div className={`w-12 h-12 rounded-2xl ${card.bgLight} ${card.textColor} flex items-center justify-center border ${card.borderColor} group-hover:scale-110 transition-transform duration-500`}>
                    <Icon size={22} strokeWidth={2.5} />
                  </div>
                  {card.trend && (
                    <div className={`flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-lg border ${card.trendUp ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20'}`}>
                      <ArrowUpRight size={12} /> {card.trend}
                    </div>
                  )}
                </div>
                <p className="text-[10px] font-black text-pearl/40 uppercase tracking-[0.2em] mb-1.5">{card.title}</p>
                <p className="text-3xl font-black text-pearl tracking-tight">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart + Recent Users */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white/[0.03] rounded-2xl border border-white/10 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-pearl tracking-wide">Revenus — 7 derniers jours</h3>
              <p className="text-[10px] text-pearl/40 font-bold mt-1 uppercase tracking-widest">Volume en euros</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-[#0ea5e9]">
              <div className="w-2.5 h-2.5 rounded-full bg-sky shadow-[0_0_10px_rgba(14,165,233,0.5)] animate-pulse" /> Analytics Live
            </div>
          </div>
          <div className="p-6 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.revenue_chart} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 700 }} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3', stroke: '#0ea5e9' }}
                  contentStyle={{
                    backgroundColor: '#16161e',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    padding: '12px 16px',
                    color: '#f1f1f3',
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={3} fill="url(#revenueGrad)" dot={{ r: 5, fill: '#0ea5e9', strokeWidth: 3, stroke: '#0d0d12' }} activeDot={{ r: 7, fill: '#0ea5e9', strokeWidth: 3, stroke: '#0d0d12' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white/[0.03] rounded-2xl border border-white/10 shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-pearl tracking-wide">Utilisateurs récents</h3>
                <p className="text-[10px] text-pearl/40 font-bold mt-1 uppercase tracking-widest">Dernières inscriptions</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                <UserCheck size={16} />
              </div>
            </div>
          </div>
          <div className="flex-1 divide-y divide-white/5 overflow-y-auto custom-scrollbar">
            {stats.recent_users.map(u => (
              <div key={u.id} className="p-4 flex items-center gap-3 hover:bg-white/[0.03] transition-colors group">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] text-pearl flex items-center justify-center font-black text-sm shadow-sm">
                  {u.nom?.slice(0, 1)?.toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-pearl truncate">{u.nom}</p>
                  <p className="text-[10px] text-pearl/40 font-medium truncate">{u.email}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                  u.role === 'ADMIN' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                  u.role === 'FOURNISSEUR' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                  'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-white/5 bg-white/[0.02]">
            <Link to="/admin/utilisateurs" className="w-full py-3 bg-white/[0.03] border border-white/10 rounded-xl text-[10px] font-black text-pearl/60 uppercase tracking-widest hover:border-[#0ea5e9] hover:text-[#0ea5e9] transition-all flex items-center justify-center gap-2">
              Tous les utilisateurs <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* User Breakdown + Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Breakdown */}
        <div className="bg-white/[0.03] rounded-2xl border border-white/10 shadow-sm p-6">
          <h3 className="text-sm font-black text-pearl tracking-wide mb-6">Répartition des utilisateurs</h3>
          <div className="space-y-4">
            {[
              { label: 'Administrateurs', count: stats.user_breakdown?.admin || 0, color: 'bg-red-500', bgLight: 'bg-red-50', textColor: 'text-red-400' },
              { label: 'Fournisseurs', count: stats.user_breakdown?.fournisseur || 0, color: 'bg-sky-500', bgLight: 'bg-sky-50', textColor: 'text-sky-400' },
              { label: 'Clients', count: stats.user_breakdown?.client || 0, color: 'bg-sky', bgLight: 'bg-emerald-50', textColor: 'text-emerald-400' },
            ].map(item => {
              const total = stats.total_users || 1;
              const pct = Math.round((item.count / total) * 100);
              return (
                <div key={item.label} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-pearl/60">{item.label}</span>
                    <span className={`text-xs font-black ${item.textColor}`}>{item.count} ({pct}%)</span>
                  </div>
                  <div className="h-2.5 bg-white/[0.05] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="lg:col-span-2 bg-white/[0.03] rounded-2xl border border-white/10 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black text-pearl tracking-wide">Accès rapide</h3>
            <div className="flex items-center gap-2 text-[10px] font-bold text-pearl/40">
              <Layers size={12} /> {quickLinks.length} sections
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {quickLinks.map(link => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="group flex flex-col p-4 rounded-xl border border-white/5 hover:border-[#0ea5e9]/30 hover:shadow-lg hover:shadow-[#0ea5e9]/5 transition-all duration-300 bg-white/[0.02] hover:bg-white/[0.03]"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#0ea5e9]/8 text-[#0ea5e9] flex items-center justify-center border border-[#0ea5e9]/10 mb-3 group-hover:scale-110 group-hover:bg-[#0ea5e9] group-hover:text-pearl transition-all duration-300">
                    <Icon size={18} />
                  </div>
                  <span className="text-sm font-bold text-pearl/90 group-hover:text-[#0ea5e9] transition-colors">{link.label}</span>
                  <span className="text-[10px] text-pearl/40 font-medium mt-0.5">{link.desc}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Live Site Preview */}
      <Link
        to="/"
        className="group block relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d0d12] via-[#16161e] to-[#070709] p-8 shadow-xl border border-white/10 hover:shadow-2xl hover:border-sky/20 transition-all duration-500"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#0ea5e9]/20 to-transparent rounded-full -translate-y-1/3 translate-x-1/4 blur-2xl group-hover:scale-125 transition-transform duration-700" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/15 group-hover:bg-sky transition-all duration-500">
              <Eye size={24} className="text-sky group-hover:text-pearl transition-colors" />
            </div>
            <div>
              <h3 className="text-lg font-black text-pearl tracking-tight">Accéder à la Boutique</h3>
              <p className="text-pearl/50 text-sm font-medium">Naviguez en conditions réelles tout en conservant vos accès de gestion</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-pearl/40 group-hover:text-pearl/80 transition-colors">
            <span className="text-xs font-bold uppercase tracking-widest hidden md:block">Mode Client</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </div>
  );
}
