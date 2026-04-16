import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (produit, quantite = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === produit.id);
      if (existing) {
        return prev.map(item => item.id === produit.id
          ? { ...item, quantite: item.quantite + quantite }
          : item
        );
      }
      return [...prev, { ...produit, quantite }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id));
  
  const updateQuantity = (id, quantite) => {
    if (quantite <= 0) return removeFromCart(id);
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantite } : item));
  };

  const clearCart = () => setCart([]);
  
  const total = cart.reduce((sum, item) => sum + item.prix * item.quantite, 0);
  const count = cart.reduce((sum, item) => sum + item.quantite, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
