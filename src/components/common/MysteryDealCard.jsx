import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Gift, Copy, Check, Lock, Unlock, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { mysteryVaultRewards } from '../../data/offers';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';

export const MysteryDealCard = () => {
  const { addToast } = useToast();
  const { t } = useLanguage();

  const [unlockedBoxes, setUnlockedBoxes] = useState({});
  const [copiedCode, setCopiedCode] = useState(null);

  const handleUnlock = (vaultId, index) => {
    if (unlockedBoxes[vaultId]) return;

    // Trigger celebratory confetti burst
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#F59E0B', '#6366F1', '#EC4899', '#10B981']
    });

    setUnlockedBoxes(prev => ({
      ...prev,
      [vaultId]: true
    }));

    addToast('Vault unlocked! Promo reward revealed.', 'success');
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    addToast(`Code ${code} copied to clipboard!`, 'info');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div
      style={{
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(15, 19, 28, 0.95) 50%, rgba(139, 92, 246, 0.08) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.25)',
        padding: '36px 28px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Decorative Gold Ambient Orb */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '400px',
          height: '250px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(245, 158, 11, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}
      />

      <div style={{ textAlign: 'center', marginBottom: '32px', position: 'relative', zIndex: 2 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 14px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            color: 'var(--accent-gold)',
            fontSize: '0.8rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            marginBottom: '10px'
          }}
        >
          <Crown size={14} />
          <span>EXCLUSIVE MEMBER VAULT</span>
        </div>

        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          {t('section_mystery_deals')}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '560px', margin: '6px auto 0' }}>
          {t('mystery_box_hint')}
        </p>
      </div>

      {/* 4 Mystery Vault Pods */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          position: 'relative',
          zIndex: 2
        }}
      >
        {mysteryVaultRewards.map((reward, idx) => {
          const isUnlocked = !!unlockedBoxes[reward.id];

          return (
            <motion.div
              key={reward.id}
              whileHover={{ scale: isUnlocked ? 1.01 : 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleUnlock(reward.id, idx)}
              className="glass-panel"
              style={{
                padding: '24px 20px',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                cursor: isUnlocked ? 'default' : 'pointer',
                border: isUnlocked ? '1px solid rgba(245, 158, 11, 0.4)' : '1px dashed var(--border-medium)',
                background: isUnlocked
                  ? 'linear-gradient(180deg, rgba(30, 37, 54, 0.9) 0%, rgba(18, 23, 35, 0.95) 100%)'
                  : 'var(--bg-card)',
                boxShadow: isUnlocked ? '0 10px 30px rgba(245, 158, 11, 0.15)' : 'none',
                minHeight: '220px',
                justifyContent: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <AnimatePresence mode="wait">
                {!isUnlocked ? (
                  <motion.div
                    key="locked"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}
                  >
                    <div
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(245, 158, 11, 0.12)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent-gold)'
                      }}
                    >
                      <Gift size={32} />
                    </div>

                    <div>
                      <span className="badge badge-gold" style={{ marginBottom: '6px' }}>
                        {reward.rarity} Vault
                      </span>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, marginTop: '4px' }}>
                        Vault Chamber #{idx + 1}
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Tap to reveal coupon
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="unlocked"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', width: '100%' }}
                  >
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent-emerald)'
                      }}
                    >
                      <Sparkles size={24} />
                    </div>

                    <span className="badge badge-gold">
                      {reward.badge}
                    </span>

                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {reward.name}
                    </h4>

                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {reward.description}
                    </p>

                    {/* Copy Code Box */}
                    <div
                      style={{
                        width: '100%',
                        marginTop: '8px',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-medium)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.95rem',
                          fontWeight: 800,
                          color: 'var(--accent-gold)',
                          letterSpacing: '0.05em'
                        }}
                      >
                        {reward.code}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(reward.code);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: copiedCode === reward.code ? 'var(--accent-emerald)' : 'var(--text-primary)',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          background: 'var(--bg-tertiary)'
                        }}
                      >
                        {copiedCode === reward.code ? <Check size={12} /> : <Copy size={12} />}
                        <span>{copiedCode === reward.code ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
