import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  ShoppingBag,
  Zap,
  Heart,
  Layers,
  RotateCw,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  ChevronRight,
  MapPin,
  Tag,
  Share2,
  ThumbsUp,
  MessageSquarePlus,
  Plus
} from 'lucide-react';
import { apiService } from '../../services/api';
import { Product360Viewer } from '../../components/product/Product360Viewer';
import { ProductCard } from '../../components/product/ProductCard';
import { SkeletonCard } from '../../components/common/SkeletonCard';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { useRecentlyViewed } from '../../context/RecentlyViewedContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { addToast } = useToast();

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, addToCompare } = useCompare();
  const { addRecentlyViewed } = useRecentlyViewed();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [view360Active, setView360Active] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('400051');
  const [deliveryEstimate, setDeliveryEstimate] = useState('Tomorrow by 2:00 PM');
  const [isPincodeChecked, setIsPincodeChecked] = useState(true);
  const [isAdded, setIsAdded] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      setLoading(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      try {
        const prod = await apiService.getProductById(id);
        if (isMounted && prod) {
          setProduct(prod);
          addRecentlyViewed(prod);

          const related = await apiService.getRelatedProducts(prod.category, prod.id);
          setRelatedProducts(related);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error loading product detail:", err);
        if (isMounted) setLoading(false);
      }
    };

    loadProduct();
    return () => { isMounted = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ paddingTop: '5rem', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <Link to="/shop" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Return to Catalog
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail];
  const inWish = isInWishlist(product.id);
  const inComp = isInCompare(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (pincode.length >= 6) {
      setIsPincodeChecked(true);
      setDeliveryEstimate('Tomorrow by 2:00 PM (Express)');
      addToast(`Delivery available for ${pincode}!`, 'success');
    } else {
      addToast('Please enter a valid 6-digit postal pincode', 'warning');
    }
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    const reviewObj = {
      id: Date.now(),
      user: "You (Verified Buyer)",
      rating: newReviewRating,
      date: "Just Now",
      comment: newReviewText
    };

    setProduct(prev => ({
      ...prev,
      reviews: [reviewObj, ...(prev.reviews || [])],
      reviewsCount: prev.reviewsCount + 1
    }));

    setNewReviewText('');
    setIsReviewModalOpen(false);
    addToast('Your review has been submitted!', 'success');
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '5rem', display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
      {/* Breadcrumbs */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <Link to="/" style={{ color: 'var(--text-secondary)' }}>Home</Link>
        <ChevronRight size={14} />
        <Link to="/shop" style={{ color: 'var(--text-secondary)' }}>Shop</Link>
        <ChevronRight size={14} />
        <Link to={`/shop?category=${product.category}`} style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
          {product.category}
        </Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--text-primary)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '280px' }}>
          {product.title}
        </span>
      </nav>

      {/* Main Product Presentation Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '48px',
          alignItems: 'start'
        }}
      >
        {/* Left Column: Multi-Image Gallery & 360 Viewer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Main Visual Container */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '1/1',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-medium)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            {view360Active ? (
              <Product360Viewer
                frames={product.frames360}
                title={product.title}
              />
            ) : (
              <motion.img
                key={selectedImageIndex}
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
                src={images[selectedImageIndex] || product.thumbnail}
                alt={product.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            )}

            {/* 360 Toggle Button */}
            <button
              onClick={() => setView360Active(!view360Active)}
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                background: view360Active ? 'var(--accent-primary)' : 'rgba(9, 11, 16, 0.85)',
                color: '#FFFFFF',
                border: '1px solid var(--border-medium)',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backdropFilter: 'blur(12px)',
                boxShadow: 'var(--shadow-sm)',
                zIndex: 10
              }}
            >
              <RotateCw size={15} />
              <span>{view360Active ? "Back to Photos" : "Interactive 360° View"}</span>
            </button>
          </div>

          {/* Thumbnail Strip */}
          {!view360Active && images.length > 1 && (
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: 'var(--radius-sm)',
                    border: selectedImageIndex === idx ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    overflow: 'hidden',
                    flexShrink: 0,
                    opacity: selectedImageIndex === idx ? 1 : 0.65,
                    transition: 'all 0.2s',
                    background: 'var(--bg-secondary)'
                  }}
                >
                  <img src={img} alt="Thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details, Pricing, Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div>
            <span
              style={{
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 800,
                color: 'var(--accent-primary)'
              }}
            >
              {product.brand}
            </span>
            <h1
              style={{
                fontSize: '2.2rem',
                fontWeight: 900,
                lineHeight: 1.2,
                marginTop: '6px',
                letterSpacing: '-0.02em'
              }}
            >
              {product.title}
            </h1>
          </div>

          {/* Rating, Reviews, Stock */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(245, 158, 11, 0.15)',
                color: 'var(--accent-gold)',
                fontWeight: 800,
                fontSize: '0.9rem'
              }}
            >
              <Star size={15} fill="#F59E0B" color="#F59E0B" />
              <span>{product.rating}</span>
            </div>

            <a href="#reviews" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textDecoration: 'underline' }}>
              {product.reviewsCount} {t('product_reviews')}
            </a>

            <span className="badge badge-success">
              {t('product_in_stock')} ({product.stock} units)
            </span>
          </div>

          {/* Price Pod */}
          <div
            style={{
              padding: '18px 24px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'baseline',
              gap: '16px',
              flexWrap: 'wrap'
            }}
          >
            <span
              style={{
                fontSize: '2.4rem',
                fontWeight: 900,
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-display)'
              }}
            >
              ₹{product.price.toLocaleString('en-IN')}
            </span>

            {product.originalPrice > product.price && (
              <>
                <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="badge badge-sale" style={{ fontSize: '0.85rem' }}>
                  {product.discountPercentage}% OFF
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>
                  Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                </span>
              </>
            )}
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7 }}>
            {product.description}
          </p>

          {/* Available Offers Pod */}
          <div
            style={{
              padding: '14px 18px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-primary)', fontWeight: 800, fontSize: '0.85rem' }}>
              <Tag size={15} />
              <span>Available Offers & Promotions</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div>• Use code <strong>NOVA10</strong> for 10% instant checkout discount</div>
              <div>• Complimentary Express 2-Hour Delivery for NOVA+ Members</div>
              <div>• 5% Cashback in NOVA Reward Points on payment via UPI</div>
            </div>
          </div>

          {/* Pincode Estimator */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              {t('product_delivery_check')}
            </span>
            <form onSubmit={handleCheckPincode} style={{ display: 'flex', gap: '8px', maxWidth: '340px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter 6-digit pincode"
                  className="input-field"
                  style={{ paddingLeft: '34px' }}
                />
                <MapPin size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
              <button type="submit" className="btn btn-secondary btn-sm">
                {t('product_check')}
              </button>
            </form>
            {isPincodeChecked && (
              <span style={{ fontSize: '0.82rem', color: 'var(--accent-emerald)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Truck size={14} />
                <span>{t('product_est_delivery')}: <strong>{deliveryEstimate}</strong></span>
              </span>
            )}
          </div>

          {/* Quantity Stepper & Main Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Quantity:</span>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-medium)'
                }}
              >
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ padding: '8px 16px', fontSize: '1.2rem', color: 'var(--text-primary)' }}
                >
                  -
                </button>
                <span style={{ padding: '0 14px', fontWeight: 800 }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ padding: '8px 16px', fontSize: '1.2rem', color: 'var(--text-primary)' }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Main Action CTAs */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={handleAddToCart}
                className="btn btn-primary"
                style={{ flex: 1, padding: '16px 24px', fontSize: '1.05rem', minWidth: '180px' }}
              >
                {isAdded ? <Check size={20} /> : <ShoppingBag size={20} />}
                <span>{isAdded ? t('product_added') : t('product_add_to_cart')}</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="btn btn-gold"
                style={{ flex: 1, padding: '16px 24px', fontSize: '1.05rem', minWidth: '180px' }}
              >
                <Zap size={20} />
                <span>{t('product_buy_now')}</span>
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className="btn-icon"
                style={{
                  width: '56px',
                  height: '56px',
                  background: inWish ? 'rgba(244, 63, 94, 0.2)' : 'var(--bg-tertiary)',
                  borderColor: inWish ? 'var(--accent-rose)' : 'var(--border-medium)',
                  color: inWish ? 'var(--accent-rose)' : 'var(--text-primary)'
                }}
                title={t('product_add_wishlist')}
              >
                <Heart size={22} fill={inWish ? "currentColor" : "none"} />
              </button>

              <button
                onClick={() => addToCompare(product)}
                className="btn-icon"
                style={{
                  width: '56px',
                  height: '56px',
                  background: inComp ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                  color: inComp ? '#FFFFFF' : 'var(--text-primary)'
                }}
                title={t('product_compare')}
              >
                <Layers size={22} />
              </button>
            </div>
          </div>

          {/* Value Assurance Badges */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
              <ShieldCheck size={18} color="var(--accent-emerald)" />
              <span>{t('product_warranty')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
              <RotateCcw size={18} color="var(--accent-primary)" />
              <span>{t('product_returns_guarantee')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      <section className="glass-panel" style={{ padding: '32px', borderRadius: 'var(--radius-lg)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px' }}>
          {t('product_specs')}
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px'
          }}
        >
          {Object.entries(product.specs || {}).map(([key, val]) => (
            <div
              key={key}
              style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-xs)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.875rem'
              }}
            >
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{key}</span>
              <span style={{ fontWeight: 800, color: 'var(--text-primary)', textAlign: 'right' }}>{val}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Bought Together Bundle */}
      <section
        className="glass-panel"
        style={{
          padding: '32px',
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, rgba(15, 19, 28, 0.95) 100%)'
        }}
      >
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px' }}>
          {t('product_frequently_bought')}
        </h2>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '20px' }}>
          {/* Main Item */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={product.thumbnail} alt={product.title} style={{ width: '70px', height: '70px', borderRadius: '8px', objectFit: 'cover' }} />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.title}</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--text-primary)' }}>₹{product.price.toLocaleString('en-IN')}</div>
            </div>
          </div>

          <Plus size={20} color="var(--text-muted)" />

          {/* Accessory Bundle Item */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&q=80" alt="Accessory" style={{ width: '70px', height: '70px', borderRadius: '8px', objectFit: 'cover' }} />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>NOVA Armor Custom Case</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--text-primary)' }}>₹1,999</div>
            </div>
          </div>

          {/* Bundle Action */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Bundle Total:</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                ₹{(product.price + 1999).toLocaleString('en-IN')}
              </div>
            </div>
            <button
              onClick={() => {
                addToCart(product, 1);
                addToCart({
                  id: 9991,
                  title: "NOVA Armor Custom Case",
                  brand: "NOVA Armor",
                  price: 1999,
                  originalPrice: 2999,
                  thumbnail: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&q=80",
                  category: "accessories"
                }, 1);
                addToast('Bundle added to shopping bag!', 'success');
              }}
              className="btn btn-primary btn-sm"
            >
              {t('product_bundle_add')}
            </button>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section id="reviews" className="glass-panel" style={{ padding: '32px', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Customer Reviews & Ratings</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>
              <span style={{ fontWeight: 800 }}>{product.rating} out of 5</span>
              <span style={{ color: 'var(--text-muted)' }}>({product.reviewsCount} verified reviews)</span>
            </div>
          </div>

          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="btn btn-secondary btn-sm"
          >
            <MessageSquarePlus size={15} />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Reviews List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {(product.reviews || []).map((rev) => (
            <div
              key={rev.id}
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, fontSize: '0.925rem' }}>{rev.user}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rev.date}</span>
              </div>
              <div style={{ display: 'flex', gap: '2px' }}>
                {Array.from({ length: rev.rating }).map((_, i) => (
                  <Star key={i} size={13} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {rev.comment}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Write a Review Modal */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(5, 7, 12, 0.8)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px'
            }}
            onClick={() => setIsReviewModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-modal"
              style={{ padding: '24px', maxWidth: '480px', width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Write a Verified Review</h3>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[1, 2, 3, 4, 5].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setNewReviewRating(num)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                  >
                    <Star
                      size={24}
                      fill={num <= newReviewRating ? "#F59E0B" : "none"}
                      color={num <= newReviewRating ? "#F59E0B" : "var(--text-muted)"}
                    />
                  </button>
                ))}
              </div>

              <textarea
                rows={4}
                required
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
                placeholder="Share your detailed feedback on quality, packaging, and performance..."
                className="input-field"
                style={{ resize: 'none' }}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button onClick={() => setIsReviewModalOpen(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button onClick={handleAddReview} className="btn btn-primary btn-sm">
                  Submit Review
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <div className="section-header">
            <span className="section-tag">Recommended Pairings</span>
            <h2 className="section-title">You May Also Like</h2>
          </div>
          <div className="product-grid">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
