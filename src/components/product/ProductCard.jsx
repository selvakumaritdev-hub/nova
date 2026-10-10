import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag, Star, Check, Layers, RotateCw, Zap, ShieldCheck } from 'lucide-react';
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
        transition={{ duration: 0.25 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="glass-panel-interactive"
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          boxShadow: isHovered ? 'var(--shadow-md)' : 'var(--shadow-sm)',
          transition: 'box-shadow 0.2s ease, border-color 0.2s ease'
        }}
      >
        {/* Top Badges Stack (Amazon Style) */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            pointerEvents: 'none'
          }}
        >
          {product.isBestSeller && (
            <span className="badge-bestseller">
              #1 Best Seller
            </span>
          )}
          {product.isFlashSale && (
            <span className="badge-prime-deal">
              Deal of the Day
            </span>
          )}
          {product.discountPercentage > 15 && !product.isFlashSale && (
            <span className="badge badge-sale">
              -{product.discountPercentage}% OFF
            </span>
          )}
          {product.isNew && !product.isBestSeller && !product.isFlashSale && (
            <span className="badge badge-new">
              NEW
            </span>
          )}
        </div>

        {/* Wishlist Top-Right Button */}
        <button
          onClick={handleWishlistClick}
          className="btn-icon"
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 10,
            width: '34px',
            height: '34px',
            background: inWish ? 'rgba(244, 63, 94, 0.2)' : 'rgba(9, 11, 16, 0.75)',
            borderColor: inWish ? 'var(--accent-rose)' : 'var(--border-subtle)',
            color: inWish ? 'var(--accent-rose)' : 'var(--text-primary)',
            backdropFilter: 'blur(8px)'
          }}
          aria-label={inWish ? "Remove from wishlist" : "Add to wishlist"}
        >
          <motion.div whileTap={{ scale: 0.75 }}>
            <Heart size={16} fill={inWish ? "currentColor" : "none"} />
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
              const fallback = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80";
              if (e.target.src !== fallback) {
                e.target.src = fallback;
              } else {
                e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'><rect width='400' height='400' fill='%2312151e'/><text x='200' y='210' font-family='sans-serif' font-size='16' fill='%236366f1' text-anchor='middle' font-weight='bold'>NOVA LUXURY</text></svg>";
              }
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)'
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
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(9, 11, 16, 0.8)',
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

          {/* Hover Quick Action Buttons */}
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              right: '10px',
              display: 'flex',
              gap: '6px',
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              pointerEvents: isHovered ? 'auto' : 'none',
              zIndex: 5
            }}
          >
            <button
              onClick={handleQuickViewClick}
              className="btn btn-secondary btn-sm"
              style={{
                flex: 1,
                background: 'rgba(15, 19, 28, 0.92)',
                backdropFilter: 'blur(10px)',
                boxShadow: 'var(--shadow-sm)',
                fontSize: '0.75rem',
                padding: '6px 8px'
              }}
            >
              <Eye size={13} />
              <span>Quick View</span>
            </button>

            <button
              onClick={handleCompareClick}
              className="btn-icon btn-sm"
              style={{
                width: '32px',
                height: '32px',
                background: inComp ? 'var(--accent-primary)' : 'rgba(15, 19, 28, 0.92)',
                color: inComp ? '#FFFFFF' : 'var(--text-primary)',
                backdropFilter: 'blur(10px)'
              }}
              title={inComp ? "Remove from compare" : "Add to compare"}
            >
              <Layers size={13} />
            </button>
          </div>
        </Link>

        {/* Product Details Content */}
        <div style={{ padding: '12px 14px 14px', display: 'flex', flexDirection: 'column', flex: 1, gap: '6px' }}>
          {/* Brand & Category */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span
              style={{
                fontSize: '0.72rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: 700,
                color: 'var(--text-muted)'
              }}
            >
              {product.brand}
            </span>
            <span style={{ fontSize: '0.68rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
              {product.category}
            </span>
          </div>

          {/* Title */}
          <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
            <h3
              style={{
                fontSize: '0.88rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                lineHeight: 1.35,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                minHeight: '2.7em'
              }}
              title={product.title}
            >
              {product.title}
            </h3>
          </Link>

          {/* Star Rating Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', fontWeight: 600 }}>
            <div style={{ display: 'flex', gap: '2px' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  fill={i < Math.floor(product.rating) ? '#F59E0B' : 'none'}
                  color="#F59E0B"
                />
              ))}
            </div>
            <span style={{ color: 'var(--text-primary)', fontWeight: 700, marginLeft: '2px' }}>{product.rating}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>({product.reviewsCount})</span>
          </div>

          {/* Fast Delivery Badge (Amazon Prime Style) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            <span className="badge-prime-tag">
              <Zap size={11} fill="currentColor" /> Nova+
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Get it by {product.deliveryDays === 1 ? 'Tomorrow' : 'in 2 days'}
            </span>
          </div>

          {/* Price Lockup */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: 'auto', paddingTop: '6px' }}>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--accent-rose)', fontWeight: 700 }}>
                  ({product.discountPercentage}% off)
                </span>
              </>
            )}
          </div>

          {/* Add to Cart Quick Button */}
          <button
            onClick={handleQuickAdd}
            className="btn-amazon-quick"
            style={{ marginTop: '8px' }}
          >
            {isAdded ? (
              <>
                <Check size={14} color="#059669" />
                <span style={{ color: '#059669' }}>Added to Cart</span>
              </>
            ) : (
              <>
                <ShoppingBag size={13} />
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
