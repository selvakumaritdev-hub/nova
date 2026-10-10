import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, Star, ShoppingBag, Heart, Check, RotateCw, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { Product360Viewer } from '../product/Product360Viewer';

export const QuickViewModal = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, addToCompare } = useCompare();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [show360, setShow360] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!isOpen || !product) return null;

  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail];
  const inWish = isInWishlist(product.id);
  const inComp = isInCompare(product.id);

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9998,
          background: 'rgba(5, 7, 12, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="glass-modal"
          style={{
            maxWidth: '920px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '24px',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="btn-icon"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              zIndex: 10,
              background: 'var(--bg-tertiary)'
            }}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '28px',
              alignItems: 'start'
            }}
          >
            {/* Left: Gallery & 360 viewer */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '1/1',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {show360 ? (
                  <Product360Viewer frames={product.frames360} title={product.title} />
                ) : (
                  <img
                    src={images[selectedImageIndex] || product.thumbnail}
                    alt={product.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                )}

                {/* 360 toggle button */}
                <button
                  onClick={() => setShow360(!show360)}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    background: show360 ? 'var(--accent-primary)' : 'rgba(9, 11, 16, 0.8)',
                    color: '#FFFFFF',
                    border: '1px solid var(--border-medium)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backdropFilter: 'blur(8px)',
                    zIndex: 5
                  }}
                >
                  <RotateCw size={13} />
                  <span>{show360 ? "Photo View" : "360° View"}</span>
                </button>
              </div>

              {/* Thumbnails */}
              {!show360 && images.length > 1 && (
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: 'var(--radius-xs)',
                        border: selectedImageIndex === idx ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        overflow: 'hidden',
                        flexShrink: 0,
                        opacity: selectedImageIndex === idx ? 1 : 0.6,
                        transition: 'all 0.15s'
                      }}
                    >
                      <img src={img} alt="Thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info and Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <span
                  style={{
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    fontWeight: 700,
                    color: 'var(--accent-primary)'
                  }}
                >
                  {product.brand}
                </span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '4px', lineHeight: 1.3 }}>
                  {product.title}
                </h2>
              </div>

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(245, 158, 11, 0.15)',
                    color: 'var(--accent-gold)',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}
                >
                  <Star size={14} fill="#F59E0B" color="#F59E0B" />
                  <span>{product.rating}</span>
                </div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  ({product.reviewsCount} verified reviews)
                </span>
                <span className="badge badge-success" style={{ marginLeft: 'auto' }}>
                  In Stock ({product.stock} left)
                </span>
              </div>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginTop: '4px' }}>
                <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="badge badge-sale">
                      {product.discountPercentage}% OFF
                    </span>
                  </>
                )}
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.6 }}>
                {product.description}
              </p>

              {/* Quantity Stepper */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Quantity:</span>
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
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ padding: '6px 14px', fontSize: '1.1rem', color: 'var(--text-primary)' }}
                  >
                    -
                  </button>
                  <span style={{ padding: '0 12px', fontWeight: 700 }}>{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    style={{ padding: '6px 14px', fontSize: '1.1rem', color: 'var(--text-primary)' }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button
                  onClick={handleAdd}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '14px 20px', fontSize: '1rem' }}
                >
                  {added ? <Check size={18} /> : <ShoppingBag size={18} />}
                  <span>{added ? "Added to Cart!" : "Add to Cart"}</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className="btn-icon"
                  style={{
                    width: '50px',
                    height: '50px',
                    background: inWish ? 'rgba(244, 63, 94, 0.15)' : 'var(--bg-tertiary)',
                    borderColor: inWish ? 'var(--accent-rose)' : 'var(--border-medium)',
                    color: inWish ? 'var(--accent-rose)' : 'var(--text-primary)'
                  }}
                  title="Wishlist"
                >
                  <Heart size={20} fill={inWish ? "currentColor" : "none"} />
                </button>
              </div>

              {/* Compare toggle & Full Details link */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={() => addToCompare(product)}
                  style={{
                    fontSize: '0.85rem',
                    color: inComp ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontWeight: 600,
                    textDecoration: 'underline'
                  }}
                >
                  {inComp ? "✓ Added to Compare" : "+ Add to Compare"}
                </button>

                <Link
                  to={`/product/${product.id}`}
                  onClick={onClose}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.85rem',
                    color: 'var(--accent-primary)',
                    fontWeight: 700
                  }}
                >
                  <span>View Full Product Page</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
