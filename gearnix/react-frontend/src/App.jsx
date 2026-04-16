import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Pages publiques
import Home from './pages/public/Home';
import Products from './pages/public/Products';
import ProductDetail from './pages/public/ProductDetail';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// Pages client
import Cart from './pages/client/Cart';
import Checkout from './pages/client/Checkout';
import Orders from './pages/client/Orders';
import OrderDetail from './pages/client/OrderDetail';

// Pages admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLayout from './pages/admin/AdminLayout';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminPayments from './pages/admin/AdminPayments';
import AdminDeliveries from './pages/admin/AdminDeliveries';

// Pages fournisseur
import FournisseurDashboard from './pages/fournisseur/FournisseurDashboard';
import FournisseurProducts from './pages/fournisseur/FournisseurProducts';
import FournisseurOrders from './pages/fournisseur/FournisseurOrders';
import FournisseurLayout from './pages/fournisseur/FournisseurLayout';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Route protégée par rôle
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-primary">Chargement...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

function AppRoutes() {
  return (
    <div className="flex flex-col min-h-screen bg-dark text-white">
      <Navbar />
      <main className="flex-grow pt-16">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/produits" element={<Products />} />
          <Route path="/produits/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Client, Fournisseur et Admin peuvent passer des commandes */}
          <Route path="/panier" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/mes-commandes" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/mes-commandes/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute roles={['ADMIN']}><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="utilisateurs" element={<AdminUsers />} />
            <Route path="produits" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="commandes" element={<AdminOrders />} />
            <Route path="paiements" element={<AdminPayments />} />
            <Route path="livraisons" element={<AdminDeliveries />} />
          </Route>

          {/* Fournisseur */}
          <Route path="/fournisseur" element={<ProtectedRoute roles={['FOURNISSEUR']}><FournisseurLayout /></ProtectedRoute>}>
            <Route index element={<FournisseurDashboard />} />
            <Route path="produits" element={<FournisseurProducts />} />
            <Route path="commandes" element={<FournisseurOrders />} />
          </Route>
        </Routes>
      </main>
      <Footer />
      <Toaster position="bottom-right" toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            border: '1px solid rgba(124,58,237,0.3)',
          },
        }} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
