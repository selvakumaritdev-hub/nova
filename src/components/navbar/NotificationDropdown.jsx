import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Bell, Check, CheckCheck, Package, TrendingDown, Tag, Award, X } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { useLanguage } from '../../context/LanguageContext';

export const NotificationDropdown = ({ isOpen, onClose }) => {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotifications();
  const { t } = useLanguage();
  const [filter, setFilter] = useState('all');

  if (!isOpen) return null;

  const filteredNotifs = notifications.filter(n => {
    if (filter === 'all') return true;
    return n.type === filter;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'order':
        return <Package size={16} color="#6366F1" />;
      case 'price_drop':
        return <TrendingDown size={16} color="#F43F5E" />;
      case 'promo':
        return <Tag size={16} color="#F59E0B" />;
      case 'reward':
        return <Award size={16} color="#10B981" />;
      default:
        return <Bell size={16} color="#6366F1" />;
    }
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 8990
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="glass-modal"
          style={{
            position: 'absolute',
            top: '72px',
            right: '80px',
            width: '380px',
            maxWidth: 'calc(100vw - 32px)',
            maxHeight: '520px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            padding: 0
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-card)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Notifications</h3>
              {unreadCount > 0 && (
                <span className="badge badge-sale" style={{ fontSize: '0.7rem' }}>
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--accent-primary)',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <CheckCheck size={14} />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div
            style={{
              display: 'flex',
              gap: '6px',
              padding: '8px 16px',
              borderBottom: '1px solid var(--border-subtle)',
              background: 'rgba(9, 11, 16, 0.4)',
              overflowX: 'auto'
            }}
          >
            {[
              { id: 'all', label: 'All' },
              { id: 'order', label: 'Orders' },
              { id: 'price_drop', label: 'Price Drops' },
              { id: 'reward', label: 'Rewards' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                style={{
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  background: filter === tab.id ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                  color: filter === tab.id ? '#FFFFFF' : 'var(--text-secondary)'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '8px 0',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {filteredNotifs.length === 0 ? (
              <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No notifications right now
              </div>
            ) : (
              filteredNotifs.map(n => (
                <Link
                  key={n.id}
                  to={n.link || '/orders'}
                  onClick={() => {
                    markAsRead(n.id);
                    onClose();
                  }}
                  style={{
                    padding: '12px 18px',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start',
                    background: n.isRead ? 'transparent' : 'rgba(99, 102, 241, 0.06)',
                    borderBottom: '1px solid var(--border-subtle)',
                    transition: 'background 0.15s'
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--bg-tertiary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}
                  >
                    {getIcon(n.type)}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4
                        style={{
                          fontSize: '0.85rem',
                          fontWeight: n.isRead ? 600 : 800,
                          color: 'var(--text-primary)'
                        }}
                      >
                        {n.title}
                      </h4>
                      {!n.isRead && (
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent-primary)', flexShrink: 0 }} />
                      )}
                    </div>

                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.4 }}>
                      {n.message}
                    </p>

                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                      {n.time}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
