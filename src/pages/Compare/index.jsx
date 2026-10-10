import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Layers, Trash2, ShoppingBag, Check, X, Star, ArrowRight } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';
import { useCart } from '../../context/CartContext';
import { EmptyState } from '../../components/common/EmptyState';
import { useLanguage } from '../../context/LanguageContext';

export const Compare = () => {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();
  const { t } = useLanguage();

  const [highlightDiffs, setHighlightDiffs] = useState(false);

  if (compareList.length === 0) {
    return (
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        <EmptyState
          icon={Layers}
          title={t('compare_empty')}
          subtitle={t('compare_empty_sub')}
          actionText={t('cart_start_shopping')}
          actionLink="/shop"
        />
      </div>
    );
  }

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
          marginBottom: '2rem'
        }}
      >
        <div>
          <span className="section-tag">
            <Layers size={14} />
            <span>Product Matrix</span>
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, marginTop: '6px' }}>
            {t('compare_title')} ({compareList.length}/4)
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={highlightDiffs}
              onChange={(e) => setHighlightDiffs(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: 'var(--accent-primary)' }}
            />
            <span>Highlight Differences</span>
          </label>

          <button onClick={clearCompare} className="btn btn-secondary btn-sm">
            <Trash2 size={15} />
            <span>{t('compare_clear')}</span>
          </button>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div
        className="glass-panel"
        style={{
          borderRadius: 'var(--radius-lg)',
          overflowX: 'auto',
          padding: '24px'
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
          <thead>
            <tr>
              <th style={{ width: '200px', textAlign: 'left', padding: '16px', borderBottom: '1px solid var(--border-medium)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Features
              </th>
              {compareList.map(prod => (
                <th key={prod.id} style={{ width: '260px', padding: '16px', borderBottom: '1px solid var(--border-medium)', textAlign: 'left', verticalAlign: 'top' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ position: 'relative', width: '100%', height: '180px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--bg-secondary)' }}>
                      <img src={prod.thumbnail} alt={prod.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        onClick={() => removeFromCompare(prod.id)}
                        className="btn-icon"
                        style={{ position: 'absolute', top: '8px', right: '8px', width: '30px', height: '30px', background: 'rgba(0,0,0,0.7)' }}
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-primary)', fontWeight: 700 }}>
                      {prod.brand}
                    </span>
                    <Link to={`/product/${prod.id}`} style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                      {prod.title}
                    </Link>

                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                      ₹{prod.price.toLocaleString('en-IN')}
                    </div>

                    <button
                      onClick={() => addToCart(prod, 1)}
                      className="btn btn-primary btn-sm"
                      style={{ width: '100%', marginTop: '4px' }}
                    >
                      <ShoppingBag size={14} />
                      <span>Add to Bag</span>
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* Rating */}
            <tr>
              <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}>
                Customer Rating
              </td>
              {compareList.map(prod => (
                <td key={prod.id} style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Star size={14} fill="#F59E0B" color="#F59E0B" />
                    <span style={{ fontWeight: 800 }}>{prod.rating}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>({prod.reviewsCount})</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Category */}
            <tr>
              <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}>
                Department
              </td>
              {compareList.map(prod => (
                <td key={prod.id} style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)', textTransform: 'capitalize', fontWeight: 600 }}>
                  {prod.category}
                </td>
              ))}
            </tr>

            {/* Stock Status */}
            <tr>
              <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}>
                Stock Status
              </td>
              {compareList.map(prod => (
                <td key={prod.id} style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span className="badge badge-success">
                    {prod.stock > 0 ? `In Stock (${prod.stock} units)` : "Out of stock"}
                  </span>
                </td>
              ))}
            </tr>

            {/* Discount */}
            <tr>
              <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}>
                Current Discount
              </td>
              {compareList.map(prod => (
                <td key={prod.id} style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span className="badge badge-sale">
                    {prod.discountPercentage}% OFF
                  </span>
                </td>
              ))}
            </tr>

            {/* Warranty */}
            <tr>
              <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}>
                Warranty Care
              </td>
              {compareList.map(prod => (
                <td key={prod.id} style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}>
                  1 Year Comprehensive Global Warranty
                </td>
              ))}
            </tr>

            {/* Return Policy */}
            <tr>
              <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Returns Guarantee
              </td>
              {compareList.map(prod => (
                <td key={prod.id} style={{ padding: '14px 16px', fontSize: '0.85rem' }}>
                  7-Day Hassle-Free Instant Pickup
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
