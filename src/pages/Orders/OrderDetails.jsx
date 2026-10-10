import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Download,
  ArrowLeft,
  Package,
  Navigation
} from 'lucide-react';
import { useOrders } from '../../context/OrdersContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';

export const OrderDetails = () => {
  const { id } = useParams();
  const { getOrderById, cancelOrder } = useOrders();
  const { addToast } = useToast();
  const { t } = useLanguage();

  const order = getOrderById(id);

  const handleCancel = () => {
    const reason = window.prompt('Why are you cancelling this order? (optional)', 'Changed my mind');
    if (reason !== null) cancelOrder(order.id, reason || 'No reason given');
  };

  if (!order) {
    return (
      <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
        <h2>Order Not Found</h2>
        <Link to="/orders" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Orders
        </Link>
      </div>
    );
  }

  const steps = order.trackingSteps || [
    { status: 'Confirmed', date: 'Oct 06, 10:15 AM', completed: true, desc: 'Order verified & confirmed.' },
    { status: 'Packed', date: 'Oct 06, 11:30 AM', completed: true, desc: 'Luxury boxed at distribution vault.' },
    { status: 'Shipped', date: 'Oct 07, 08:00 AM', completed: true, desc: 'Dispatched in express linehaul vehicle.' },
    { status: 'Out for Delivery', date: 'Today, 01:20 PM', completed: true, desc: 'Courier partner is out for final delivery.' },
    { status: 'Delivered', date: 'Pending', completed: false, desc: 'Handover and verified recipient signature.' }
  ];

  const handleDownloadInvoice = () => {
    addToast(`Tax Invoice #${order.id}.pdf generated and downloaded`, 'success');
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem', display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px' }}>
      {/* Back Link */}
      <Link to="/orders" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
        <ArrowLeft size={16} />
        <span>Back to All Orders</span>
      </Link>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="section-tag">
            <Truck size={14} />
            <span>Live Dispatch Tracking</span>
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginTop: '6px' }}>
            Tracking Order #{order.id}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '2px' }}>
            Tracking Number: <strong style={{ fontFamily: 'var(--font-mono)' }}>{order.trackingNumber}</strong> • {order.carrier}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {['Confirmed', 'Packed'].includes(order.status) && (
            <button
              onClick={handleCancel}
              className="btn btn-secondary btn-sm"
              style={{ color: 'var(--accent-rose)', borderColor: 'var(--accent-rose)' }}
            >
              <span>Cancel Order</span>
            </button>
          )}
          <button onClick={handleDownloadInvoice} className="btn btn-secondary btn-sm">
            <Download size={14} />
            <span>Download Invoice</span>
          </button>
        </div>
      </div>

      {order.status === 'Cancelled' && (
        <div style={{ padding: '14px 18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-rose)', color: 'var(--accent-rose)', fontWeight: 700 }}>
          This order was cancelled{order.cancelReason ? ` (${order.cancelReason})` : ''}.
        </div>
      )}

      {/* Live Map Visualizer Pod */}
      <div
        className="glass-panel"
        style={{
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          padding: '0',
          position: 'relative',
          border: '1px solid var(--border-medium)',
          height: '240px',
          background: 'radial-gradient(ellipse at center, rgba(15, 23, 42, 0.95) 0%, rgba(9, 11, 16, 1) 100%)'
        }}
      >
        {/* Stylized Grid Lines */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(99, 102, 241, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.08) 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}
        />

        {/* Courier Pin with Pulse */}
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '55%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            zIndex: 10
          }}
        >
          <div
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--grad-primary)',
              color: '#FFF',
              fontSize: '0.78rem',
              fontWeight: 800,
              boxShadow: '0 0 20px var(--accent-primary-glow)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Navigation size={13} className="animate-spin" />
            <span>Courier En Route (2.4 km away)</span>
          </div>

          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'var(--accent-primary)',
              border: '3px solid #FFF',
              boxShadow: '0 0 15px var(--accent-primary-glow)'
            }}
          />
        </div>

        {/* Destination Pin */}
        <div
          style={{
            position: 'absolute',
            top: '45%',
            right: '15%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'var(--accent-emerald)',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(16, 185, 129, 0.5)'
            }}
          >
            <MapPin size={16} />
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
            Your Residence
          </span>
        </div>
      </div>

      {/* Step-by-Step Delivery Progress Timeline */}
      <div className="glass-panel" style={{ padding: '32px', borderRadius: 'var(--radius-lg)' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '24px' }}>
          Delivery Journey Status
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
          {/* Vertical Connecting Line */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              bottom: '16px',
              left: '17px',
              width: '2px',
              background: 'var(--border-medium)',
              zIndex: 0
            }}
          />

          {steps.map((step, idx) => {
            const isLatestActive = step.completed && (idx === steps.length - 1 || !steps[idx + 1]?.completed);

            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', position: 'relative', zIndex: 1 }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: step.completed ? 'var(--accent-emerald)' : 'var(--bg-secondary)',
                    border: step.completed ? 'none' : '2px solid var(--border-medium)',
                    color: step.completed ? '#FFFFFF' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: isLatestActive ? '0 0 15px rgba(16, 185, 129, 0.5)' : 'none'
                  }}
                >
                  {step.completed ? <CheckCircle2 size={18} /> : <Clock size={16} />}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: step.completed ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                      {step.status}
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: step.completed ? 'var(--accent-emerald)' : 'var(--text-muted)', fontWeight: 600 }}>
                      {step.date}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Items & Shipping Address Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Items Pod */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px' }}>
            Ordered Items ({order.items.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {order.items.map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img src={item.thumbnail} alt={item.title} style={{ width: '54px', height: '54px', borderRadius: '6px', objectFit: 'cover' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>{item.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Qty: {item.quantity || 1} • ₹{item.price.toLocaleString('en-IN')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Payment Summary */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Delivery Details</h3>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--text-primary)' }}>{order.address?.name || 'Selva Kumar'}</strong><br />
            {order.address?.street}<br />
            {order.address?.city}, {order.address?.state} - {order.address?.pincode}
          </div>

          <div style={{ paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Payment: <strong>{order.paymentMethod}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
