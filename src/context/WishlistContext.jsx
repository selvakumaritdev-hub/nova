import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { useCart } from './CartContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { addToast } = useToast();
  const { addToCart } = useCart();

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('nova_wishlist');
      return saved ? JSON.parse(saved) : [
        {
          id: 102,
          title: "Apex Celestial Titanium Automatic Chronograph Watch",
          brand: "Apex Horology",
          price: 89999,
          originalPrice: 119999,
          savedAtPrice: 94999, // price dropped simulation!
          discountPercentage: 25,
          rating: 5.0,
          thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
          category: "accessories"
        }
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('nova_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const isInWishlist = (id) => {
    return wishlist.some(item => item.id === Number(id));
  };

  const addToWishlist = (product) => {
    if (isInWishlist(product.id)) return;
    
    setWishlist(prev => [
      ...prev,
      {
        id: product.id,
        title: product.title,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice,
        savedAtPrice: product.price + 1500, // simulate dynamic price drops for excitement
        discountPercentage: product.discountPercentage,
        rating: product.rating,
        thumbnail: product.thumbnail || (product.images && product.images[0]),
        category: product.category
      }
    ]);
    addToast('Saved to your Wishlist', 'success');
  };

  const removeFromWishlist = (id) => {
    setWishlist(prev => prev.filter(item => item.id !== Number(id)));
    addToast('Removed from Wishlist', 'info');
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const moveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  const moveAllToCart = () => {
    if (wishlist.length === 0) return;
    wishlist.forEach(item => addToCart(item));
    setWishlist([]);
    addToast('All wishlist items moved to cart!', 'success');
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        moveToCart,
        moveAllToCart,
        clearWishlist,
        wishlistCount: wishlist.length
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};
