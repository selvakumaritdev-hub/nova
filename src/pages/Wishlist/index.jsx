import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight, TrendingDown, Star, Sparkles } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { EmptyState } from '../../components/common/EmptyState';
import { useLanguage } from '../../context/LanguageContext';

export const Wishlist = () => {
  const { wishlist, removeFromWishlist, moveToCart, moveAllToCart, clearWishlist, wishlistCount } = useWishlist();
  const { t } = useLanguage();

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '2.5rem'
        }}
      >
        <div>
          <span className="section-tag">
            <Heart size={14} fill="currentColor" />
            <span>Saved Collections</span>
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, marginTop: '6px' }}>
            {t('wishlist_title')} ({wishlistCount})
          </h1>
        </div>

        {wishlistCount > 0 && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={clearWishlist} className="btn btn-secondary btn-sm">
              <Trash2 size={15} />
              <span>Clear Wishlist</span>
            </button>
            <button onClick={moveAllToCart} className="btn btn-primary btn-sm">
              <ShoppingBag size={15} />
              <span>{t('wishlist_move_all')}</span>
            </button>
          </div>
        )}
      </div>

      {wishlistCount === 0 ? (
        <EmptyState
          icon={Heart}
          title={t('wishlist_empty')}
          subtitle={t('wishlist_empty_sub')}
          actionText={t('cart_start_shopping')}
          actionLink="/shop"
        />
      ) : (
        <div className="product-grid">
          {wishlist.map((item) => {
            const hasPriceDrop = item.savedAtPrice && item.savedAtPrice > item.price;
            const priceDifference = hasPriceDrop ? item.savedAtPrice - item.price : 0;

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-panel"
                style={{
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative'
                }}
              >
                {/* Price Drop Alert Badge */}
                {hasPriceDrop && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      zIndex: 10,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(244, 63, 94, 0.9)',
                      color: '#FFFFFF',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      boxShadow: '0 4px 12px rgba(244, 63, 94, 0.4)'
                    }}
                  >
                    <TrendingDown size={13} />
                    <span>₹{priceDifference.toLocaleString('en-IN')} Price Drop!</span>
                  </div>
                )}

                {/* Remove button */}
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="btn-icon"
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    zIndex: 10,
                    width: '34px',
                    height: '34px',
                    background: 'rgba(9, 11, 16, 0.75)'
                  }}
                  title="Remove from wishlist"
                >
                  <Trash2 size={14} color="var(--accent-rose)" />
                </button>

                {/* Image */}
                <Link
                  to={`/product/${item.id}`}
                  style={{
                    width: '100%',
                    aspectRatio: '1/1',
                    background: 'var(--bg-secondary)',
                    overflow: 'hidden',
                    display: 'block'
                  }}
                >
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Link>

                {/* Content */}
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, gap: '8px' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-primary)', fontWeight: 700 }}>
                    {item.brand}
                  </span>

                  <Link to={`/product/${item.id}`}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.4, minHeight: '2.8em' }}>
                      {item.title}
                    </h3>
                  </Link>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: 'auto' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                    {item.originalPrice > item.price && (
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                        ₹{item.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => moveToCart(item)}
                    className="btn btn-primary btn-block btn-sm"
                    style={{ marginTop: '8px' }}
                  >
                    <ShoppingBag size={15} />
                    <span>Move to Bag</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
