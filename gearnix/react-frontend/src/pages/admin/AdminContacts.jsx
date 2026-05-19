import { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Mail, Trash2, X, Eye, ArrowRight, MessageSquare, Search } from 'lucide-react';

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/contacts');
      setContacts(res.data);
    } catch (err) {
      toast.error('Erreur lors du chargement des messages');
    } finally {
      setLoading(false);
    }
  };

  const executeDelete = async () => {
    const loadingToast = toast.loading('Suppression...');
    try {
      await api.delete(`/admin/contacts/${deleteId}`);
      toast.success('Message supprimé', { id: loadingToast });
      setDeleteId(null);
      if (selectedContact?.id === deleteId) {
        setSelectedContact(null);
      }
      fetchContacts();
    } catch (err) {
      toast.error('Erreur lors de la suppression', { id: loadingToast });
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredContacts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredContacts.map(c => c.id));
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
    if (!window.confirm(`Voulez-vous supprimer les ${selectedIds.length} message(s) sélectionné(s) ?`)) return;
    const loadingToast = toast.loading('Suppression en cours...');
    try {
      await Promise.all(selectedIds.map(id => api.delete(`/admin/contacts/${id}`)));
      toast.success('Messages supprimés', { id: loadingToast });
      setSelectedIds([]);
      fetchContacts();
    } catch (err) {
      toast.error('Erreur lors de la suppression', { id: loadingToast });
    }
  };

  const filteredContacts = useMemo(() => {
    return contacts.filter(c => {
      const term = searchTerm.toLowerCase();
      return (
        c.nom.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.message.toLowerCase().includes(term)
      );
    });
  }, [contacts, searchTerm]);

  return (
    <>
      <div className="dash-table-container mb-12">
        <div className="p-8 border-b border-adi-silver">
          <div className="section-header flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="section-title flex items-center gap-3">
                <Mail size={24} className="text-black shrink-0" />
                Messages Contacts
              </h1>
              <p className="section-description">
                Gérez et répondez aux messages envoyés par les visiteurs via le formulaire "Contact Us"
              </p>
            </div>
            
            <div className="relative w-full md:w-72 mt-2 md:mt-0 shrink-0">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-adi-gray">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="dash-input !pl-10 !py-2.5 text-xs font-black uppercase tracking-wider"
                placeholder="Rechercher un message..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
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
                    checked={filteredContacts.length > 0 && selectedIds.length === filteredContacts.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>Expéditeur</th>
                <th>Email</th>
                <th>Message</th>
                <th>Date de réception</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-20">
                    <div className="flex flex-col items-center gap-4">
                       <div className="w-10 h-10 border-4 border-adi-silver border-t-black rounded-full animate-spin"></div>
                       <p className="font-black uppercase italic text-xs tracking-widest text-adi-gray">Chargement des messages...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-20 font-black uppercase italic text-adi-gray">
                    {searchTerm ? "Aucun message ne correspond à la recherche" : "Aucun message de contact"}
                  </td>
                </tr>
              ) : (
                filteredContacts.map(c => (
                  <tr key={c.id} className="hover:bg-white/[0.04] transition-colors group">
                    <td className="text-center">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-gray-300 text-[#0ea5e9] focus:ring-[#0ea5e9] cursor-pointer"
                        checked={selectedIds.includes(c.id)}
                        onChange={() => toggleSelectOne(c.id)}
                      />
                    </td>
                    <td>
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-black text-white flex items-center justify-center font-black rounded-lg shrink-0">
                          {c.nom.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black uppercase italic tracking-tighter text-sm text-gray-900 group-hover:text-[#0ea5e9] transition-colors">{c.nom}</p>
                          <p className="text-[10px] font-mono text-gray-400 mt-0.5">#{c.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="font-bold text-gray-800">{c.email}</td>
                    <td>
                      <p className="text-sm text-gray-600 max-w-[300px] truncate leading-normal">
                        {c.message}
                      </p>
                    </td>
                    <td className="font-bold text-gray-500 text-xs">
                      {new Date(c.created_at).toLocaleString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button
                          onClick={() => setSelectedContact(c)}
                          className="p-3 text-black hover:bg-black hover:text-white transition-all border border-adi-silver rounded-xl bg-white"
                          title="Lire le message"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteId(c.id)}
                          className="p-3 text-red-500 hover:bg-red-600 hover:text-white transition-all border border-adi-silver rounded-xl bg-white/[0.04]"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white border-2 border-black shadow-2xl rounded-2xl px-8 py-4 flex items-center gap-8 z-50 animate-in slide-in-from-bottom duration-300">
          <p className="text-xs font-black uppercase text-black tracking-wider flex items-center gap-2">
            <MessageSquare size={16} /> {selectedIds.length} message(s) sélectionné(s)
          </p>
          <button 
            onClick={handleBulkDelete}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg hover:shadow-red-600/20"
          >
            <Trash2 size={14} /> Supprimer la sélection
          </button>
        </div>
      )}

      {/* View Message Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in duration-200">
          <div className="bg-white max-w-lg w-full border-4 border-black shadow-[20px_20px_0_0_rgba(0,0,0,1)] rounded-3xl p-8 max-h-[85vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-black rounded-xl text-lg shrink-0 shadow-lg">
                  <Mail size={22} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-black uppercase italic tracking-tighter leading-none">Lecture Message</h3>
                  <p className="text-[10px] font-bold text-adi-gray uppercase mt-1">Reçu le {new Date(selectedContact.created_at).toLocaleString('fr-FR')}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedContact(null)}
                className="p-2 text-adi-gray hover:text-black hover:rotate-90 transition-all rounded-xl"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 border-2 border-adi-silver p-4 bg-adi-silver/10 rounded-2xl">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-adi-gray mb-1">Nom Expéditeur</p>
                  <p className="font-black uppercase italic text-sm text-black">{selectedContact.nom}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-adi-gray mb-1">Adresse Email</p>
                  <p className="font-bold text-sm text-black break-all">{selectedContact.email}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-adi-gray mb-2">Message</p>
                <div className="bg-white border-2 border-black p-5 rounded-2xl min-h-[150px] shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                  <p className="text-sm font-bold text-gray-900 leading-relaxed whitespace-pre-wrap">
                    {selectedContact.message}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-adi-silver flex gap-3">
                <a 
                  href={`mailto:${selectedContact.email}?subject=Re: Message de ${selectedContact.nom} via Gearnix`}
                  className="flex-1 bg-black hover:bg-adi-gray text-white font-black italic uppercase tracking-widest py-4 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 group text-center"
                >
                  RÉPONDRE <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
                </a>
                <button 
                  onClick={() => {
                    setDeleteId(selectedContact.id);
                  }}
                  className="px-5 py-4 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-black italic uppercase tracking-widest rounded-xl transition-colors flex items-center justify-center shrink-0"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in duration-200">
           <div className="bg-white p-10 max-w-sm w-full border-4 border-black shadow-[20px_20px_0_0_rgba(0,0,0,1)] rounded-3xl animate-in zoom-in-95">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-red-200">
                 <Trash2 size={30} />
              </div>
              <h3 className="text-2xl font-black text-black text-center uppercase italic tracking-tighter mb-2">Supprimer le message ?</h3>
              <p className="text-adi-gray text-center text-xs font-bold uppercase tracking-tight mb-8 leading-relaxed">Cette opération est irréversible. Le message sera définitivement effacé.</p>
              <div className="flex gap-4">
                 <button onClick={() => setDeleteId(null)} className="dash-btn-outline flex-1 rounded-2xl">Annuler</button>
                 <button onClick={executeDelete} className="dash-btn bg-red-600 border-red-600 flex-1 hover:bg-red-700 rounded-2xl">Supprimer</button>
              </div>
           </div>
        </div>
      )}
    </>
  );
}
