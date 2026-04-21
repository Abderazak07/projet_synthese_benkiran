import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { ArrowRight, Mail, Lock, X } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Bienvenue ${user.nom}`);
      if (user.role === 'ADMIN') navigate('/admin');
      else if (user.role === 'FOURNISSEUR') navigate('/fournisseur');
      else navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Identifiants invalides');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* 10000% Adidas Login Container */}
      <div className="adi-login-container animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Heading: Exact Adidas typography */}
        <h1 className="text-[26px] md:text-[34px] font-[900] italic uppercase tracking-tighter leading-[1.1] mb-6">
          TES AVANTAGES ADICLUB T'ATTENDENT
        </h1>
        
        <p className="text-sm font-medium mb-10 leading-snug">
          Profite de la livraison gratuite, de codes promo et de produits réservés aux membres en étant membre de l'adiClub.
        </p>

        {/* Social Login Section (Mockup) */}
        <div className="grid grid-cols-3 gap-2 mb-10">
           <button className="gl-social-btn group">
              <span className="font-black italic text-xs group-hover:scale-110 transition-transform tracking-widest">GOOGLE</span>
           </button>
           <button className="gl-social-btn group">
              <span className="font-black italic text-xs group-hover:scale-110 transition-transform tracking-widest">APPLE</span>
           </button>
           <button className="gl-social-btn group">
              <span className="font-black italic text-xs group-hover:scale-110 transition-transform tracking-widest">FB</span>
           </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email Input with Floating Label */}
          <div className="gl-input-group">
            <input
              type="email"
              required
              placeholder=" "
              className="gl-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="gl-label">ADRESSE E-MAIL *</label>
          </div>

          {/* Password Input with Floating Label */}
          <div className="gl-input-group">
            <input
              type="password"
              required
              placeholder=" "
              className="gl-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className="gl-label">MOT DE PASSE *</label>
          </div>

          <button className="text-[11px] font-black uppercase underline tracking-widest hover:bg-black hover:text-white px-1 transition-all">
            Mot de passe oublié ?
          </button>

          {/* Signature Adidas CTA with Shadow-Box effect */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="gl-cta group"
            >
              <span className="text-sm font-[900] italic tracking-widest">
                {loading ? 'VÉRIFICATION...' : 'CONTINUER'}
              </span>
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>

        <div className="mt-16 pt-10 border-t border-adi-silver">
           <h3 className="text-xl font-black italic uppercase tracking-tighter mb-6">PAS ENCORE MEMBRE ?</h3>
           <p className="text-sm font-medium text-adi-gray mb-8 leading-snug uppercase tracking-tight">
             Rejoignez le club et profitez de -15% sur votre première commande.
           </p>
           <Link to="/register">
              <button className="w-full h-[50px] border-2 border-black text-black font-black italic uppercase tracking-widest flex items-center justify-between px-6 hover:bg-black hover:text-white transition-all group">
                REJOINDRE L'ADICLUB <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
           </Link>
        </div>

      </div>
    </div>
  );
}
