import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package,
  Truck,
  RotateCcw,
  Download,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useOrders } from '../../context/OrdersContext';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';

export const Orders = () => {
  const { orders } = useOrders();
  const { addToast } = useToast();
  const { t } = useLanguage();

  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = orders.filter(o => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'active') return o.status !== 'Delivered' && o.status !== 'Returned' && o.status !== 'Cancelled';
    if (statusFilter === 'delivered') return o.status === 'Delivered';
    return true;
  });

  const handleDownloadInvoice = (orderId) => {
    addToast(`Tax Invoice for ${orderId} downloaded successfully!`, 'success');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Out for Delivery':
        return <span className="badge badge-sale">🚚 Out for Delivery</span>;
      case 'Cancelled':
        return <span className="badge badge-sale">✕ Cancelled</span>;
      case 'Delivered':
        return <span className="badge badge-success">✓ Delivered</span>;
      case 'Shipped':
        return <span className="badge badge-new">⚡ Shipped</span>;
      default:
        return <span className="badge badge-gold">● Confirmed</span>;
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="section-tag">
            <Package size={14} />
            <span>Order Management</span>
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, marginTop: '6px' }}>
            {t('orders_title')}
          </h1>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-secondary)', padding: '4px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'active', label: 'In Transit' },
            { id: 'delivered', label: 'Delivered' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.82rem',
                fontWeight: 700,
                background: statusFilter === tab.id ? 'var(--accent-primary)' : 'transparent',
                color: statusFilter === tab.id ? '#FFFFFF' : 'var(--text-secondary)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <EmptyState
          icon={Package}
          title={t('orders_empty')}
          subtitle="You have no active orders in this view. Explore our catalog to place your first luxury order."
          actionText={t('cart_start_shopping')}
          actionLink="/shop"
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredOrders.map(order => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel"
              style={{
                padding: '24px',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px'
              }}
            >
              {/* Order Top Bar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                  paddingBottom: '14px',
                  borderBottom: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ fontSize: '1.05rem', fontWeight: 900, fontFamily: 'var(--font-mono)' }}>
                    {order.id}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Placed on {order.date}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {getStatusBadge(order.status)}
                  <span style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                    ₹{order.total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Order Items Strip */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {order.items.map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      style={{ width: '60px', height: '60px', borderRadius: '6px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{item.title}</h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Quantity: {item.quantity || 1} • ₹{item.price.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions Footer */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                  paddingTop: '14px',
                  borderTop: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Truck size={15} />
                  <span>{order.estimatedDelivery}</span>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => handleDownloadInvoice(order.id)}
                    className="btn btn-secondary btn-sm"
                  >
                    <Download size={14} />
                    <span>{t('orders_invoice_btn')}</span>
                  </button>

                  <Link to="/returns" className="btn btn-secondary btn-sm">
                    <RotateCcw size={14} />
                    <span>{t('orders_return_btn')}</span>
                  </Link>

                  <Link to={`/orders/${order.id}`} className="btn btn-primary btn-sm">
                    <Truck size={14} />
                    <span>{t('orders_track')}</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
