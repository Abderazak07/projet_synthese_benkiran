import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { Mail, Lock, User, Briefcase, Gamepad2 } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ nom: '', email: '', password: '', role: 'CLIENT' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register(formData.nom, formData.email, formData.password, formData.role);
      toast.success(`Compte créé avec succès !`);
      
      if (user.role === 'FOURNISSEUR') navigate('/fournisseur');
      else navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-[400px] bg-accent/20 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10 glass-card p-8 rounded-2xl border-white/10">
        <div className="text-center mb-10">
           <div className="mx-auto w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(236,72,153,0.4)]">
            <Gamepad2 size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-widest uppercase">Join Us</h2>
          <p className="mt-2 text-sm text-gray-400">Create your GEARNIX account</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                required
                className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-lg bg-darker/50 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                placeholder="Nom complet"
                value={formData.nom}
                onChange={(e) => setFormData({...formData, nom: e.target.value})}
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="email"
                required
                className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-lg bg-darker/50 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                placeholder="Adresse email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="password"
                required
                minLength={6}
                className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-lg bg-darker/50 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                placeholder="Mot de passe (min 6 caractères)"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <div className="relative pt-2">
              <label className="text-sm text-gray-400 block mb-2">Je suis un :</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'CLIENT'})}
                  className={`py-2 px-4 rounded-lg flex items-center justify-center gap-2 border transition-all ${
                    formData.role === 'CLIENT' 
                      ? 'bg-primary/20 border-primary text-white shadow-[0_0_10px_rgba(124,58,237,0.3)]' 
                      : 'bg-darker/50 border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <User size={16} /> Client
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'FOURNISSEUR'})}
                   className={`py-2 px-4 rounded-lg flex items-center justify-center gap-2 border transition-all ${
                    formData.role === 'FOURNISSEUR' 
                      ? 'bg-accent/20 border-accent text-white shadow-[0_0_10px_rgba(236,72,153,0.3)]' 
                      : 'bg-darker/50 border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <Briefcase size={16} /> Fournisseur
                </button>
              </div>
            </div>
          </div>

          <div>
             <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-4"
            >
              {loading ? 'Création...' : 'S\'inscrire'}
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm">
          <p className="text-gray-400">
            Déjà un compte ?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-accent transition-colors">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
