import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Package, TrendingUp, AlertTriangle, ArrowRight, ShoppingBag, BarChart3 } from 'lucide-react';

export default function FournisseurDashboard() {
  const [stats, setStats] = useState({ produits: 0, stockTotal: 0, alertesStock: [] });

  useEffect(() => {
    api.get('/produits').then(res => {
      const myProds = res.data;
      setStats({
        produits: myProds.length,
        stockTotal: myProds.reduce((sum, p) => sum + p.stock, 0),
        alertesStock: myProds.filter(p => p.stock < 10)
      });
    });
  }, []);

  return (
    <div className="space-y-8 w-full max-w-full">
      <div className="section-header">
        <div className="section-title-group">
          <h1 className="section-title">
            <div className="bullet"><BarChart3 size={20} /></div>
            Mon Espace Vendeur
          </h1>
          <p className="section-description">Synthèse de votre activité et gestion du stock.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="dash-card p-6 group hover:border-[#2c767c]/30 transition-all duration-300">
          <div className="w-12 h-12 rounded-2xl bg-[#2c767c]/10 text-[#2c767c] flex items-center justify-center border border-[#2c767c]/20 mb-6 group-hover:scale-110 transition-transform">
             <Package size={22} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Articles en vente</p>
          <p className="text-3xl font-black text-slate-900">{stats.produits}</p>
        </div>

        <div className="dash-card p-6 group hover:border-[#2c767c]/30 transition-all duration-300">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 mb-6 group-hover:scale-110 transition-transform">
             <TrendingUp size={22} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Volume Stock Total</p>
          <p className="text-3xl font-black text-slate-900">{stats.stockTotal}</p>
        </div>

        <div className="dash-card p-6 group hover:border-amber-200 transition-all duration-300">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 mb-6 group-hover:scale-110 transition-transform">
             <AlertTriangle size={22} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ruptures de stock</p>
          <p className="text-3xl font-black text-slate-900">{stats.alertesStock.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="dash-card p-8 bg-white border border-slate-200">
          <div className="flex items-center justify-between mb-8">
             <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle className="text-amber-500" size={16}/> Alertes de réapprovisionnement
             </h2>
             <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">Critique: Stock &lt; 10</span>
          </div>

          {stats.alertesStock.length > 0 ? (
            <div className="space-y-4">
              {stats.alertesStock.map(p => (
                <div key={p.id} className="flex justify-between items-center bg-slate-50/50 p-5 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{p.nom}</span>
                    <p className="text-[10px] font-mono text-slate-400 tracking-widest mt-0.5">#{p.id}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-red-700 font-black bg-red-100 border border-red-200 px-4 py-1.5 rounded-xl text-xs shadow-sm">
                      {p.stock} RESTANTS
                    </span>
                  </div>
                </div>
              ))}
              <div className="pt-4 text-center">
                 <Link to="/fournisseur/produits" className="text-xs font-bold text-[#2c767c] hover:underline flex items-center justify-center gap-2 uppercase tracking-wide">
                    Mettre à jour le stock <ArrowRight size={14}/>
                 </Link>
              </div>
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center gap-4 text-center">
               <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mb-2">
                  <Package size={32}/>
               </div>
               <p className="text-slate-500 text-sm font-medium px-8">Excellent ! Tous vos produits possèdent un niveau de stock optimal.</p>
            </div>
          )}
        </div>
        
        <div className="dash-card p-10 flex flex-col justify-center items-center gap-6 bg-gradient-to-br from-white to-slate-50 text-center border-dashed border-2 border-slate-200">
           <div className="w-20 h-20 rounded-3xl bg-slate-900/5 flex items-center justify-center text-slate-400 mb-4 border border-slate-100 shadow-inner">
              <ShoppingBag size={32} strokeWidth={1.5} />
           </div>
           <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Prêt à vendre davantage ?</h3>
              <p className="text-sm text-slate-500 font-medium px-6">Explorez votre catalogue ou vérifiez vos commandes récentes pour booster votre chiffre d'affaires.</p>
           </div>
           <div className="flex flex-col sm:flex-row gap-4 w-full pt-4">
              <Link to="/fournisseur/produits" className="flex-1 dash-btn py-4">Mon Catalogue</Link>
              <Link to="/fournisseur/commandes" className="flex-1 dash-btn-outline py-4">Mes Commandes</Link>
           </div>
        </div>
      </div>
    </div>
  );
}
