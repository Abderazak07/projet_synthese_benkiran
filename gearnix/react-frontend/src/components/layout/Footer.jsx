import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const defaultCategoryLinks = [
  { label: 'Claviers', to: '/produits?categorie=Keyboards' },
  { label: 'Souris gaming', to: '/produits?categorie=Mice' },
  { label: 'Casques', to: '/produits?categorie=Headphones' },
  { label: 'Contrôleurs', to: '/produits?categorie=Controllers' },
];

const supportLinks = [
  { label: 'Contact', to: '#' },
  { label: 'FAQ', to: '#' },
  { label: 'Livraison', to: '#' },
  { label: 'Garantie', to: '#' },
];

const accountLinks = {
  CLIENT: [
    { label: 'Mon panier', to: '/panier' },
    { label: 'Mes commandes', to: '/mes-commandes' },
  ],
  FOURNISSEUR: [
    { label: 'Espace fournisseur', to: '/fournisseur' },
    { label: 'Mes produits', to: '/fournisseur/produits' },
  ],
  ADMIN: [
    { label: 'Panneau admin', to: '/admin' },
    { label: 'Gérer les produits', to: '/admin/produits' },
  ],
};

export default function Footer() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const userLinks = user ? accountLinks[user.role] ?? [] : [];

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data)).catch(() => setCategories([]));
  }, []);

  const categoryLinks = categories.length > 0 ? categories.map((cat) => ({ label: cat, to: `/produits?categorie=${encodeURIComponent(cat)}` })) : defaultCategoryLinks;

  return (
    <footer className="bg-darker border-t border-white/10 pt-14 pb-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-accent text-lg font-black text-white shadow-lg shadow-primary/20">
                G
              </div>
              <div>
                <p className="text-lg font-black uppercase tracking-[0.32em] text-white">GEARNIX</p>
                <p className="text-sm text-gray-400">Une expérience gaming haut de gamme et intuitive.</p>
              </div>
            </Link>
            <p className="text-sm text-gray-400">Support 24/7 · contact@gearnix.com · +33 1 23 45 67 89</p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Boutique</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {categoryLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.to} className="hover:text-primary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Mon espace</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {user ? (
                userLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <Link to="/login" className="hover:text-primary transition-colors">
                    Connexion
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center md:flex md:justify-between md:items-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} GEARNIX. Tous droits réservés.</p>
          <div className="mt-4 flex flex-wrap gap-4 justify-center md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-white transition-colors">Conditions</a>
            <a href="#" className="hover:text-white transition-colors">Assistance</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
