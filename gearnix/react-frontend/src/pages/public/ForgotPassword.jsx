import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Smartphone, ArrowRight, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  const [telephone, setTelephone] = useState('');
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await forgotPassword(telephone);
      toast.success(response.message);
      navigate('/reset-password', { state: { userId: response.user_id, telephone } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'envoi du code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-black flex items-center justify-center px-4">
      <div className="max-w-[440px] w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Link 
          to="/login"
          className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest mb-8 hover:translate-x-[-4px] transition-transform"
        >
          <ArrowLeft size={16} /> Retour à la connexion
        </Link>

        <div className="w-16 h-16 bg-black text-white flex items-center justify-center mb-8">
          <Smartphone size={32} />
        </div>
        
        <h1 className="text-[26px] md:text-[32px] font-[900] italic uppercase tracking-tighter leading-[1] mb-6">
          MOT DE PASSE <br /> OUBLIÉ ?
        </h1>
        
        <p className="text-sm font-medium mb-10 leading-snug">
          Saisis ton numéro de téléphone pour recevoir un code de réinitialisation par SMS.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="gl-input-group">
            <input
              type="tel"
              required
              placeholder=" "
              className="gl-input"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
            />
            <label className="gl-label">TÉLÉPHONE *</label>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="gl-cta group"
            >
              <span className="text-sm font-[900] italic tracking-widest">
                {loading ? 'ENVOI...' : 'ENVOYER LE CODE'}
              </span>
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
