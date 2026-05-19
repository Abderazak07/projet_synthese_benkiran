import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function Contact() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.nom || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Envoi du message...');
    try {
      await api.post('/contacts', {
        nom: formData.name,
        email: formData.email,
        message: formData.message
      });
      toast.success('Message envoyé avec succès ! Nous vous répondrons très vite.', { id: loadingToast });
      setFormData({ name: formData.name, email: formData.email, message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'envoi du message", { id: loadingToast });
    }
  };

  return (
    <div className="relative bg-white min-h-[85vh] py-16 font-sans overflow-hidden z-0 flex flex-col justify-center">
      {/* Massive Watermark */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-black italic tracking-tighter text-adi-silver/60 whitespace-nowrap pointer-events-none -z-10 select-none">
        CONTACT
      </div>

      <div className="adi-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* Left Column */}
          <div className="flex flex-col gap-8">
            <div className="inline-flex items-center gap-2 border-2 border-black px-4 py-2 self-start bg-white">
              <Mail size={16} />
              <span className="text-xs font-black uppercase tracking-widest">Contact</span>
            </div>

            <div>
              <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none mb-6">
                Get in touch
              </h1>
              <p className="text-lg font-bold text-adi-gray leading-relaxed max-w-md">
                Vous avez des questions ou vous êtes prêt à passer au niveau supérieur avec notre équipement ? L'équipe Gearnix est à votre écoute.
              </p>
            </div>

            <div className="flex flex-col gap-4 mt-4">
              {/* Card 1 */}
              <a href="mailto:contact@gearnix.com" className="group flex items-center justify-between p-6 bg-white border-2 border-black hover:bg-black hover:text-white transition-colors duration-300">
                <div className="flex items-center gap-6">
                  <div className="bg-adi-silver p-3 group-hover:bg-white/20 transition-colors">
                    <Mail size={24} className="text-black group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest mb-1">Email us</h3>
                    <p className="text-sm font-bold text-adi-gray group-hover:text-adi-silver">contact@gearnix.com</p>
                  </div>
                </div>
                <ArrowRight size={24} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
              </a>

              {/* Card 2 */}
              <a href="tel:+212500000000" className="group flex items-center justify-between p-6 bg-white border-2 border-black hover:bg-black hover:text-white transition-colors duration-300">
                <div className="flex items-center gap-6">
                  <div className="bg-adi-silver p-3 group-hover:bg-white/20 transition-colors">
                    <Phone size={24} className="text-black group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest mb-1">Call us</h3>
                    <p className="text-sm font-bold text-adi-gray group-hover:text-adi-silver">+212 (0)5 00 00 00 00</p>
                  </div>
                </div>
                <ArrowRight size={24} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
              </a>

              {/* Card 3 */}
              <div className="group flex items-center justify-between p-6 bg-white border-2 border-black hover:bg-black hover:text-white transition-colors duration-300 cursor-pointer">
                <div className="flex items-center gap-6">
                  <div className="bg-adi-silver p-3 group-hover:bg-white/20 transition-colors">
                    <MapPin size={24} className="text-black group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest mb-1">Our location</h3>
                    <p className="text-sm font-bold text-adi-gray group-hover:text-adi-silver">Casablanca, Maarif, MA</p>
                  </div>
                </div>
                <ArrowRight size={24} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] lg:mt-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-black">Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full border-2 border-adi-silver bg-adi-silver/30 px-4 py-4 text-sm font-bold focus:border-black focus:bg-white outline-none transition-all placeholder:text-adi-gray"
                  placeholder="Votre nom complet"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-black">Email</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full border-2 border-adi-silver bg-adi-silver/30 px-4 py-4 text-sm font-bold focus:border-black focus:bg-white outline-none transition-all placeholder:text-adi-gray"
                  placeholder="nom@exemple.com"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-black">Message</label>
                <textarea 
                  required
                  rows={5}
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full border-2 border-adi-silver bg-adi-silver/30 px-4 py-4 text-sm font-bold focus:border-black focus:bg-white outline-none transition-all resize-none placeholder:text-adi-gray"
                  placeholder="Comment pouvons-nous vous aider ?"
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-black text-white font-black italic uppercase tracking-widest py-5 mt-2 hover:bg-adi-gray transition-colors flex items-center justify-center gap-2 group"
              >
                SUBMIT <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </button>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
