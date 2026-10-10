import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KeyRound, ArrowLeft, CheckCircle2, Send } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ForgotPassword = () => {
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSent(true);
      addToast(`Password reset link dispatched to ${email}`, 'success');
    }
  };

  return (
    <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.25rem' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '36px',
          borderRadius: 'var(--radius-xl)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <ArrowLeft size={16} />
          <span>Back to Sign In</span>
        </Link>

        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Reset Password</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
            Enter your registered email and we'll send you an instant reset link.
          </p>
        </div>

        {!isSent ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg">
              <Send size={16} />
              <span>Send Reset Link</span>
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <CheckCircle2 size={44} color="#10B981" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Check Your Inbox</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              We have sent a secure recovery link to <strong>{email}</strong>.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
