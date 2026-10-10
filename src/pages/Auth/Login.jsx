import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, Key } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const Login = () => {
  const { login, loginWithGoogle, verifyOTP } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('selvakumar.itdev@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [otp, setOtp] = useState('8942');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate('/profile');
    }
  };

  const handleGoogleLogin = () => {
    if (loginWithGoogle()) {
      navigate('/profile');
    }
  };

  const handleOtpVerify = (e) => {
    e.preventDefault();
    if (verifyOTP(otp)) {
      navigate('/profile');
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
          gap: '24px',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-medium)'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <span className="section-tag" style={{ marginBottom: '8px' }}>
            <Sparkles size={13} />
            <span>VIP MEMBER ACCESS</span>
          </span>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginTop: '4px' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
            Sign in to access your NOVA+ perks and order vault
          </p>
        </div>

        {!showOtpStep ? (
          <>
            {/* Google Sign-In Simulation */}
            <button
              onClick={handleGoogleLogin}
              className="btn btn-secondary btn-block"
              style={{ padding: '12px', fontSize: '0.9rem', gap: '10px' }}
            >
              <span style={{ fontSize: '1.1rem' }}>🌐</span>
              <span>Continue with Google</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>OR PASSWORD LOGIN</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
            </div>

            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="input-group">
                <label className="input-label">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div className="input-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="input-label">Password</label>
                  <Link to="/forgot-password" style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                    Forgot?
                  </Link>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginTop: '8px' }}>
                <Lock size={16} />
                <span>Sign In Securely</span>
              </button>
            </form>

            <button
              onClick={() => setShowOtpStep(true)}
              style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: 700, textAlign: 'center' }}
            >
              Prefer SMS / WhatsApp OTP Login?
            </button>
          </>
        ) : (
          <form onSubmit={handleOtpVerify} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Enter 4-Digit Verification OTP</label>
              <input
                type="text"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="input-field"
                style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.4em', fontWeight: 800 }}
                required
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', marginTop: '4px' }}>
                ✓ Demo OTP code prefilled: 8942
              </span>
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg">
              <span>Verify & Access Account</span>
              <ArrowRight size={16} />
            </button>

            <button
              type="button"
              onClick={() => setShowOtpStep(false)}
              style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}
            >
              Back to standard login
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>
            Create Account
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
