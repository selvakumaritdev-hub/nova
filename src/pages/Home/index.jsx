import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Zap,
  Star,
  ShieldCheck,
  Crown,
  MapPin,
  CheckCircle,
  TrendingUp,
  RotateCw,
  Gift
} from 'lucide-react';
import { apiService } from '../../services/api';
import { categoriesData } from '../../data/categories';
import { brandsData } from '../../data/offers';
import { ProductCard } from '../../components/product/ProductCard';
import { SkeletonCard } from '../../components/common/SkeletonCard';
import { FlashSaleSection } from '../../components/common/FlashSaleSection';
import { MysteryDealCard } from '../../components/common/MysteryDealCard';
import { useLanguage } from '../../context/LanguageContext';

export const Home = () => {
  const { t, language } = useLanguage();

  const [flashProducts, setFlashProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [flash, trending, recs, all] = await Promise.all([
          apiService.getFlashSaleProducts(),
          apiService.getTrendingProducts(),
          apiService.getRecommendedProducts(),
          apiService.getProducts({ sortBy: 'newest', limit: 8 })
        ]);

        if (isMounted) {
          setFlashProducts(flash);
          setTrendingProducts(trending);
          setRecommendedProducts(recs);
          setNewArrivals(all);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error loading home page catalog data:", err);
        if (isMounted) setLoading(false);
      }
    };

    loadHomeData();
    return () => { isMounted = false; };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem', paddingBottom: '3rem' }}>
      {/* 1. HERO SECTION */}
      <section
        style={{
          position: 'relative',
          padding: '4.5rem 0 3.5rem',
          overflow: 'hidden',
          background: 'radial-gradient(ellipse at 50% 20%, rgba(99, 102, 241, 0.12) 0%, transparent 70%)'
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
              alignItems: 'center'
            }}
          >
            {/* Hero Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="section-tag">
                  <Crown size={14} color="#F59E0B" />
                  <span>{t('hero_badge_vip')}</span>
                </span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  fontWeight: 900,
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em'
                }}
              >
                {t('hero_title')}
              </h1>

              <p
                style={{
                  fontSize: '1.15rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  maxWidth: '540px'
                }}
              >
                {t('hero_subtitle')}
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '8px' }}>
                <Link to="/shop" className="btn btn-primary btn-lg">
                  <ShoppingBag size={18} />
                  <span>{t('hero_cta_shop')}</span>
                  <ArrowRight size={18} />
                </Link>

                <a href="#featured-categories" className="btn btn-secondary btn-lg">
                  <span>{t('hero_cta_categories')}</span>
                </a>
              </div>

              {/* Hero Stats Pill */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '24px',
                  marginTop: '16px',
                  paddingTop: '20px',
                  borderTop: '1px solid var(--border-subtle)',
                  flexWrap: 'wrap'
                }}
              >
                <div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                    50,000+
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {t('hero_stat_products')}
                  </div>
                </div>

                <div style={{ width: '1px', height: '28px', background: 'var(--border-medium)' }} />

                <div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--accent-emerald)', fontFamily: 'var(--font-display)' }}>
                    2-Hour
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {t('hero_stat_delivery')}
                  </div>
                </div>

                <div style={{ width: '1px', height: '28px', background: 'var(--border-medium)' }} />

                <div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--accent-gold)', fontFamily: 'var(--font-display)' }}>
                    99.8%
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {t('hero_stat_satisfaction')}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Hero Right Visual: Showcase Pod */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {/* Background Ambient Ring */}
              <div
                style={{
                  position: 'absolute',
                  width: '360px',
                  height: '360px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(236, 72, 153, 0.15) 50%, transparent 70%)',
                  filter: 'blur(50px)',
                  zIndex: 0
                }}
              />

              {/* Central Luxury Showcase Card */}
              <div
                className="glass-panel"
                style={{
                  width: '100%',
                  maxWidth: '460px',
                  borderRadius: 'var(--radius-xl)',
                  padding: '24px',
                  position: 'relative',
                  zIndex: 1,
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--border-medium)'
                }}
              >
                <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
                    alt="Nova Horizon Showcase"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />

                  {/* Floating Tag */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '14px',
                      left: '14px',
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(9, 11, 16, 0.8)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--accent-gold)',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Sparkles size={13} />
                    <span>FLAGSHIP OF THE YEAR</span>
                  </div>

                  {/* 360 Feature Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '14px',
                      right: '14px',
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(99, 102, 241, 0.9)',
                      color: '#FFF',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <RotateCw size={13} />
                    <span>360° Interactive</span>
                  </div>
                </div>

                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Nova Horizon Pro ANC</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Beryllium Transducers</p>
                  </div>

                  <Link to="/product/101" className="btn btn-primary btn-sm">
                    <span>Explore</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED CATEGORIES SECTION */}
      <section id="featured-categories" className="container">
        <div className="section-header row">
          <div>
            <span className="section-tag">Explore Collections</span>
            <h2 className="section-title">{t('section_featured_categories')}</h2>
            <p className="section-subtitle">{t('section_featured_categories_sub')}</p>
          </div>

          <Link to="/shop" className="btn btn-secondary btn-sm" style={{ marginTop: '10px' }}>
            <span>View All Categories</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '20px'
          }}
        >
          {categoriesData.map((cat) => {
            const catName = language === 'ta' ? cat.name_ta : language === 'hi' ? cat.name_hi : cat.name;

            return (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.slug}`}
                className="glass-panel-interactive"
                style={{
                  position: 'relative',
                  height: '240px',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '20px'
                }}
              >
                {/* Background Image */}
                <img
                  src={cat.image}
                  alt={catName}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease'
                  }}
                />

                {/* Dark Gradient Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(9, 11, 16, 0.1) 0%, rgba(9, 11, 16, 0.88) 85%)',
                    zIndex: 1
                  }}
                />

                {/* Category Details */}
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: cat.accent || 'var(--accent-primary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em'
                    }}
                  >
                    {cat.count}
                  </span>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>
                    {catName}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. FLASH SALE LIVE SECTION */}
      <section className="container">
        {loading ? (
          <div className="product-grid">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <FlashSaleSection products={flashProducts} />
        )}
      </section>

      {/* 4. MYSTERY DEALS VAULT SECTION */}
      <section className="container">
        <MysteryDealCard />
      </section>

      {/* 5. TRENDING PRODUCTS */}
      <section className="container">
        <div className="section-header row">
          <div>
            <span className="section-tag">
              <TrendingUp size={14} />
              <span>Hot This Week</span>
            </span>
            <h2 className="section-title">{t('section_trending')}</h2>
            <p className="section-subtitle">{t('section_trending_sub')}</p>
          </div>

          <Link to="/shop" className="btn btn-secondary btn-sm">
            <span>{t('shop_all_products')}</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {loading ? (
          <div className="product-grid">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="product-grid">
            {trendingProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* 6. RECOMMENDED FOR YOU */}
      <section className="container">
        <div className="section-header">
          <span className="section-tag">
            <Sparkles size={14} />
            <span>Curated For You</span>
          </span>
          <h2 className="section-title">{t('section_recommended')}</h2>
          <p className="section-subtitle">{t('section_recommended_sub')}</p>
        </div>

        {loading ? (
          <div className="product-grid">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="product-grid">
            {recommendedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* 7. POPULAR BRANDS MARQUEE / GRID */}
      <section className="container">
        <div className="section-header text-center" style={{ alignItems: 'center', textAlign: 'center', margin: '0 auto 2.5rem' }}>
          <span className="section-tag">Global Partners</span>
          <h2 className="section-title">{t('section_brands')}</h2>
          <p className="section-subtitle">{t('section_brands_sub')}</p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '16px'
          }}
        >
          {brandsData.map((brand, idx) => (
            <Link
              key={idx}
              to={`/shop?q=${encodeURIComponent(brand.name)}`}
              className="glass-panel-interactive"
              style={{
                padding: '24px 16px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                gap: '8px'
              }}
            >
              <span style={{ fontSize: '2.2rem' }}>{brand.logo}</span>
              <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>{brand.name}</h4>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{brand.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 8. NEW ARRIVALS */}
      <section className="container">
        <div className="section-header row">
          <div>
            <span className="section-tag">Latest Innovations</span>
            <h2 className="section-title">{t('section_new_arrivals')}</h2>
            <p className="section-subtitle">{t('section_new_arrivals_sub')}</p>
          </div>

          <Link to="/shop?sort=newest" className="btn btn-secondary btn-sm">
            <span>Explore Drops</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {loading ? (
          <div className="product-grid">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="product-grid">
            {newArrivals.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* 9. NOVA+ VIP MEMBERSHIP BANNER */}
      <section className="container">
        <div
          style={{
            borderRadius: 'var(--radius-xl)',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(15, 19, 28, 0.98) 50%, rgba(99, 102, 241, 0.15) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            padding: '48px 36px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(245, 158, 11, 0.2)',
                color: 'var(--accent-gold)',
                fontSize: '0.8rem',
                fontWeight: 800,
                width: 'fit-content'
              }}
            >
              <Crown size={15} />
              <span>NOVA BLACK ELITE</span>
            </span>

            <h2 style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1.15 }}>
              {t('section_cta_title')}
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
              {t('section_cta_sub')}
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '8px' }}>
              <Link to="/nova-plus" className="btn btn-gold btn-lg">
                <Crown size={18} />
                <span>{t('section_cta_btn')}</span>
              </Link>
            </div>
          </div>

          {/* Right Perks Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '14px'
            }}
          >
            {[
              { title: "2-Hour Free Delivery", desc: "No minimum spend" },
              { title: "5% Reward Points", desc: "Cashback on all purchases" },
              { title: "VIP Concierge", desc: "Priority 24/7 dedicated support" },
              { title: "Private Vault Drops", desc: "Early 24h drop access" }
            ].map((perk, idx) => (
              <div
                key={idx}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(9, 11, 16, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                <div style={{ color: 'var(--accent-gold)', fontWeight: 800, fontSize: '0.95rem' }}>
                  ✓ {perk.title}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '2px' }}>
                  {perk.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FLAGSHIP STORE EXPERIENCE */}
      <section className="container">
        <div className="section-header row">
          <div>
            <span className="section-tag">
              <MapPin size={14} />
              <span>Global Architecture</span>
            </span>
            <h2 className="section-title">{t('section_store_exp')}</h2>
            <p className="section-subtitle">{t('section_store_exp_sub')}</p>
          </div>

          <Link to="/stores" className="btn btn-secondary btn-sm">
            <span>Find Nearby Store</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}
        >
          {[
            {
              city: "Mumbai BKC Palace",
              img: "https://images.unsplash.com/photo-1567449303078-57ad995bd301?w=800&q=80",
              desc: "360° VR Product Pods, Champagne VIP Lounge, Valet Parking"
            },
            {
              city: "Bengaluru Tech Horizon",
              img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
              desc: "Audiophile Sound Chamber, Gaming Lounge, Artisan Roastery"
            }
          ].map((store, idx) => (
            <div
              key={idx}
              className="glass-panel"
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ width: '100%', height: '220px', position: 'relative' }}>
                <img src={store.img} alt={store.city} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(9, 11, 16, 0.8)',
                    backdropFilter: 'blur(8px)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--accent-emerald)'
                  }}
                >
                  ● Open Today
                </span>
              </div>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{store.city}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{store.desc}</p>
                <Link to="/stores" style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 700, marginTop: '4px' }}>
                  Explore Flagship Experience →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 11. CUSTOMER REVIEWS */}
      <section className="container">
        <div className="section-header text-center" style={{ alignItems: 'center', textAlign: 'center', margin: '0 auto 2.5rem' }}>
          <span className="section-tag">Verified Experiences</span>
          <h2 className="section-title">{t('section_reviews')}</h2>
          <p className="section-subtitle">{t('section_reviews_sub')}</p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px'
          }}
        >
          {[
            {
              name: "Siddharth Singhania",
              role: "NOVA Black Elite Member",
              rating: 5,
              text: "The 360° product viewer allowed me to examine the chronograph watch with extreme precision. Delivered within 90 minutes in Mumbai!",
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"
            },
            {
              name: "Pooja Hegde",
              role: "Verified Luxury Shopper",
              rating: 5,
              text: "NOVA AI Shopping Concierge found the exact skincare botanical match for my skin within seconds. Exceptional quality and authenticity.",
              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80"
            },
            {
              name: "Vikramaditya Roy",
              role: "Flagship Retail Customer",
              rating: 5,
              text: "The packaging alone feels like a luxury unboxing experience. NOVA MALL sets a completely new benchmark for global digital retail.",
              avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80"
            }
          ].map((rev, idx) => (
            <div
              key={idx}
              className="glass-panel"
              style={{
                padding: '24px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}
            >
              <div style={{ display: 'flex', gap: '4px' }}>
                {Array.from({ length: rev.rating }).map((_, i) => (
                  <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>

              <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontStyle: 'italic' }}>
                "{rev.text}"
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: 'auto' }}>
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800 }}>{rev.name}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 600 }}>{rev.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
