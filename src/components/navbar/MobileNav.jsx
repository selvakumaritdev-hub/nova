import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Sparkles, Heart, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useLanguage } from '../../context/LanguageContext';

export const MobileNav = () => {
  const { totalItemCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { t } = useLanguage();

  return (
    <div
      className="mobile-bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'var(--mobile-nav-height)',
        background: 'var(--bg-glass-strong)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border-medium)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 7999,
        padding: '0 8px'
      }}
    >
      <NavLink
        to="/"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
          fontSize: '0.68rem',
          fontWeight: 700
        })}
      >
        <Home size={19} />
        <span>{t('nav_home')}</span>
      </NavLink>

      <NavLink
        to="/shop"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
          fontSize: '0.68rem',
          fontWeight: 700
        })}
      >
        <Compass size={19} />
        <span>{t('nav_shop')}</span>
      </NavLink>

      <NavLink
        to="/assistant"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: isActive ? 'var(--accent-violet)' : 'var(--text-muted)',
          fontSize: '0.68rem',
          fontWeight: 700
        })}
      >
        <Sparkles size={19} />
        <span>AI</span>
      </NavLink>

      <NavLink
        to="/wishlist"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: isActive ? 'var(--accent-rose)' : 'var(--text-muted)',
          fontSize: '0.68rem',
          fontWeight: 700,
          position: 'relative'
        })}
      >
        <div style={{ position: 'relative' }}>
          <Heart size={19} />
          {wishlistCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-6px',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: 'var(--accent-rose)',
                color: '#FFF',
                fontSize: '0.6rem',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {wishlistCount}
            </span>
          )}
        </div>
        <span>{t('nav_wishlist')}</span>
      </NavLink>

      {/* Cart Trigger */}
      <button
        onClick={() => setIsCartOpen(true)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: 'var(--text-muted)',
          fontSize: '0.68rem',
          fontWeight: 700,
          position: 'relative'
        }}
      >
        <div style={{ position: 'relative' }}>
          <ShoppingBag size={19} />
          {totalItemCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-6px',
                width: '15px',
                height: '15px',
                borderRadius: '50%',
                background: 'var(--grad-primary)',
                color: '#FFF',
                fontSize: '0.6rem',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {totalItemCount}
            </span>
          )}
        </div>
        <span>{t('nav_cart')}</span>
      </button>

      <NavLink
        to="/profile"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
          fontSize: '0.68rem',
          fontWeight: 700
        })}
      >
        <User size={19} />
        <span>{t('nav_profile')}</span>
      </NavLink>

      <style>{`
        @media (min-width: 769px) {
          .mobile-bottom-nav {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
