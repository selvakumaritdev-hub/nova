import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { track } from '../services/track';

const AuthContext = createContext();

const DEFAULT_DEMO_USER = {
  id: 'usr-9018',
  name: 'Selva Kumar',
  email: 'selvakumar.itdev@gmail.com',
  phone: '+91 93636 38730',
  tier: 'NOVA Black Elite',
  memberSince: '2024',
  avatar: '/selva.jpg',
  isLoggedIn: true
};

export const AuthProvider = ({ children }) => {
  const { addToast } = useToast();

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('nova_user_v2');
      return saved ? JSON.parse(saved) : DEFAULT_DEMO_USER;
    } catch {
      return DEFAULT_DEMO_USER;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('nova_user_v2', JSON.stringify(user));
    } else {
      localStorage.removeItem('nova_user_v2');
    }
  }, [user]);

  const login = (email, password) => {
    const newUser = {
      id: 'usr-' + Math.floor(Math.random() * 9000 + 1000),
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      email: email,
      phone: '+91 93636 38730',
      tier: 'NOVA Black Elite',
      memberSince: '2025',
      avatar: '/selva.jpg',
      isLoggedIn: true
    };
    setUser(newUser);
    track('login', newUser, { method: 'email' });
    addToast(`Welcome back, ${newUser.name}!`, 'success');
    return true;
  };

  const loginWithGoogle = () => {
    const googleUser = {
      id: 'usr-google-4829',
      name: 'Eleanor Vance',
      email: 'eleanor.vance@gmail.com',
      phone: '+91 99887 76655',
      tier: 'NOVA Black Elite',
      memberSince: '2025',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
      isLoggedIn: true
    };
    setUser(googleUser);
    track('login', googleUser, { method: 'google' });
    addToast('Signed in securely with Google Account', 'success');
    return true;
  };

  const verifyOTP = (otp) => {
    if (otp && otp.length >= 4) {
      addToast('OTP verified successfully!', 'success');
      return true;
    }
    addToast('Invalid verification OTP code', 'error');
    return false;
  };

  const register = (data) => {
    const newUser = {
      id: 'usr-' + Date.now(),
      name: data.name || 'Nova Member',
      email: data.email,
      phone: data.phone || '+91 93636 38730',
      tier: 'NOVA Gold Member',
      memberSince: '2026',
      avatar: '/selva.jpg',
      isLoggedIn: true
    };
    setUser(newUser);
    track('register', newUser);
    addToast('Welcome to NOVA MALL! Your luxury membership is active.', 'success');
  };

  const logout = () => {
    track('logout', user);
    setUser(null);
    addToast('You have signed out', 'info');
  };

  const updateProfile = (updatedData) => {
    setUser(prev => ({
      ...prev,
      ...updatedData
    }));
    addToast('Profile information updated successfully', 'success');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user?.isLoggedIn,
        login,
        loginWithGoogle,
        verifyOTP,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
