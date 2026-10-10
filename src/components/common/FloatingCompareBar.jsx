import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Layers, X, ArrowRight, Trash2 } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';
import { useLanguage } from '../../context/LanguageContext';

export const FloatingCompareBar = () => {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const { t } = useLanguage();

  if (compareList.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9000,
          maxWidth: '780px',
          width: 'calc(100% - 32px)',
          background: 'var(--bg-glass-strong)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}
      >
        {/* Left: Indicator & Thumbnails */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(99, 102, 241, 0.2)',
                color: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Layers size={16} />
            </div>
            <div>
              <span style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {t('compare_bar_title', { count: compareList.length })}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                Max 4 items
              </span>
            </div>
          </div>

          {/* Product Thumbnails */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {compareList.map((item) => (
              <div
                key={item.id}
                style={{
                  position: 'relative',
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-xs)',
                  overflow: 'hidden',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-medium)'
                }}
              >
                <img
                  src={item.thumbnail || (item.images && item.images[0])}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  onClick={() => removeFromCompare(item.id)}
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.7)',
                    color: '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Remove"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <button
            onClick={clearCompare}
            style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              fontWeight: 600,
              padding: '6px 10px',
              borderRadius: 'var(--radius-xs)'
            }}
          >
            {t('compare_clear')}
          </button>

          <Link to="/compare" className="btn btn-primary btn-sm">
            <span>{t('compare_bar_btn')}</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
