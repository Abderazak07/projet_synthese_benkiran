import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-darker border-t border-white/5 pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="font-black text-white text-xs">G</span>
              </div>
              <span className="font-black text-lg tracking-widest text-white">GEARNIX</span>
            </Link>
            <p className="text-gray-400 text-sm">
              Redefine your gaming experience with our premium selection of electronic gears.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/produits?categorie=Keyboards" className="hover:text-primary transition-colors">Keyboards</Link></li>
              <li><Link to="/produits?categorie=Mice" className="hover:text-primary transition-colors">Gaming Mice</Link></li>
              <li><Link to="/produits?categorie=Headphones" className="hover:text-primary transition-colors">Headphones</Link></li>
              <li><Link to="/produits?categorie=Controllers" className="hover:text-primary transition-colors">Controllers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Warranty</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">Subscribe for special offers.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email" className="bg-white/5 border border-white/10 rounded px-3 py-2 text-sm w-full focus:outline-none focus:border-primary text-white" />
              <button className="glow-btn px-4 py-2 rounded text-sm text-white font-bold">Go</button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 text-center md:flex md:justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} GEARNIX. All rights reserved.</p>
          <div className="flex gap-4 justify-center mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
