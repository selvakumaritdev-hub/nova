import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PackageOpen, ArrowRight } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title,
  subtitle,
  actionText,
  actionLink,
  onActionClick
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel"
      style={{
        padding: '3.5rem 2rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.25rem',
        maxWidth: '560px',
        margin: '0 auto',
        width: '100%'
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-primary)'
        }}
      >
        <Icon size={36} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{title}</h3>
        {subtitle && (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '420px', lineHeight: 1.5 }}>
            {subtitle}
          </p>
        )}
      </div>

      {(actionText && (actionLink || onActionClick)) && (
        <div style={{ marginTop: '0.5rem' }}>
          {actionLink ? (
            <Link to={actionLink} className="btn btn-primary">
              <span>{actionText}</span>
              <ArrowRight size={16} />
            </Link>
          ) : (
            <button onClick={onActionClick} className="btn btn-primary">
              <span>{actionText}</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};
