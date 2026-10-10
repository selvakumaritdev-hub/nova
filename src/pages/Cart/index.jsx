import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Bookmark,
  Tag,
  Gift,
  ShieldCheck,
  RotateCcw,
  Check
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { couponsData } from '../../data/offers';
import { EmptyState } from '../../components/common/EmptyState';
import { useLanguage } from '../../context/LanguageContext';

export const Cart = () => {
  const {
    cart,
    savedForLater,
    removeFromCart,
    updateQuantity,
    saveForLater,
    moveToCartFromSaved,
    removeFromSaved,
    subtotal,
    discountAmount,
    deliveryFee,
    totalAmount,
    freeDeliveryThreshold,
    remainingForFreeDelivery,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useCart();

  const { t } = useLanguage();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [isGiftWrap, setIsGiftWrap] = useState(false);
  const [orderNote, setOrderNote] = useState('');

  const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim()) {
      applyCoupon(couponCode);
      setCouponCode('');
    }
  };

  const finalTotal = totalAmount + (isGiftWrap ? 199 : 0);

  if (cart.length === 0 && savedForLater.length === 0) {
    return (
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        <EmptyState
          icon={ShoppingBag}
          title={t('cart_empty_title')}
          subtitle={t('cart_empty_sub')}
          actionText={t('cart_start_shopping')}
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header */}
      <div>
        <span className="section-tag">
          <ShoppingBag size={14} />
          <span>Shopping Bag</span>
        </span>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, marginTop: '6px' }}>
          {t('cart_title')} ({cart.length} items)
        </h1>
      </div>

      {/* Free Delivery Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '16px 20px',
          borderRadius: 'var(--radius-md)',
          background: remainingForFreeDelivery === 0 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(99, 102, 241, 0.08)',
          border: remainingForFreeDelivery === 0 ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(99, 102, 241, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 700 }}>
          <span>
            {remainingForFreeDelivery === 0
              ? t('cart_free_delivery_unlocked')
              : t('cart_free_delivery_progress', { amount: remainingForFreeDelivery.toLocaleString('en-IN') })}
          </span>
          <span style={{ color: remainingForFreeDelivery === 0 ? 'var(--accent-emerald)' : 'var(--accent-primary)' }}>
            {progressPercent}%
          </span>
        </div>
        <div style={{ width: '100%', height: '7px', borderRadius: 'var(--radius-full)', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
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

      {/* 2-Column Grid Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: '32px',
          alignItems: 'start'
        }}
        className="cart-layout"
      >
        {/* Left Column: Cart Items List & Saved For Later */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {cart.length > 0 && (
            <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '90px 1fr auto',
                    gap: '20px',
                    paddingBottom: '18px',
                    borderBottom: '1px solid var(--border-subtle)',
                    alignItems: 'center'
                  }}
                >
                  {/* Thumbnail */}
                  <Link
                    to={`/product/${item.id}`}
                    style={{
                      width: '90px',
                      height: '90px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-secondary)',
                      overflow: 'hidden',
                      display: 'block'
                    }}
                  >
                    <img src={item.thumbnail} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Link>

                  {/* Title & Brand */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-primary)', fontWeight: 700 }}>
                      {item.brand}
                    </span>
                    <Link to={`/product/${item.id}`} style={{ fontSize: '1rem', fontWeight: 800, lineHeight: 1.3 }}>
                      {item.title}
                    </Link>

                    {/* Quantity & Save for later controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          background: 'var(--bg-tertiary)',
                          borderRadius: 'var(--radius-xs)',
                          border: '1px solid var(--border-medium)'
                        }}
                      >
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ padding: '4px 10px' }}>
                          <Minus size={13} />
                        </button>
                        <span style={{ padding: '0 10px', fontSize: '0.85rem', fontWeight: 800 }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ padding: '4px 10px' }}>
                          <Plus size={13} />
                        </button>
                      </div>

                      <button
                        onClick={() => saveForLater(item.id)}
                        style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Bookmark size={14} />
                        <span>{t('cart_save_for_later')}</span>
                      </button>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{ fontSize: '0.8rem', color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Trash2 size={14} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                    {item.quantity > 1 && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        ₹{item.price.toLocaleString('en-IN')} each
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Saved For Later Section */}
          {savedForLater.length > 0 && (
            <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>
                {t('cart_saved_for_later')} ({savedForLater.length})
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {savedForLater.map(item => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)',
                      gap: '12px'
                    }}
                  >
                    <img src={item.thumbnail} alt={item.title} style={{ width: '56px', height: '56px', borderRadius: '6px', objectFit: 'cover' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '2px' }}>
                        ₹{item.price.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => moveToCartFromSaved(item.id)}
                        className="btn btn-primary btn-sm"
                      >
                        {t('cart_move_to_cart')}
                      </button>
                      <button
                        onClick={() => removeFromSaved(item.id)}
                        className="btn-icon btn-sm"
                      >
                        <Trash2 size={14} color="var(--accent-rose)" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary & Checkout Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            className="glass-panel"
            style={{
              padding: '24px',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px'
            }}
          >
            <h2 style={{ fontSize: '1.3rem', fontWeight: 900 }}>Order Summary</h2>

            {/* Coupons Field */}
            {appliedCoupon ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Tag size={16} color="#10B981" />
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                    {appliedCoupon.code} (-₹{discountAmount.toLocaleString('en-IN')})
                  </span>
                </div>
                <button onClick={removeCoupon} style={{ fontSize: '0.78rem', color: 'var(--accent-rose)', fontWeight: 600 }}>
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon (NOVA10, SAVE20)"
                  className="input-field"
                  style={{ fontSize: '0.85rem' }}
                />
                <button type="submit" className="btn btn-secondary btn-sm" style={{ flexShrink: 0 }}>
                  Apply
                </button>
              </form>
            )}

            {/* Recommended Coupons Chips */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                Available Coupons:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {couponsData.slice(0, 3).map(c => (
                  <button
                    key={c.code}
                    onClick={() => applyCoupon(c.code)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      background: 'var(--bg-tertiary)',
                      border: '1px dashed var(--border-medium)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--accent-gold)'
                    }}
                  >
                    {c.code} ({c.discountPercent ? `${c.discountPercent}% off` : `₹${c.flatDiscount} off`})
                  </button>
                ))}
              </div>
            </div>

            {/* Gift Wrap Option */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <input
                type="checkbox"
                checked={isGiftWrap}
                onChange={(e) => setIsGiftWrap(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--accent-primary)' }}
              />
              <Gift size={16} color="var(--accent-gold)" />
              <div style={{ flex: 1 }}>
                <span>Luxury Signature Gift Packaging</span>
                <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)' }}>+ ₹199</span>
              </div>
            </label>

            {/* Price Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.925rem', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>{t('cart_subtotal')}</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-emerald)', fontWeight: 700 }}>
                  <span>{t('cart_discount')}</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              {isGiftWrap && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Gift Wrapping</span>
                  <span>₹199</span>
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
                  fontSize: '1.35rem',
                  fontWeight: 900,
                  color: 'var(--text-primary)',
                  paddingTop: '10px',
                  borderTop: '1px solid var(--border-medium)',
                  fontFamily: 'var(--font-display)'
                }}
              >
                <span>{t('cart_total')}</span>
                <span>₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-primary btn-block btn-lg"
            >
              <span>{t('cart_checkout_btn')}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .cart-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
