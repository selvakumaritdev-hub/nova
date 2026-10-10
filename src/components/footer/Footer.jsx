import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, CheckCircle2, ShieldCheck, Truck, RotateCcw, Headphones, Sparkles, Globe, Heart } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';

export const Footer = () => {
  const { addToast } = useToast();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setIsSubscribed(true);
      addToast('Thank you for subscribing to The NOVA Gazette!', 'success');
      setEmail('');
    } else {
      addToast('Please provide a valid email address', 'warning');
    }
  };

  return (
    <footer
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-medium)',
        marginTop: '5rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top Value Propositions Bar */}
      <div
        style={{
          borderBottom: '1px solid var(--border-subtle)',
          padding: '2.5rem 0',
          background: 'rgba(15, 19, 28, 0.4)'
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '24px'
            }}
          >
            {[
              { icon: Truck, title: "Complimentary Express Delivery", desc: "On all premium orders above ₹999" },
              { icon: RotateCcw, title: "7-Day Hassle-Free Returns", desc: "Instant pickup & zero questions asked" },
              { icon: ShieldCheck, title: "100% Authentic Certified", desc: "Direct from verified luxury manufacturers" },
              { icon: Headphones, title: "24/7 VIP Concierge Support", desc: "Dedicated advisors always ready to assist" }
            ].map((prop, idx) => {
              const Icon = prop.icon;
              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(99, 102, 241, 0.12)',
                      border: '1px solid rgba(99, 102, 241, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-primary)',
                      flexShrink: 0
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.925rem', fontWeight: 800 }}>{prop.title}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {prop.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="container" style={{ padding: '4rem 1.25rem 3rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '40px',
            marginBottom: '3.5rem'
          }}
        >
          {/* Col 1: Brand Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', gridColumn: 'span 1' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-medium)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Sparkles size={16} color="#6366F1" />
              </div>
              <span style={{ fontSize: '1.3rem', fontWeight: 900, fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}>
                NOVA <span className="text-gradient">MALL</span>
              </span>
            </Link>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              {t('footer_tagline')} Elevating your lifestyle with curated luxury collections, 360° interactive retail, and bespoke service.
            </p>

            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              {['Instagram', 'Twitter', 'YouTube', 'LinkedIn'].map(social => (
                <span
                  key={social}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)'
                  }}
                >
                  {social}
                </span>
              ))}
            </div>
          </div>

          {/* Col 2: Shop & Categories */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Categories
            </h4>
            <Link to="/shop?category=electronics" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Electronics & Audio</Link>
            <Link to="/shop?category=fashion" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Luxury Fashion</Link>
            <Link to="/shop?category=accessories" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Watches & Jewelry</Link>
            <Link to="/shop?category=beauty" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Beauty & Fragrances</Link>
            <Link to="/shop?category=furniture" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Modern Furniture</Link>
            <Link to="/shop?category=sports" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Sports & Gear</Link>
          </div>

          {/* Col 3: Customer Support */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Customer Experience
            </h4>
            <Link to="/orders" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Track Your Order</Link>
            <Link to="/returns" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Returns & Refunds</Link>
            <Link to="/stores" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Flagship Stores</Link>
            <Link to="/nova-plus" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>NOVA+ VIP Membership</Link>
            <Link to="/assistant" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>AI Shopping Concierge</Link>
          </div>

          {/* Col 4: Newsletter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {t('footer_newsletter_title')}
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {t('footer_newsletter_sub')}
            </p>

            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer_email_placeholder')}
                className="input-field"
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
              />
              <button type="submit" className="btn btn-primary btn-sm" style={{ flexShrink: 0 }}>
                {isSubscribed ? <CheckCircle2 size={16} /> : <Send size={16} />}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Copyright and Payment Badges */}
        <div
          style={{
            paddingTop: '2rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}
        >
          <div>
            © {new Date().getFullYear()} NOVA MALL. {t('footer_rights')}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600 }}>Secured Payments:</span>
            {['UPI FastPay', 'Visa Signature', 'Mastercard', 'Apple Pay', 'Net Banking', 'Cash on Delivery'].map(p => (
              <span
                key={p}
                style={{
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.72rem',
                  fontWeight: 600
                }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
