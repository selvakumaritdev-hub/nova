import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag, Star, Check, Layers, RotateCw } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { QuickViewModal } from '../modal/QuickViewModal';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, addToCompare } = useCompare();

  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!product) return null;

  const inWish = isInWishlist(product.id);
  const inComp = isInCompare(product.id);

  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail];
  const primaryImage = images[0] || product.thumbnail || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80";
  const hoverImage = images[1] || primaryImage;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleCompareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCompare(product);
  };

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.3 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="glass-panel-interactive"
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden'
        }}
      >
        {/* Top Badges */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            pointerEvents: 'none'
          }}
        >
          {product.discountPercentage > 15 && (
            <span className="badge badge-sale">
              -{product.discountPercentage}% OFF
            </span>
          )}
          {product.isNew && (
            <span className="badge badge-new">
              NEW
            </span>
          )}
          {product.stock <= 5 && (
            <span className="badge badge-gold">
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Wishlist Top-Right Button */}
        <button
          onClick={handleWishlistClick}
          className="btn-icon"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 10,
            width: '38px',
            height: '38px',
            background: inWish ? 'rgba(244, 63, 94, 0.2)' : 'rgba(9, 11, 16, 0.7)',
            borderColor: inWish ? 'var(--accent-rose)' : 'var(--border-subtle)',
            color: inWish ? 'var(--accent-rose)' : 'var(--text-primary)',
            backdropFilter: 'blur(8px)'
          }}
          aria-label={inWish ? "Remove from wishlist" : "Add to wishlist"}
        >
          <motion.div whileTap={{ scale: 0.75 }}>
            <Heart size={18} fill={inWish ? "currentColor" : "none"} />
          </motion.div>
        </button>

        {/* Image Container with Link */}
        <Link
          to={`/product/${product.id}`}
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '1/1',
            background: 'var(--bg-secondary)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {!imageLoaded && !imageError && (
            <div
              className="shimmer-bg"
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(255,255,255,0.03)'
              }}
            />
          )}

          <img
            src={isHovered && hoverImage ? hoverImage : primaryImage}
            alt={product.title}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              setImageError(true);
              e.target.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80";
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
              transform: isHovered ? 'scale(1.06)' : 'scale(1)'
            }}
            loading="lazy"
          />

          {/* 360 Feature Badge */}
          {product.frames360 && (
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                padding: '3px 8px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(9, 11, 16, 0.75)',
                border: '1px solid var(--border-subtle)',
                backdropFilter: 'blur(8px)',
                fontSize: '0.68rem',
                fontWeight: 700,
                color: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <RotateCw size={10} />
              <span>360°</span>
            </div>
          )}

          {/* Hover Quick Action Buttons Overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              right: '12px',
              display: 'flex',
              gap: '8px',
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'translateY(0)' : 'translateY(12px)',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              pointerEvents: isHovered ? 'auto' : 'none',
              zIndex: 5
            }}
          >
            <button
              onClick={handleQuickViewClick}
              className="btn btn-secondary btn-sm"
              style={{
                flex: 1,
                background: 'rgba(15, 19, 28, 0.9)',
                backdropFilter: 'blur(12px)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <Eye size={14} />
              <span>Quick View</span>
            </button>

            <button
              onClick={handleCompareClick}
              className="btn-icon btn-sm"
              style={{
                width: '34px',
                height: '34px',
                background: inComp ? 'var(--accent-primary)' : 'rgba(15, 19, 28, 0.9)',
                color: inComp ? '#FFFFFF' : 'var(--text-primary)',
                backdropFilter: 'blur(12px)'
              }}
              title={inComp ? "Remove from compare" : "Add to compare"}
            >
              <Layers size={14} />
            </button>
          </div>
        </Link>

        {/* Product Details Content */}
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, gap: '8px' }}>
          {/* Brand & Rating Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span
              style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                fontWeight: 700,
                color: 'var(--accent-primary)'
              }}
            >
              {product.brand}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
              <Star size={13} fill="#F59E0B" color="#F59E0B" />
              <span>{product.rating}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>({product.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <Link to={`/product/${product.id}`}>
            <h3
              style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                lineHeight: 1.4,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                minHeight: '2.8em'
              }}
              title={product.title}
            >
              {product.title}
            </h3>
          </Link>

          {/* Price Row */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: 'auto', paddingTop: '4px' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleQuickAdd}
            className={`btn ${isAdded ? 'btn-secondary' : 'btn-primary'} btn-block btn-sm`}
            style={{ marginTop: '8px' }}
          >
            {isAdded ? (
              <>
                <Check size={15} color="#10B981" />
                <span style={{ color: '#10B981' }}>Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag size={15} />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
};
