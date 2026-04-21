import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { ArrowRight, Check } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ nom: '', prenom: '', telephone: '', genre: 'HOMME', email: '', password: '', role: 'CLIENT' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      toast.success('Compte créé avec succès !');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-black pt-20">
      {/* Adidas Register Container */}
      <div className="adi-login-container animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header */}
        <h1 className="text-[26px] md:text-[32px] font-[900] italic uppercase tracking-tighter leading-[1] mb-6">
          BIENVENUE DANS <br /> L'ADICLUB!
        </h1>

        <p className="text-sm font-medium mb-10 leading-snug uppercase tracking-tight">
          Crée ton compte Gearnix pour profiter pleinement des avantages de membre.
        </p>

        {/* Benefits Checklist */}
        <div className="grid grid-cols-1 gap-4 mb-10 bg-adi-silver/30 p-6 border-l-4 border-black">
          {[
            "LIVRAISON GRATUITE SUR TOUTES LES COMMANDES",
            "REMISE DE BIENVENUE EXCLUSIVE",
            "ACCÈS ANTICIPÉ AUX NOUVELLES RÉFÉRENCES",
            "RÉCOMPENSES ADICLUB À CHAQUE ACHAT"
          ].map((text, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-black flex items-center justify-center p-0.5">
                <Check size={10} strokeWidth={4} />
              </div>
              <span className="text-[11px] font-[900] uppercase italic tracking-[0.1em]">{text}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="gl-input-group">
              <input
                type="text"
                required
                placeholder=" "
                className="gl-input"
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
              />
              <label className="gl-label">PRÉNOM *</label>
            </div>
            <div className="gl-input-group">
              <input
                type="text"
                required
                placeholder=" "
                className="gl-input"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              />
              <label className="gl-label">NOM *</label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="gl-input-group">
              <select
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                className="gl-input appearance-none bg-white"
              >
                <option value="HOMME">HOMME</option>
                <option value="FEMME">FEMME</option>
                <option value="AUTRE">AUTRE</option>
              </select>
              <label className="gl-label !top-2 !text-[10px] !-translate-y-0 !text-black">GENRE *</label>
            </div>
            <div className="gl-input-group">
              <input
                type="tel"
                required
                placeholder=" "
                className="gl-input"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
              />
              <label className="gl-label">TÉLÉPHONE *</label>
            </div>
          </div>

          <div className="gl-input-group">
            <input
              type="email"
              required
              placeholder=" "
              className="gl-input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <label className="gl-label">ADRESSE E-MAIL *</label>
          </div>

          <div className="gl-input-group">
            <input
              type="password"
              required
              minLength={6}
              placeholder=" "
              className="gl-input"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <label className="gl-label">MOT DE PASSE *</label>
          </div>

          <div className="flex gap-4 items-start py-4">
            <input type="checkbox" required className="mt-1 w-5 h-5 border-2 border-black rounded-none appearance-none checked:bg-black checked:border-black transition-all" />
            <p className="text-[10px] font-bold text-adi-gray leading-tight uppercase">
              J'AI LU ET J'ACCEPTE LES CONDITIONS GÉNÉRALES ET LA POLITIQUE DE CONFIDENTIALITÉ DE GEARNIX. *
            </p>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="gl-cta group"
            >
              <span className="text-sm font-[900] italic tracking-widest uppercase">
                {loading ? 'CRÉATION...' : 'S\'INSCRIRE'}
              </span>
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>

        <p className="mt-12 text-center text-[11px] font-black uppercase tracking-widest text-adi-gray">
          DÉJÀ MEMBRE ?{' '}
          <Link to="/login" className="text-black underline underline-offset-4 decoration-2">
            CONNECTEZ-VOUS
          </Link>
        </p>
      </div>
    </div>
  );
}
