import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { RotateCcw, CheckCircle2, Clock, Truck, ShieldCheck, ArrowRight, Package } from 'lucide-react';
import { useOrders } from '../../context/OrdersContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';

export const Returns = () => {
  const { orders, returns, createReturnRequest } = useOrders();
  const { addToast } = useToast();
  const { t } = useLanguage();

  const [selectedOrderId, setSelectedOrderId] = useState(orders[0]?.id || '');
  const [selectedReason, setSelectedReason] = useState('defective');
  const [refundMethod, setRefundMethod] = useState('credits');
  const [additionalComments, setAdditionalComments] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const deliveredOrders = orders.filter(o => o.status === 'Delivered' || o.id === 'NOV-773190');
  const currentOrder = orders.find(o => o.id === selectedOrderId) || deliveredOrders[0] || orders[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentOrder) {
      addToast('No eligible order selected', 'warning');
      return;
    }

    const reasonLabel = {
      defective: t('returns_reason_defective'),
      size: t('returns_reason_size'),
      quality: t('returns_reason_quality'),
      mind: t('returns_reason_mind')
    }[selectedReason];

    const methodLabel = refundMethod === 'credits'
      ? t('returns_method_credits')
      : t('returns_method_source');

    createReturnRequest(currentOrder.id, currentOrder.items[0]?.id, reasonLabel, methodLabel);
    setIsSubmitted(true);
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem', maxWidth: '960px', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header */}
      <div>
        <span className="section-tag">
          <RotateCcw size={14} />
          <span>Hassle-Free Care</span>
        </span>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, marginTop: '6px' }}>
          {t('returns_title')}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>
          7-Day Instant Pickup Guarantee with full refunds and zero questions asked.
        </p>
      </div>

      {/* Return Request Wizard */}
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '32px', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Initiate a Return</h2>

          {/* Step 1: Select Order */}
          <div className="input-group">
            <label className="input-label">{t('returns_select_order')}</label>
            <select
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(e.target.value)}
              className="input-field"
              style={{ cursor: 'pointer' }}
            >
              {orders.map(o => (
                <option key={o.id} value={o.id}>
                  Order #{o.id} ({o.date}) — {o.items[0]?.title.slice(0, 35)}... (₹{o.total.toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Reason Selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label className="input-label">{t('returns_reason')}</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
              {[
                { id: 'defective', label: t('returns_reason_defective') },
                { id: 'size', label: t('returns_reason_size') },
                { id: 'quality', label: t('returns_reason_quality') },
                { id: 'mind', label: t('returns_reason_mind') }
              ].map(r => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedReason(r.id)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: selectedReason === r.id ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-secondary)',
                    border: selectedReason === r.id ? '2px solid var(--accent-primary)' : '1px solid var(--border-medium)',
                    color: selectedReason === r.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontWeight: selectedReason === r.id ? 700 : 500,
                    fontSize: '0.85rem',
                    textAlign: 'left'
                  }}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Refund Method */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label className="input-label">{t('returns_method')}</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
              <div
                onClick={() => setRefundMethod('credits')}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-sm)',
                  background: refundMethod === 'credits' ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-secondary)',
                  border: refundMethod === 'credits' ? '2px solid var(--accent-emerald)' : '1px solid var(--border-medium)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontWeight: 800, color: 'var(--accent-emerald)', fontSize: '0.95rem' }}>
                  {t('returns_method_credits')}
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Instant store balance credited right upon doorstep courier verification.
                </p>
              </div>

              <div
                onClick={() => setRefundMethod('source')}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-sm)',
                  background: refundMethod === 'source' ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-secondary)',
                  border: refundMethod === 'source' ? '2px solid var(--accent-primary)' : '1px solid var(--border-medium)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                  {t('returns_method_source')}
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Transferred back to your UPI, Debit or Credit Card within 5 business days.
                </p>
              </div>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Additional Comments (Optional)</label>
            <textarea
              rows={3}
              value={additionalComments}
              onChange={(e) => setAdditionalComments(e.target.value)}
              placeholder="Tell us what went wrong..."
              className="input-field"
              style={{ resize: 'none' }}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '8px' }}>
            <RotateCcw size={18} />
            <span>{t('returns_submit')}</span>
          </button>
        </form>
      ) : (
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ padding: '40px', borderRadius: 'var(--radius-xl)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '2px solid var(--accent-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-emerald)'
            }}
          >
            <CheckCircle2 size={36} />
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Return Request Registered</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', lineHeight: 1.6 }}>
            Our courier partner will visit your address for free package pickup within 48 hours. Please keep items inside original NOVA signature packaging.
          </p>

          <button onClick={() => setIsSubmitted(false)} className="btn btn-secondary btn-sm" style={{ marginTop: '8px' }}>
            Submit Another Request
          </button>
        </motion.div>
      )}

      {/* Active Return Requests Tracker */}
      {returns.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Active Return Tracking</h3>
          {returns.map(ret => (
            <div
              key={ret.id}
              className="glass-panel"
              style={{
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{ret.id}</span>
                <span className="badge badge-gold">Status: {ret.status}</span>
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Product: <strong>{ret.productTitle}</strong> • Reason: {ret.reason}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>
                {ret.pickupDate} • Refund Mode: {ret.refundMethod}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
