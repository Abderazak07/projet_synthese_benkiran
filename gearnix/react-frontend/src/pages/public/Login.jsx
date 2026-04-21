import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { Mail, Lock, Gamepad2, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen flex bg-[#070709] w-full">
      {/* Left Side: Fixed Visual "Sidebar" */}
      <div className="hidden lg:flex fixed top-0 left-0 h-screen w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-[#0c1a25] to-[#070709] border-r border-white/5 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614729939124-032f0b5609ce?q=80&w=1600')] bg-cover bg-center opacity-30 mix-blend-lighten" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-transparent to-transparent opacity-80" />
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 mt-12">
          <Link to="/" className="flex items-center gap-3 mb-10 w-fit">
            <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Gamepad2 size={28} className="text-ink" />
            </div>
            <span className="text-2xl font-black tracking-[0.2em] text-white">GEARNIX</span>
          </Link>
          
          <h2 className="text-5xl font-black text-white leading-tight mt-12 tracking-tight">
            L'excellence du<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-sky-600">
               gaming premium.
            </span>
          </h2>
          <p className="mt-6 text-sky-100/60 font-medium text-lg max-w-md">
            Connectez-vous pour accéder à votre espace personnalisé et découvrir nos nouvelles collections de matériel haute performance.
          </p>
        </div>

        <div className="relative z-10 text-[10px] font-black tracking-[0.3em] uppercase text-sky-500/50">
          GEARNIX © {new Date().getFullYear()}
        </div>
      </div>

      {/* Right Side: Scrollable Form Area */}
      <div className="w-full lg:w-1/2 lg:ml-[50%] min-h-screen flex items-center justify-center p-8 sm:p-12 relative z-10">
        
        {/* Mobile Header Elements */}
        <div className="absolute top-0 right-0 p-8 lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-sky-600 rounded-lg flex items-center justify-center">
              <Gamepad2 size={16} className="text-ink" />
            </div>
            <span className="font-black tracking-[0.1em] text-white">GEARNIX</span>
          </Link>
        </div>

        <div className="max-w-md w-full">
          <div className="mb-12">
            <h3 className="text-4xl font-black text-white tracking-tight">Connexion</h3>
            <p className="text-base text-gray-400 mt-2 font-medium">Entrez vos identifiants pour continuer</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Adresse Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-sky-400">
                    <Mail size={18} className="text-current" />
                  </div>
                  <input
                    type="email"
                    required
                    className="block w-full pl-11 pr-4 py-4 border border-white/5 rounded-2xl bg-white/[0.02] text-pearl placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-sky-500/50 focus:border-sky-500/50 focus:bg-white/[0.04] transition-all font-medium text-sm"
                    placeholder="nom@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Mot De Passe</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-sky-400">
                    <Lock size={18} className="text-current" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="block w-full pl-11 pr-12 py-4 border border-white/5 rounded-2xl bg-white/[0.02] text-pearl placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-sky-500/50 focus:border-sky-500/50 focus:bg-white/[0.04] transition-all font-medium text-sm"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-sky-400 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl font-black text-[13px] uppercase tracking-wider shadow-lg shadow-sky-500/20"
                size="lg"
              >
                {loading ? 'Vérification...' : 'Se connecter'}
              </Button>
            </div>
          </form>
          
          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm font-medium">
              Vous n'avez pas de compte ?{' '}
              <Link to="/register" className="font-bold text-sky-400 hover:text-sky-300 transition-colors">
                Inscrivez-vous
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
