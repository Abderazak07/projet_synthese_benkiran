import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { Mail, Lock, Gamepad2 } from 'lucide-react';

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
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-25 bg-[url('https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?w=1600&q=80')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-lux-hero" />
      <div className="absolute inset-0 opacity-[0.06] bg-lux-grid bg-[size:60px_60px]" />

      <div className="max-w-md w-full relative z-10 lux-card p-8">
        <div className="text-center mb-10">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-sky-500 to-sky-600 rounded-full flex items-center justify-center mb-6 shadow-[0_0_0_1px_rgba(14,165,233,0.2),0_18px_60px_rgba(0,0,0,0.55)]">
            <Gamepad2 size={30} className="text-ink" />
          </div>
          <h2 className="text-3xl font-black text-pearl tracking-[0.28em] uppercase">Connexion</h2>
          <p className="mt-3 text-sm text-gray-400">Accédez à votre compte GEARNIX</p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="email"
                required
                className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-white/[0.03] text-pearl placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-sky-500/40 focus:border-sky-500/40 transition-colors"
                placeholder="Adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="password"
                required
                className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-white/[0.03] text-pearl placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-sky-500/40 focus:border-sky-500/40 transition-colors"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3"
              size="lg"
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </Button>
          </div>
        </form>
        
        <div className="mt-8 text-center text-sm">
          <p className="text-gray-400">
            Nouveau sur Gearnix ?{' '}
            <Link to="/register" className="font-semibold text-sky-500 hover:text-pearl transition-colors">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
