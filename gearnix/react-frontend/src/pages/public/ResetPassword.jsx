import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  
  const [userId, setUserId] = useState(location.state?.userId || null);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      toast.error('Session expirée.');
      navigate('/forgot-password');
    }
  }, [userId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      return toast.error('Les mots de passe ne correspondent pas');
    }
    setLoading(true);
    try {
      await resetPassword({
        user_id: userId,
        code,
        password,
        password_confirmation: passwordConfirmation
      });
      toast.success('Mot de passe réinitialisé ! Connecte-toi.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la réinitialisation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-black flex items-center justify-center px-4">
      <div className="max-w-[440px] w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
        <button 
          onClick={() => navigate('/forgot-password')}
          className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest mb-8 hover:translate-x-[-4px] transition-transform"
        >
          <ArrowLeft size={16} /> Retour
        </button>

        <h1 className="text-[26px] md:text-[32px] font-[900] italic uppercase tracking-tighter leading-[1] mb-6">
          RÉINITIALISE TON <br /> MOT DE PASSE
        </h1>
        
        <p className="text-sm font-medium mb-10 leading-snug">
          Saisis le code reçu par SMS et ton nouveau mot de passe.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="gl-input-group">
            <input
              type="text"
              required
              maxLength={6}
              placeholder=" "
              className="gl-input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <label className="gl-label">CODE SMS *</label>
          </div>

          <div className="gl-input-group">
            <input
              type="password"
              required
              minLength={6}
              placeholder=" "
              className="gl-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className="gl-label">NOUVEAU MOT DE PASSE *</label>
          </div>

          <div className="gl-input-group">
            <input
              type="password"
              required
              placeholder=" "
              className="gl-input"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
            <label className="gl-label">CONFIRMER LE MOT DE PASSE *</label>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="gl-cta group"
            >
              <span className="text-sm font-[900] italic tracking-widest">
                {loading ? 'RÉINITIALISATION...' : 'CONFIRMER'}
              </span>
              <ShieldCheck size={22} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
