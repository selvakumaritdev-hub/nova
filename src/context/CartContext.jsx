import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { couponsData } from '../data/offers';
import { useToast } from './ToastContext';

const CartContext = createContext();

const FREE_DELIVERY_THRESHOLD = 999;
const STANDARD_DELIVERY_FEE = 99;

export const CartProvider = ({ children }) => {
  const { addToast } = useToast();

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('nova_cart');
      return saved ? JSON.parse(saved) : [
        // Preload a sample luxury item for instant great initial experience
        {
          id: 101,
          title: "Nova Horizon Pro ANC Spatial Wireless Headphones",
          brand: "Nova Acoustics",
          price: 24999,
          originalPrice: 32999,
          thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
          quantity: 1,
          category: "electronics"
        }
      ];
    } catch {
      return [];
    }
  });

  const [savedForLater, setSavedForLater] = useState(() => {
    try {
      const saved = localStorage.getItem('nova_saved_for_later');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem('nova_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('nova_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('nova_saved_for_later', JSON.stringify(savedForLater));
  }, [savedForLater]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('nova_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('nova_coupon');
    }
  }, [appliedCoupon]);

  // Calculations
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon || subtotal === 0) return 0;
    if (appliedCoupon.minSpend && subtotal < appliedCoupon.minSpend) return 0;
    
    if (appliedCoupon.discountPercent) {
      return Math.round((subtotal * appliedCoupon.discountPercent) / 100);
    }
    if (appliedCoupon.flatDiscount) {
      return Math.min(appliedCoupon.flatDiscount, subtotal);
    }
    return 0;
  }, [subtotal, appliedCoupon]);

  const deliveryFee = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;
  }, [subtotal]);

  const remainingForFreeDelivery = useMemo(() => {
    return Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  }, [subtotal]);

  const totalAmount = useMemo(() => {
    return Math.max(0, subtotal - discountAmount + deliveryFee);
  }, [subtotal, discountAmount, deliveryFee]);

  const totalItemCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  // Actions
  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, {
          id: product.id,
          title: product.title,
          brand: product.brand,
          price: product.price,
          originalPrice: product.originalPrice,
          thumbnail: product.thumbnail || (product.images && product.images[0]),
          category: product.category,
          quantity: quantity
        }];
      }
    });

    addToast(`"${product.title.slice(0, 30)}..." added to bag`, 'success');
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
    addToast('Item removed from cart', 'info');
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const saveForLater = (id) => {
    const itemToSave = cart.find(item => item.id === id);
    if (itemToSave) {
      setCart(prev => prev.filter(item => item.id !== id));
      setSavedForLater(prev => {
        if (!prev.some(i => i.id === id)) {
          return [...prev, itemToSave];
        }
        return prev;
      });
      addToast('Item moved to Save for Later', 'info');
    }
  };

  const moveToCartFromSaved = (id) => {
    const itemToMove = savedForLater.find(item => item.id === id);
    if (itemToMove) {
      setSavedForLater(prev => prev.filter(item => item.id !== id));
      addToCart(itemToMove, itemToMove.quantity || 1);
    }
  };

  const removeFromSaved = (id) => {
    setSavedForLater(prev => prev.filter(item => item.id !== id));
  };

  const applyCoupon = (code) => {
    const cleanCode = (code || '').trim().toUpperCase();
    const coupon = couponsData.find(c => c.code === cleanCode);

    if (!coupon) {
      addToast('Invalid coupon code. Try NOVA10 or SAVE20', 'error');
      return false;
    }

    if (coupon.minSpend && subtotal < coupon.minSpend) {
      addToast(`Minimum cart value of ₹${coupon.minSpend} required for this coupon`, 'warning');
      return false;
    }

    setAppliedCoupon(coupon);
    addToast(`Coupon ${coupon.code} applied! Saved discount.`, 'success');
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Coupon removed', 'info');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        savedForLater,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        saveForLater,
        moveToCartFromSaved,
        removeFromSaved,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        discountAmount,
        deliveryFee,
        remainingForFreeDelivery,
        freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
        totalAmount,
        totalItemCount,
        isCartOpen,
        setIsCartOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
