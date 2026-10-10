import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Clock, ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../product/ProductCard';
import { useLanguage } from '../../context/LanguageContext';

export const FlashSaleSection = ({ products = [] }) => {
  const { t } = useLanguage();

  // Dynamic countdown timer targeting 8 hours from now
  const [timeLeft, setTimeLeft] = useState({
    hours: 7,
    minutes: 42,
    seconds: 19
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 8, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (n) => String(n).padStart(2, '0');

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.08) 0%, rgba(15, 19, 28, 0.95) 40%, rgba(99, 102, 241, 0.08) 100%)',
        border: '1px solid rgba(244, 63, 94, 0.25)',
        padding: '36px 28px',
        overflow: 'hidden'
      }}
    >
      {/* Decorative Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(244, 63, 94, 0.15)',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }}
      />

      {/* Header Row */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          marginBottom: '28px',
          position: 'relative',
          zIndex: 2
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(244, 63, 94, 0.2)',
                border: '1px solid rgba(244, 63, 94, 0.4)',
                color: 'var(--accent-rose)',
                fontSize: '0.8rem',
                fontWeight: 800,
                textTransform: 'uppercase'
              }}
            >
              <Zap size={14} fill="currentColor" />
              <span>LIVE FLASH DEALS</span>
            </span>
          </div>

          <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            {t('section_flash_sale')}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {t('section_flash_sale_sub')}
          </p>
        </div>

        {/* Live Countdown Timer Pod */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(10, 13, 20, 0.85)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            padding: '10px 18px',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 4px 20px rgba(244, 63, 94, 0.15)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-rose)', fontWeight: 700, fontSize: '0.85rem' }}>
            <Clock size={16} />
            <span>{t('flash_ends_in')}:</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {/* Hours */}
            <div
              style={{
                background: 'var(--bg-card)',
                padding: '6px 10px',
                borderRadius: 'var(--radius-xs)',
                fontWeight: 900,
                fontSize: '1.2rem',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                minWidth: '38px',
                textAlign: 'center'
              }}
            >
              {formatNumber(timeLeft.hours)}
            </div>
            <span style={{ fontWeight: 900, color: 'var(--accent-rose)' }}>:</span>

            {/* Mins */}
            <div
              style={{
                background: 'var(--bg-card)',
                padding: '6px 10px',
                borderRadius: 'var(--radius-xs)',
                fontWeight: 900,
                fontSize: '1.2rem',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                minWidth: '38px',
                textAlign: 'center'
              }}
            >
              {formatNumber(timeLeft.minutes)}
            </div>
            <span style={{ fontWeight: 900, color: 'var(--accent-rose)' }}>:</span>

            {/* Secs */}
            <div
              style={{
                background: 'var(--bg-card)',
                padding: '6px 10px',
                borderRadius: 'var(--radius-xs)',
                fontWeight: 900,
                fontSize: '1.2rem',
                color: 'var(--accent-rose)',
                fontFamily: 'var(--font-mono)',
                minWidth: '38px',
                textAlign: 'center'
              }}
            >
              {formatNumber(timeLeft.seconds)}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="product-grid" style={{ position: 'relative', zIndex: 2 }}>
        {products.map((product) => (
          <div key={product.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <ProductCard product={product} />

            {/* Stock Progress Bar */}
            <div
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
                <span style={{ color: 'var(--accent-rose)' }}>
                  🔥 78% {t('flash_claimed')}
                </span>
                <span style={{ color: 'var(--text-muted)' }}>
                  {product.stock} {t('flash_left')}
                </span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '4px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(255,255,255,0.08)',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    width: '78%',
                    height: '100%',
                    background: 'linear-gradient(90deg, #F43F5E 0%, #F59E0B 100%)',
                    borderRadius: 'var(--radius-full)'
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
