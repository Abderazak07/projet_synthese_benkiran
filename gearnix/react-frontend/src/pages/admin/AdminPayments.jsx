import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { CreditCard, DollarSign, Wallet, ArrowRight, ShieldCheck, Clock, CheckCircle } from 'lucide-react';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => { fetchPayments(); }, []);
  const fetchPayments = () => api.get('/admin/paiements').then(res => setPayments(res.data));

  const changeStatus = async (id, statut) => {
    const loadingToast = toast.loading('Validation du paiement...');
    try {
      await api.put(`/admin/paiements/${id}/statut`, { statut });
      toast.success('Paiement mis à jour', { id: loadingToast });
      fetchPayments();
    } catch (e) { toast.error('Erreur', { id: loadingToast }); }
  };

  const getStatusIcon = (statut) => {
    if (statut === 'Validé') return <CheckCircle size={14} className="text-emerald-500" />;
    if (statut === 'En attente') return <Clock size={14} className="text-sky-500" />;
    return <ShieldCheck size={14} className="text-pearl/40" />;
  };

  return (
    <div className="dash-table-container bg-white/[0.03] rounded-2xl border border-white/[0.07] shadow-xl overflow-hidden">
      <div className="p-8 border-b border-white/5 bg-white/[0.03]">
        <div className="section-header">
          <div className="section-title-group">
            <h1 className="section-title">
              <div className="bullet"><CreditCard size={20} /></div>
              Transactions & Paiements
            </h1>
            <p className="section-description">Contrôlez les encaissements et validez les règlements clients.</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="dash-table">
          <thead>
            <tr>
              <th>ID Paiement</th>
              <th>Commande</th>
              <th>Date</th>
              <th>Méthode</th>
              <th>Montant</th>
              <th>Statut</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id} className="hover:bg-white/[0.04] transition-colors group">
                <td className="font-mono text-[10px] text-pearl/40">#{p.id}</td>
                <td>
                  <div className="flex items-center gap-2 font-bold text-white/80">
                    <span className="text-pearl/40"><DollarSign size={14}/></span> #{p.commande_id}
                  </div>
                </td>
                <td className="text-gray-400 text-xs">{new Date(p.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <Wallet size={14} className="text-pearl/40" />
                    <span className="text-xs font-bold text-pearl/60 uppercase tracking-widest">{p.methode || 'Carte'}</span>
                  </div>
                </td>
                <td>
                  <p className="font-black text-white">{parseFloat(p.montant).toFixed(2)} €</p>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(p.statut)}
                    <span className={`text-[10px] font-black uppercase tracking-widest ${p.statut === 'Validé' ? 'text-emerald-400' : 'text-gray-400'}`}>
                      {p.statut}
                    </span>
                  </div>
                </td>
                <td className="text-right">
                  <select 
                    className="dash-input !py-1.5 !px-3 font-bold !text-[11px] uppercase tracking-wider w-auto border-emerald-500/20 bg-emerald-50/30 text-emerald-700 group-hover:border-[#0ea5e9] transition-colors"
                    value={p.statut}
                    onChange={(e) => changeStatus(p.id, e.target.value)}
                  >
                    <option value="En attente">En attente</option>
                    <option value="Validé">Valider</option>
                    <option value="Échoué">Échoué</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
