import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { CreditCard, DollarSign, Wallet, Clock, CheckCircle, ShieldCheck, Trash2 } from 'lucide-react';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

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

  const toggleSelectAll = () => {
    if (selectedIds.length === payments.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(payments.map(p => p.id));
    }
  };

  const toggleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Voulez-vous supprimer les ${selectedIds.length} transaction(s) sélectionnée(s) ?`)) return;
    const loadingToast = toast.loading('Suppression en cours...');
    try {
      await Promise.all(selectedIds.map(id => api.delete(`/admin/paiements/${id}`)));
      toast.success('Sélection supprimée', { id: loadingToast });
      setSelectedIds([]);
      fetchPayments();
    } catch (e) {
      toast.error('Erreur lors de la suppression', { id: loadingToast });
    }
  };

  return (
    <>
      <div className="dash-table-container bg-white/[0.03] rounded-2xl border border-white/[0.07] shadow-xl overflow-hidden mb-12">
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
                <th className="w-12 text-center">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300 text-[#0ea5e9] focus:ring-[#0ea5e9] cursor-pointer"
                    checked={payments.length > 0 && selectedIds.length === payments.length}
                    onChange={toggleSelectAll}
                  />
                </th>
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
                  <td className="text-center">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-gray-300 text-[#0ea5e9] focus:ring-[#0ea5e9] cursor-pointer"
                      checked={selectedIds.includes(p.id)}
                      onChange={() => toggleSelectOne(p.id)}
                    />
                  </td>
                  <td className="font-mono text-[10px] text-gray-400">#{p.id}</td>
                  <td>
                    <div className="flex items-center gap-2 font-bold text-gray-800">
                      <span className="text-gray-400"><DollarSign size={14}/></span> #{p.commande_id}
                    </div>
                  </td>
                  <td className="text-gray-400 text-xs">{new Date(p.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Wallet size={14} className="text-gray-400" />
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">{p.methode || 'Carte'}</span>
                    </div>
                  </td>
                  <td>
                    <p className="font-black text-gray-900">{parseFloat(p.montant).toFixed(2)} MAD</p>
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

      {/* Floating Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white border-2 border-black shadow-2xl rounded-2xl px-8 py-4 flex items-center gap-8 z-50 animate-in slide-in-from-bottom duration-300">
          <p className="text-xs font-black uppercase text-black tracking-wider flex items-center gap-2">
            <CreditCard size={16} /> {selectedIds.length} sélectionné(s)
          </p>
          <button 
            onClick={handleBulkDelete}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg hover:shadow-red-600/20"
          >
            <Trash2 size={14} /> Supprimer la sélection
          </button>
        </div>
      )}
    </>
  );
}
