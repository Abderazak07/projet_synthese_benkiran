import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Smartphone, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function VerifySms() {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifySms, resendSms } = useAuth();
  
  const [userId, setUserId] = useState(location.state?.userId || null);
  const [telephone, setTelephone] = useState(location.state?.telephone || '');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      toast.error('Session de vérification expirée.');
      navigate('/login');
    }
  }, [userId, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifySms(userId, otp);
      toast.success('Téléphone vérifié !');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Code incorrect');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendSms(userId);
      toast.success('Nouveau code envoyé !');
    } catch (err) {
      toast.error('Erreur lors de l\'envoi du code');
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-black flex items-center justify-center px-4">
      <div className="max-w-[440px] w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
        <button 
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest mb-8 hover:translate-x-[-4px] transition-transform"
        >
          <ArrowLeft size={16} /> Retour
        </button>

        <div className="w-16 h-16 bg-black text-white flex items-center justify-center mb-8">
          <Smartphone size={32} />
        </div>
        
        <h1 className="text-[26px] md:text-[32px] font-[900] italic uppercase tracking-tighter leading-[1] mb-6">
          VÉRIFIE TON <br /> TÉLÉPHONE
        </h1>
        
        <p className="text-sm font-medium mb-10 leading-snug">
          Nous avons envoyé un code de vérification au <strong>{telephone}</strong>. Saisis-le ci-dessous pour activer ton compte.
        </p>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="gl-input-group">
            <input
              type="text"
              required
              maxLength={6}
              placeholder=" "
              className="gl-input text-center text-2xl tracking-[1em] font-black"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <label className="gl-label">CODE DE VÉRIFICATION *</label>
          </div>

          <div className="pt-6 space-y-4">
            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="gl-cta group"
            >
              <span className="text-sm font-[900] italic tracking-widest">
                {loading ? 'VÉRIFICATION...' : 'VÉRIFIER'}
              </span>
              <ShieldCheck size={22} className="group-hover:scale-110 transition-transform" />
            </button>

            <button
              type="button"
              onClick={handleResend}
              className="w-full text-center text-[11px] font-black uppercase tracking-widest text-adi-gray hover:text-black transition-colors"
            >
              PAS REÇU LE CODE ? RENVOYER
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
