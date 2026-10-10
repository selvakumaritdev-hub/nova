import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Check, Sparkles, Zap, ShieldCheck, Gift, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '../../context/ToastContext';

export const NovaPlus = () => {
  const { addToast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState('black');

  const handleSubscribe = (planTitle) => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#6366F1', '#EC4899', '#10B981']
    });

    addToast(`Congratulations! You are now subscribed to ${planTitle}.`, 'success');
  };

  const plans = [
    {
      id: 'silver',
      name: 'NOVA Silver',
      price: 'Free',
      period: 'Forever',
      badge: 'Standard Access',
      perks: [
        'Free standard delivery over ₹999',
        'Standard 7-day returns',
        'Earn 1% NOVA Reward points',
        'Email customer support'
      ],
      isPopular: false
    },
    {
      id: 'gold',
      name: 'NOVA Gold Pass',
      price: '₹999',
      period: 'per year',
      badge: 'Most Popular',
      perks: [
        'Unlimited Free 2-Hour Express Delivery',
        'Earn 3% NOVA Reward points',
        'Priority phone concierge support',
        'Early 12-Hour Drop Access',
        'Special birthday reward voucher'
      ],
      isPopular: true
    },
    {
      id: 'black',
      name: 'NOVA Black Elite',
      price: '₹2,999',
      period: 'per year',
      badge: 'Ultra VIP Tier',
      perks: [
        'Unlimited 2-Hour & Same-Day Delivery',
        'Earn 5% Instant Cashback Reward points',
        'Dedicated 24/7 Personal Stylist Concierge',
        'Private Secret Vault Access & Exclusive Drops',
        'VIP Lounge Entry at all Flagship Stores',
        'Annual Luxury Gift Hamper'
      ],
      isPopular: false,
      isElite: true
    }
  ];

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            color: 'var(--accent-gold)',
            fontSize: '0.85rem',
            fontWeight: 800,
            marginBottom: '12px'
          }}
        >
          <Crown size={16} />
          <span>NOVA+ MEMBERSHIP CLUB</span>
        </div>

        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
          Elevate Every Order Into An Experience
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '12px', lineHeight: 1.6 }}>
          Unlock complimentary 2-hour delivery, private vault drops, reward multipliers, and VIP flagship access worldwide.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          alignItems: 'stretch'
        }}
      >
        {plans.map(plan => (
          <motion.div
            key={plan.id}
            whileHover={{ y: -6 }}
            className="glass-panel"
            style={{
              padding: '36px 28px',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              position: 'relative',
              border: plan.isElite
                ? '2px solid rgba(245, 158, 11, 0.5)'
                : plan.isPopular
                ? '2px solid var(--accent-primary)'
                : '1px solid var(--border-medium)',
              background: plan.isElite
                ? 'linear-gradient(180deg, rgba(245, 158, 11, 0.08) 0%, rgba(15, 19, 28, 0.95) 100%)'
                : 'var(--bg-card)',
              boxShadow: plan.isElite ? '0 10px 40px rgba(245, 158, 11, 0.15)' : 'var(--shadow-md)'
            }}
          >
            {/* Badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className={`badge ${plan.isElite ? 'badge-gold' : plan.isPopular ? 'badge-new' : 'badge-success'}`}>
                {plan.badge}
              </span>
            </div>

            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>{plan.name}</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '8px' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                  {plan.price}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{plan.period}</span>
              </div>
            </div>

            {/* Perks list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              {plan.perks.map((perk, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9rem' }}>
                  <Check size={16} color={plan.isElite ? "var(--accent-gold)" : "var(--accent-primary)"} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{perk}</span>
                </div>
              ))}
            </div>

            {/* Subscribe CTA */}
            <button
              onClick={() => handleSubscribe(plan.name)}
              className={`btn ${plan.isElite ? 'btn-gold' : plan.isPopular ? 'btn-primary' : 'btn-secondary'} btn-block btn-lg`}
              style={{ marginTop: 'auto' }}
            >
              <Crown size={16} />
              <span>Subscribe to {plan.name}</span>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
