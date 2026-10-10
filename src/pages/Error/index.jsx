import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, ArrowRight, Sparkles, Home } from 'lucide-react';

export const Error404 = () => {
  return (
    <div className="container" style={{ minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '4rem 1.25rem' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel"
        style={{
          maxWidth: '560px',
          width: '100%',
          padding: '48px 32px',
          borderRadius: 'var(--radius-xl)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}
      >
        <span
          style={{
            fontSize: '5rem',
            fontWeight: 900,
            fontFamily: 'var(--font-display)',
            background: 'var(--grad-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1
          }}
        >
          404
        </span>

        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Destination Not Found</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '8px', lineHeight: 1.6 }}>
            The luxury collection or page you were exploring has been moved, curated into another vault, or does not exist.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '12px' }}>
          <Link to="/" className="btn btn-primary btn-lg">
            <Home size={18} />
            <span>Return to Home</span>
          </Link>
          <Link to="/shop" className="btn btn-secondary btn-lg">
            <Compass size={18} />
            <span>Explore Catalog</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
