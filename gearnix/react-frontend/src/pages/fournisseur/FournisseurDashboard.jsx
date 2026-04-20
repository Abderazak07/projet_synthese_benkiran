import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Package, TrendingUp, AlertTriangle, ArrowRight, ShoppingBag,
  BarChart3, Calendar, Eye, Boxes, ArrowUpRight, Activity,
  Image as ImageIcon
} from 'lucide-react';

export default function FournisseurDashboard() {
  const [stats, setStats] = useState({
    produits: 0, stockTotal: 0, alertesStock: [], topProducts: [], totalCategories: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/produits').then(res => {
      const myProds = res.data;
      const catSet = new Set(myProds.map(p => p.categorie).filter(Boolean));
      // Sort products by stock to get top and low stock
      const sorted = [...myProds].sort((a, b) => b.stock - a.stock);
      setStats({
        produits: myProds.length,
        stockTotal: myProds.reduce((sum, p) => sum + p.stock, 0),
        alertesStock: myProds.filter(p => p.stock < 10),
        topProducts: sorted.slice(0, 5),
        totalCategories: catSet.size,
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      title: 'Catalogue Actif',
      value: stats.produits,
      icon: Package,
      gradient: 'from-sky to-sky-700',
      bgLight: 'bg-sky/10',
      textColor: 'text-sky',
      borderColor: 'border-sky/20',
    },
    {
      title: 'Inventaire Disponible',
      value: stats.stockTotal,
      icon: Boxes,
      gradient: 'from-indigo-500 to-blue-600',
      bgLight: 'bg-indigo-500/10',
      textColor: 'text-indigo-400',
      borderColor: 'border-indigo-500/20',
    },
    {
      title: 'Secteurs Produits',
      value: stats.totalCategories,
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-green-600',
      bgLight: 'bg-emerald-500/10',
      textColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/20',
    },
    {
      title: 'Ruptures Critiques',
      value: stats.alertesStock.length,
      icon: AlertTriangle,
      gradient: 'from-sky-500 to-sky-600',
      bgLight: 'bg-sky-500/10',
      textColor: 'text-sky-400',
      borderColor: 'border-sky-500/20',
      alert: stats.alertesStock.length > 0,
    },
  ];

  return (
    <div className="space-y-8 w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d0d12] via-[#16161e] to-[#0c1a25] p-8 shadow-xl border border-sky/10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-sky/10 rounded-full translate-y-1/2 blur-2xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-sky/10 flex items-center justify-center border border-sky/20">
                <BarChart3 size={20} className="text-sky" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-pearl/50">Espace vendeur</span>
            </div>
            <h1 className="text-3xl font-black text-pearl tracking-tight">
              Mon Espace Fournisseur
            </h1>
            <p className="text-pearl/60 mt-2 text-sm font-medium">
              Synthèse de votre activité, gestion du stock et suivi des commandes.
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
            <div key={card.title} className={`group relative bg-white/[0.03] rounded-2xl border ${card.alert ? 'border-sky-200' : 'border-white/10'} p-6 hover:shadow-xl transition-all duration-500 overflow-hidden`}>
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.gradient} opacity-[0.04] rounded-full -translate-y-8 translate-x-8 group-hover:opacity-[0.08] group-hover:scale-125 transition-all duration-700`} />
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-5">
                  <div className={`w-12 h-12 rounded-2xl ${card.bgLight} ${card.textColor} flex items-center justify-center border ${card.borderColor} group-hover:scale-110 transition-transform duration-500`}>
                    <Icon size={22} strokeWidth={2.5} />
                  </div>
                  {card.alert && (
                    <div className="flex items-center gap-1 text-[10px] font-black text-sky-400 bg-sky-500/100/10 px-2.5 py-1 rounded-lg border border-sky-500/20 animate-pulse">
                      Attention
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

      {/* Alerts + Products Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Alerts */}
        <div className="bg-white/[0.03] rounded-2xl border border-white/10 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-pearl tracking-wide flex items-center gap-2">
                <AlertTriangle className="text-sky-500" size={16} /> Alertes de réapprovisionnement
              </h2>
              <p className="text-[10px] text-pearl/40 font-bold mt-1 uppercase tracking-widest">Produits avec stock &lt; 10</p>
            </div>
            <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg border ${
              stats.alertesStock.length > 0 ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/100/10 text-emerald-400 border-emerald-500/20'
            }`}>
              {stats.alertesStock.length > 0 ? `${stats.alertesStock.length} alertes` : 'Tout va bien'}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {stats.alertesStock.length > 0 ? (
              <div className="p-4 space-y-3">
                {stats.alertesStock.map(p => (
                  <div key={p.id} className="flex justify-between items-center bg-white/[0.02] p-4 rounded-xl border border-white/5 hover:bg-white/[0.03] hover:shadow-lg hover:shadow-black/20 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                        {p.image ? (
                          <img src={p.image} className="h-full w-full object-cover" loading="lazy" alt={p.nom} />
                        ) : (
                          <ImageIcon size={16} className="text-pearl/40" />
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-pearl text-sm group-hover:text-[#0ea5e9] transition-colors">{p.nom}</span>
                        <p className="text-[10px] font-mono text-pearl/40 tracking-widest mt-0.5">#{p.id}</p>
                      </div>
                    </div>
                    <span className={`font-black border px-3 py-1.5 rounded-xl text-xs shadow-sm ${
                      p.stock === 0 
                        ? 'text-red-700 bg-red-100 border-red-200' 
                        : 'text-sky-600 bg-sky-100 border-sky-200'
                    }`}>
                      {p.stock === 0 ? 'RUPTURE' : `${p.stock} restant${p.stock > 1 ? 's' : ''}`}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/100/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                  <Package size={28} />
                </div>
                <div>
                  <p className="text-white/90 font-bold mb-1">Stock optimal</p>
                  <p className="text-pearl/40 text-sm font-medium px-8">Tous vos produits ont un niveau de stock suffisant.</p>
                </div>
              </div>
            )}
          </div>

          {stats.alertesStock.length > 0 && (
            <div className="p-4 border-t border-white/5 bg-white/[0.02]">
              <Link to="/fournisseur/produits" className="text-xs font-bold text-[#0ea5e9] hover:underline flex items-center justify-center gap-2 uppercase tracking-wide py-2">
                Mettre à jour le stock <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white/[0.03] rounded-2xl border border-white/10 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-pearl tracking-wide flex items-center gap-2">
                <Activity className="text-sky" size={16} /> Articles Performants
              </h2>
              <p className="text-[10px] text-pearl/40 font-bold mt-1 uppercase tracking-widest">Classement par volume</p>
            </div>
          </div>

          <div className="flex-1 divide-y divide-white/5 overflow-y-auto custom-scrollbar">
            {stats.topProducts.map((p, index) => (
              <div key={p.id} className="p-4 flex items-center gap-4 hover:bg-white/[0.03] transition-colors group">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${
                  index === 0 ? 'bg-sky-500/100/10 text-sky-400 border border-sky-500/20' :
                  index === 1 ? 'bg-white/[0.05] text-gray-400 border border-white/10' :
                  index === 2 ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                  'bg-white/[0.04] text-pearl/40 border border-white/5'
                }`}>
                  {index + 1}
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                  {p.image ? (
                    <img src={p.image} className="h-full w-full object-cover" loading="lazy" alt={p.nom} />
                  ) : (
                    <Package size={16} className="text-pearl/40" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-pearl truncate group-hover:text-[#0ea5e9] transition-colors">{p.nom}</p>
                  <p className="text-[10px] text-pearl/40 font-medium">{p.categorie || 'Sans catégorie'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-pearl">{p.stock}</p>
                  <p className="text-[10px] text-pearl/40">en stock</p>
                </div>
              </div>
            ))}
            {stats.topProducts.length === 0 && (
              <div className="py-16 text-center text-pearl/40">
                <Package size={32} className="mx-auto mb-3 text-slate-300" />
                <p className="font-bold text-sm">Aucun produit</p>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/5 bg-white/[0.02]">
            <Link to="/fournisseur/produits" className="w-full py-3 bg-white/[0.03] border border-white/10 rounded-xl text-[10px] font-black text-pearl/60 uppercase tracking-widest hover:border-[#0ea5e9] hover:text-[#0ea5e9] transition-all flex items-center justify-center gap-2">
              Voir tous les produits <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Link
          to="/fournisseur/produits"
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] p-8 shadow-lg border border-white/10 hover:shadow-xl transition-all duration-500"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/4 blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/15 group-hover:bg-white/20 transition-all">
              <Package size={26} className="text-pearl" />
            </div>
            <div>
              <h3 className="text-lg font-black text-pearl">Mon Catalogue</h3>
              <p className="text-pearl/60 text-sm font-medium mt-1">Gérer vos produits, stocks et images</p>
            </div>
            <ArrowRight size={20} className="ml-auto text-pearl/40 group-hover:text-pearl/80 group-hover:translate-x-1 transition-all" />
          </div>
        </Link>

        <Link
          to="/fournisseur/commandes"
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-8 shadow-lg border border-white/10 hover:shadow-xl transition-all duration-500"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#0ea5e9]/10 rounded-full -translate-y-1/3 translate-x-1/4 blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/15 group-hover:bg-white/20 transition-all">
              <ShoppingBag size={26} className="text-pearl" />
            </div>
            <div>
              <h3 className="text-lg font-black text-pearl">Mes Commandes</h3>
              <p className="text-pearl/60 text-sm font-medium mt-1">Suivre et traiter les commandes clients</p>
            </div>
            <ArrowRight size={20} className="ml-auto text-pearl/40 group-hover:text-pearl/80 group-hover:translate-x-1 transition-all" />
          </div>
        </Link>
      </div>
    </div>
  );
}
