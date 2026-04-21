import { Link } from 'react-router-dom';
import { Heart, Globe, Info, Package, ArrowRight, MapPin, MessageCircle } from 'lucide-react';

const FOOTER_DATA = [
  {
    title: 'PRODUITS',
    links: ['Chaussures', 'Vêtements', 'Accessoires', 'Nouveautés', 'Sorties de la semaine']
  },
  {
    title: 'SPORTS',
    links: ['Football', 'Running', 'Basketball', 'Training', 'Outdoor']
  },
  {
    title: 'ASSISTANCE',
    links: ['Aide & Service Client', 'Suivi de commande', 'Livraison', 'Retours & Remboursements', 'Guide des tailles', 'Paiement']
  },
  {
    title: 'INFOS SUR LA SOCIÉTÉ',
    links: ['À propos de Gearnix', 'Carrières', 'Presse', 'Durabilité']
  },
  {
    title: 'SUIVEZ-NOUS',
    links: ['Facebook', 'Instagram', 'Twitter', 'Pinterest', 'TikTok', 'YouTube']
  }
];

export default function Footer() {
  return (
    <footer className="w-full">
      {/* Membership / Newsletter Section (adiClub style) */}
      <section className="py-12 md:py-16" style={{ backgroundColor: 'var(--adi-beige)' }}>
        <div className="adi-container flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-2xl text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase mb-2">REJOIGNEZ LE CLUB. OBTENEZ -15% SUR VOTRE PREMIÈRE COMMANDE.</h2>
            <p className="text-sm font-bold uppercase tracking-tight text-adi-gray">INSCRIVEZ-VOUS GRATUITEMENT POUR ACCÉDER AUX OFFRES RÉSERVÉES AUX MEMBRES.</p>
          </div>
          <Link to="/register" className="flex-shrink-0">
            <button className="adi-btn adi-btn-black px-12 py-5 flex items-center gap-4 group">
               S'INSCRIRE GRATUITEMENT <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </Link>
        </div>
      </section>

      {/* Main Links Grid */}
      <section className="bg-white py-16 md:py-20 border-t border-adi-silver">
        <div className="adi-container">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-12 gap-x-8">
            {FOOTER_DATA.map(section => (
              <div key={section.title}>
                <h3 className="text-sm font-black italic uppercase tracking-widest mb-6">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map(label => (
                    <li key={label}>
                      <Link to="/produits" className="text-[11px] font-bold text-adi-gray hover:text-black uppercase tracking-tight transition-colors">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Legal Tier */}
      <section className="bg-black py-8 border-t border-white/10">
        <div className="adi-container">
          {/* Icons Row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
             <div className="flex gap-4">
                {[Heart, Globe, Info, MessageCircle].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 bg-white flex items-center justify-center hover:scale-105 transition-transform">
                    <Icon size={20} className="text-black" />
                  </a>
                ))}
             </div>
             <div className="flex items-center gap-8 text-[11px] font-black uppercase italic text-white/60">
                <button className="hover:text-white flex items-center gap-2 tracking-widest"><Globe size={14}/> MAROC | FRANÇAIS</button>
                <button className="hover:text-white flex items-center gap-2 tracking-widest"><MapPin size={14}/> MAGASINS</button>
             </div>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-6 gap-y-3 text-[10px] font-bold uppercase tracking-widest text-[#767677] border-t border-white/5 pt-8">
             <a href="#" className="hover:text-white">Paramètres des cookies</a>
             <span className="hidden md:inline">|</span>
             <a href="#" className="hover:text-white">Politique de Confidentialité</a>
             <span className="hidden md:inline">|</span>
             <a href="#" className="hover:text-white">Conditions Générales</a>
             <span className="hidden md:inline">|</span>
             <a href="#" className="hover:text-white">Mentions Légales</a>
             <span className="hidden md:inline">|</span>
             <a href="#" className="hover:text-white">Données de la Société</a>
             <span className="hidden md:inline ml-auto">© 2024 Gearnix Maroc SARL</span>
          </div>
        </div>
      </section>
    </footer>
  );
}
