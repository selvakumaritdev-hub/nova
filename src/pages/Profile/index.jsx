import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Package,
  MapPin,
  Bell,
  Award,
  Crown,
  Settings,
  Shield,
  Trash2,
  Check,
  Plus,
  Edit2,
  Gift,
  Zap,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAddress } from '../../context/AddressContext';
import { useOrders } from '../../context/OrdersContext';
import { useRewards } from '../../context/RewardsContext';
import { useNotifications } from '../../context/NotificationContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';

export const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { addresses, addAddress, deleteAddress, setDefaultAddress } = useAddress();
  const { orders } = useOrders();
  const { points, earnPoints, redeemPoints, claimedRewards } = useRewards();
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const { addToast } = useToast();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState('info');

  // Edit Profile Form State
  const [name, setName] = useState(user?.name || 'Selva Kumar');
  const [email, setEmail] = useState(user?.email || 'selvakumar.itdev@gmail.com');
  const [phone, setPhone] = useState(user?.phone || '+91 93636 38730');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({ name, email, phone });
  };

  const tabs = [
    { id: 'info', label: t('profile_tab_info'), icon: User },
    { id: 'addresses', label: t('profile_tab_addresses'), icon: MapPin },
    { id: 'orders', label: t('profile_tab_orders'), icon: Package },
    { id: 'rewards', label: t('profile_tab_rewards'), icon: Award },
    { id: 'notifications', label: t('profile_tab_notifications'), icon: Bell },
    { id: 'novaplus', label: t('profile_tab_novaplus'), icon: Crown }
  ];

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Top Profile Summary Card */}
      <div
        className="glass-panel"
        style={{
          padding: '32px',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(15, 19, 28, 0.95) 100%)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <img
              src={user?.avatar || "/selva.jpg"}
              alt={user?.name}
              style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent-primary)' }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'var(--accent-gold)',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Crown size={14} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 900 }}>{user?.name || 'Selva Kumar'}</h1>
              <span className="badge badge-gold">{user?.tier || 'NOVA Black Elite'}</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '2px' }}>
              {user?.email} • Member since {user?.memberSince || '2024'}
            </p>
          </div>
        </div>

        {/* Rewards Quick Counter */}
        <div
          style={{
            padding: '14px 24px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-medium)',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            Reward Points Balance
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent-gold)', fontFamily: 'var(--font-display)', marginTop: '2px' }}>
            {points.toLocaleString('en-IN')} <span style={{ fontSize: '1rem' }}>PTS</span>
          </div>
        </div>
      </div>

      {/* Main Profile Tabs & View */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '32px', alignItems: 'start' }} className="profile-layout">
        {/* Tab Selector Nav */}
        <aside
          className="glass-panel"
          style={{
            padding: '16px',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}
        >
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.9rem',
                  fontWeight: isCurrent ? 800 : 600,
                  background: isCurrent ? 'var(--accent-primary)' : 'transparent',
                  color: isCurrent ? '#FFFFFF' : 'var(--text-secondary)',
                  textAlign: 'left',
                  transition: 'all 0.15s'
                }}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Tab Content Panel */}
        <main className="glass-panel" style={{ padding: '32px', borderRadius: 'var(--radius-lg)' }}>
          {/* TAB 1: PERSONAL INFO */}
          {activeTab === 'info' && (
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Personal Information</h2>

              <div className="input-group">
                <label className="input-label">{t('profile_name')}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">{t('profile_email')}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">{t('profile_phone')}</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: 'fit-content', marginTop: '8px' }}>
                <Check size={16} />
                <span>{t('profile_save')}</span>
              </button>
            </form>
          )}

          {/* TAB 2: ADDRESS MANAGEMENT */}
          {activeTab === 'addresses' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Manage Saved Addresses</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {addresses.map(addr => (
                  <div
                    key={addr.id}
                    style={{
                      padding: '18px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-secondary)',
                      border: addr.isDefault ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="badge badge-new">{addr.type}</span>
                      {addr.isDefault && <span className="badge badge-success">Default</span>}
                    </div>

                    <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>{addr.name}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                      {!addr.isDefault && (
                        <button
                          onClick={() => setDefaultAddress(addr.id)}
                          style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 700 }}
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        style={{ fontSize: '0.8rem', color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: RECENT ORDERS */}
          {activeTab === 'orders' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Order History Summary</h2>
              {orders.slice(0, 3).map(o => (
                <div
                  key={o.id}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{o.id}</span>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{o.date} • {o.items.length} items</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 900 }}>₹{o.total.toLocaleString('en-IN')}</div>
                    <span className="badge badge-new" style={{ marginTop: '2px' }}>{o.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: REWARDS & POINTS */}
          {activeTab === 'rewards' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>NOVA Rewards Hub</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '2px' }}>
                  Earn 10% points on every purchase and redeem for instant shopping vouchers.
                </p>
              </div>

              {/* Redeemable Vouchers */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                {[
                  { cost: 500, title: "₹250 Flat Shopping Coupon", code: "REWARD250" },
                  { cost: 1000, title: "₹500 Flat Luxury Voucher", code: "REWARD500" },
                  { cost: 2000, title: "₹1,200 VIP Super Voucher", code: "REWARD1200" }
                ].map((vouch, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '20px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-medium)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)' }}>
                      <Gift size={20} />
                      <span style={{ fontWeight: 800 }}>{vouch.cost} Points</span>
                    </div>

                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800 }}>{vouch.title}</h4>

                    <button
                      onClick={() => redeemPoints(vouch.cost, vouch.title)}
                      className="btn btn-primary btn-sm"
                      style={{ marginTop: 'auto' }}
                    >
                      Redeem Voucher
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Notifications Center</h2>
                <button onClick={markAllAsRead} className="btn btn-secondary btn-sm">
                  Mark All Read
                </button>
              </div>

              {notifications.map(n => (
                <div
                  key={n.id}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-sm)',
                    background: n.isRead ? 'var(--bg-secondary)' : 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800 }}>{n.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{n.message}</p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>{n.time}</span>
                  </div>
                  {!n.isRead && (
                    <button onClick={() => markAsRead(n.id)} className="btn-icon btn-sm">
                      <Check size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB 6: NOVA+ MEMBERSHIP */}
          {activeTab === 'novaplus' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Crown size={28} color="#F59E0B" />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>NOVA Black Elite Member</h2>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Your membership is active through December 2027. Enjoy unlimited complimentary 2-hour delivery, private vault drops, and dedicated concierge service.
              </p>
            </div>
          )}
        </main>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .profile-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
