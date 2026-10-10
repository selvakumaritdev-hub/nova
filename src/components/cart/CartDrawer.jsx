import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Sparkles, Tag, Check, Bookmark } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';

export const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountAmount,
    deliveryFee,
    totalAmount,
    freeDeliveryThreshold,
    remainingForFreeDelivery,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    saveForLater
  } = useCart();

  const { t } = useLanguage();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput);
      setCouponInput('');
    }
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'rgba(5, 7, 12, 0.75)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          justifyContent: 'flex-end'
        }}
        onClick={() => setIsCartOpen(false)}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          style={{
            width: '100%',
            maxWidth: '480px',
            height: '100%',
            background: 'var(--bg-secondary)',
            borderLeft: '1px solid var(--border-medium)',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div
            style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-card)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(99, 102, 241, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-primary)'
                }}
              >
                <ShoppingBag size={18} />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {t('cart_title')} ({cart.length})
              </h2>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="btn-icon"
              style={{ width: '36px', height: '36px' }}
              aria-label="Close cart drawer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Free Delivery Dynamic Progress Bar */}
          <div
            style={{
              padding: '12px 24px',
              background: remainingForFreeDelivery === 0 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(99, 102, 241, 0.08)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600 }}>
              <span>
                {remainingForFreeDelivery === 0
                  ? t('cart_free_delivery_unlocked')
                  : t('cart_free_delivery_progress', { amount: remainingForFreeDelivery.toLocaleString('en-IN') })}
              </span>
              <span style={{ color: remainingForFreeDelivery === 0 ? 'var(--accent-emerald)' : 'var(--accent-primary)' }}>
                {progressPercent}%
              </span>
            </div>
            <div
              style={{
                width: '100%',
                height: '6px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255,255,255,0.1)',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: '100%',
                  background: remainingForFreeDelivery === 0 ? 'var(--accent-emerald)' : 'var(--grad-primary)',
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            {cart.length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  textAlign: 'center',
                  gap: '12px',
                  color: 'var(--text-secondary)'
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-tertiary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-muted)'
                  }}
                >
                  <ShoppingBag size={28} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {t('cart_empty_title')}
                </h3>
                <p style={{ fontSize: '0.9rem', maxWidth: '280px' }}>
                  {t('cart_empty_sub')}
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/shop');
                  }}
                  className="btn btn-primary"
                  style={{ marginTop: '8px' }}
                >
                  <span>{t('cart_start_shopping')}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    padding: '14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    position: 'relative'
                  }}
                >
                  {/* Thumbnail */}
                  <Link
                    to={`/product/${item.id}`}
                    onClick={() => setIsCartOpen(false)}
                    style={{
                      width: '74px',
                      height: '74px',
                      borderRadius: 'var(--radius-xs)',
                      background: 'var(--bg-secondary)',
                      overflow: 'hidden',
                      flexShrink: 0
                    }}
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Link>

                  {/* Info */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--accent-primary)', fontWeight: 700 }}>
                      {item.brand}
                    </span>
                    <Link
                      to={`/product/${item.id}`}
                      onClick={() => setIsCartOpen(false)}
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        lineHeight: 1.3,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {item.title}
                    </Link>

                    {/* Price */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                      {item.originalPrice > item.price && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                          ₹{item.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    {/* Quantity & Save for later Row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          background: 'var(--bg-tertiary)',
                          borderRadius: 'var(--radius-xs)',
                          border: '1px solid var(--border-medium)'
                        }}
                      >
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          style={{ padding: '3px 8px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center' }}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ padding: '0 8px', fontSize: '0.85rem', fontWeight: 700 }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          style={{ padding: '3px 8px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center' }}
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => saveForLater(item.id)}
                          style={{
                            color: 'var(--text-muted)',
                            fontSize: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}
                          title="Save for Later"
                        >
                          <Bookmark size={13} />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={{ color: 'var(--accent-rose)', padding: '4px' }}
                          title="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer with Coupon & Checkout Summary */}
          {cart.length > 0 && (
            <div
              style={{
                padding: '20px 24px',
                borderTop: '1px solid var(--border-subtle)',
                background: 'var(--bg-card)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}
            >
              {/* Coupon Form */}
              {appliedCoupon ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-xs)',
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Tag size={15} color="#10B981" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                      {appliedCoupon.code} applied (-₹{discountAmount.toLocaleString('en-IN')})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    style={{ fontSize: '0.75rem', color: 'var(--accent-rose)', fontWeight: 600 }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Promo Code (NOVA10, SAVE20)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="input-field"
                    style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                  />
                  <button type="submit" className="btn btn-secondary btn-sm" style={{ flexShrink: 0 }}>
                    {t('cart_coupon_apply_btn')}
                  </button>
                </form>
              )}

              {/* Price Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>{t('cart_subtotal')}</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                    <span>{t('cart_discount')}</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>{t('cart_delivery')}</span>
                  <span>{deliveryFee === 0 ? <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>FREE</span> : `₹${deliveryFee}`}</span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '1.15rem',
                    fontWeight: 900,
                    color: 'var(--text-primary)',
                    marginTop: '6px',
                    paddingTop: '8px',
                    borderTop: '1px solid var(--border-subtle)',
                    fontFamily: 'var(--font-display)'
                  }}
                >
                  <span>{t('cart_total')}</span>
                  <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout & View Full Cart Buttons */}
              <button
                onClick={handleCheckout}
                className="btn btn-primary btn-block"
                style={{ padding: '14px', fontSize: '1rem' }}
              >
                <span>{t('cart_checkout_btn')}</span>
                <ArrowRight size={18} />
              </button>

              <Link
                to="/cart"
                onClick={() => setIsCartOpen(false)}
                style={{
                  textAlign: 'center',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  fontWeight: 600,
                  textDecoration: 'underline'
                }}
              >
                {t('cart_view_full')}
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
