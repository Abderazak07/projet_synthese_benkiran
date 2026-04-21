import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { Mail, Lock, User, Briefcase, Gamepad2, Phone, Fingerprint, Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ nom: '', prenom: '', telephone: '', genre: 'HOMME', email: '', password: '', role: 'CLIENT' });
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [smsCode, setSmsCode] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register, verifySms } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register(formData);
      toast.success('Compte créé avec succès !');
      
      if (user.role === 'FOURNISSEUR') navigate('/fournisseur');
      else navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySms = async (e) => {
    // SMS Verification Removed
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
            Rejoignez<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-sky-600">
               l'élite.
            </span>
          </h2>
          <p className="mt-6 text-sky-100/60 font-medium text-lg max-w-md">
            Créez votre compte GEARNIX pour accéder à des offres exclusives, suivre vos commandes et interagir avec la communauté.
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

        <div className="max-w-md w-full my-auto">
          <div className="mb-10 lg:mb-12">
            <h3 className="text-4xl font-black text-white tracking-tight">Inscription</h3>
            <p className="text-base text-gray-400 mt-2 font-medium">Créez votre profil en quelques secondes</p>
          </div>

          <form className="space-y-4 lg:space-y-5" onSubmit={handleRegister}>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Prénom</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-sky-400">
                    <User size={18} className="text-current" />
                  </div>
                  <input
                    type="text"
                    required
                    className="block w-full pl-11 pr-4 py-3.5 border border-white/5 rounded-2xl bg-white/[0.02] text-pearl placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-sky-500/50 focus:border-sky-500/50 focus:bg-white/[0.04] transition-all font-medium text-sm"
                    placeholder="Jean"
                    value={formData.prenom}
                    onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Nom</label>
                <div className="relative group">
                  <input
                    type="text"
                    required
                    className="block w-full px-4 py-3.5 border border-white/5 rounded-2xl bg-white/[0.02] text-pearl placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-sky-500/50 focus:border-sky-500/50 focus:bg-white/[0.04] transition-all font-medium text-sm"
                    placeholder="Dupont"
                    value={formData.nom}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Genre</label>
                <select
                  value={formData.genre}
                  onChange={(e) => setFormData({...formData, genre: e.target.value})}
                  className="block w-full px-4 py-3.5 border border-white/5 rounded-2xl bg-[#0c1a25] text-pearl focus:outline-none focus:ring-1 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all font-medium text-sm"
                >
                  <option value="HOMME">Homme</option>
                  <option value="FEMME">Femme</option>
                  <option value="AUTRE">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Téléphone</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-sky-400">
                    <Phone size={16} className="text-current" />
                  </div>
                  <input
                    type="tel"
                    required
                    className="block w-full pl-9 pr-4 py-3.5 border border-white/5 rounded-2xl bg-white/[0.02] text-pearl placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-sky-500/50 focus:border-sky-500/50 focus:bg-white/[0.04] transition-all font-medium text-sm"
                    placeholder="06 12 34 56 78"
                    value={formData.telephone}
                    onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                  />
                </div>
              </div>
            </div>

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
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                  minLength={6}
                  className="block w-full pl-11 pr-12 py-4 border border-white/5 rounded-2xl bg-white/[0.02] text-pearl placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-sky-500/50 focus:border-sky-500/50 focus:bg-white/[0.04] transition-all font-medium text-sm"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
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

            <div className="pt-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">Type de compte</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'CLIENT'})}
                  className={`py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 border transition-all text-[13px] font-black tracking-wide uppercase ${
                    formData.role === 'CLIENT' 
                      ? 'bg-sky-500/10 border-sky-500/30 text-sky-400 shadow-[0_0_0_1px_rgba(14,165,233,0.12)]' 
                      : 'bg-white/[0.02] border-white/5 text-gray-400 hover:border-sky-500/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <User size={16} /> Client
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'FOURNISSEUR'})}
                  className={`py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 border transition-all text-[13px] font-black tracking-wide uppercase ${
                    formData.role === 'FOURNISSEUR' 
                      ? 'bg-sky-500/10 border-sky-500/30 text-sky-400 shadow-[0_0_0_1px_rgba(14,165,233,0.12)]' 
                      : 'bg-white/[0.02] border-white/5 text-gray-400 hover:border-sky-500/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <Briefcase size={16} /> Vendeur
                </button>
              </div>
            </div>

            <div className="pt-6 lg:pt-8 w-full">
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl font-black text-[13px] uppercase tracking-wider shadow-lg shadow-sky-500/20"
                size="lg"
              >
                {loading ? 'Création...' : 'Créer mon compte'}
              </Button>
            </div>
          </form>
          
          <div className="mt-10 lg:mt-12 text-center">
            <p className="text-gray-500 text-sm font-medium">
              Vous avez déjà un compte ?{' '}
              <Link to="/login" className="font-bold text-sky-400 hover:text-sky-300 transition-colors">
                Connectez-vous
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
