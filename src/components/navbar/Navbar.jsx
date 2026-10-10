import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Sun,
  Moon,
  Globe,
  Bell,
  Layers,
  Sparkles,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Package,
  MapPin,
  Award,
  Crown
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage, languages } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { NotificationDropdown } from './NotificationDropdown';
import { apiService } from '../../services/api';
import { categoriesData } from '../../data/categories';
import { useAddress } from '../../context/AddressContext';
import { DeliveryLocationModal } from '../modal/DeliveryLocationModal';

export const Navbar = () => {
  const { totalItemCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { compareCount } = useCompare();
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const { selectedAddress } = useAddress();

  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const searchContainerRef = useRef(null);

  // Handle scroll shadow & glass effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Live search query fetching
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      const filters = { search: searchQuery, limit: 6 };
      if (selectedCategory && selectedCategory !== 'all') {
        filters.category = selectedCategory;
      }
      const results = await apiService.getProducts(filters);
      const items = Array.isArray(results) ? results : (results.products || []);
      setSearchResults(items);
    }, 220);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  // Click outside search dismiss
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsProfileMenuOpen(false);
    setIsLangMenuOpen(false);
    setIsNotifOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);
    const qs = params.toString();
    navigate(qs ? `/shop?${qs}` : '/shop');
    setIsSearchOpen(false);
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 8000,
        transition: 'all var(--transition-normal)',
        background: isScrolled ? 'var(--bg-glass-strong)' : 'var(--bg-glass)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: isScrolled ? '1px solid var(--border-medium)' : '1px solid var(--border-subtle)',
        boxShadow: isScrolled ? 'var(--shadow-md)' : 'none'
      }}
    >
      {/* Top Announcement Bar */}
      <div
        style={{
          background: 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
          color: '#FFFFFF',
          padding: '6px 16px',
          fontSize: '0.78rem',
          fontWeight: 700,
          textAlign: 'center',
          letterSpacing: '0.02em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        <span>{t('nav_announcement')}</span>
      </div>

      {/* Main Navbar */}
      <div className="container-wide" style={{ height: 'var(--header-height)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
        {/* Left: Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontFamily: 'var(--font-display)',
              textDecoration: 'none'
            }}
          >
            {/* Logo Mark SVG */}
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-medium)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(99, 102, 241, 0.35)'
              }}
            >
              <svg width="22" height="22" viewBox="0 0 100 100" fill="none">
                <path d="M26 74V26L50 56V26" stroke="url(#navGrad)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M50 74L74 74V26" stroke="url(#navGrad)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="74" cy="26" r="6" fill="#F59E0B" />
                <defs>
                  <linearGradient id="navGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div>
              <span
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 900,
                  letterSpacing: '0.04em',
                  color: 'var(--text-primary)',
                  display: 'block',
                  lineHeight: 1
                }}
              >
                NOVA <span className="text-gradient">MALL</span>
              </span>
              <span
                className="logo-subtitle"
                style={{
                  fontSize: '0.62rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em',
                  color: 'var(--text-muted)',
                  fontWeight: 700,
                  display: 'block',
                  marginTop: '2px'
                }}
              >
                Everything. One Place.
              </span>
            </div>
          </Link>

          {/* Delivery Location Pill (Amazon Style) */}
          <div
            className="nav-deliver-pill"
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              borderRadius: '6px',
              cursor: 'pointer',
              border: '1px solid transparent',
              transition: 'border-color 0.2s ease, background 0.2s ease'
            }}
            title={selectedAddress ? `Deliver to ${selectedAddress.city} ${selectedAddress.pincode}` : "Select Delivery Location"}
            onClick={() => setIsLocationModalOpen(true)}
          >
            <MapPin size={16} color="var(--amazon-amber)" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div style={{ lineHeight: 1.15 }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>
                Deliver to {selectedAddress?.name ? selectedAddress.name.split(' ')[0] : 'You'}
              </span>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                {selectedAddress ? `${selectedAddress.city} ${selectedAddress.pincode}` : 'Select Location'}
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '6px'
            }}
            className="desktop-nav"
          >
            {[
              { path: '/', label: t('nav_home') },
              { path: '/shop', label: t('nav_shop') },
              { path: '/stores', label: t('nav_stores') },
              { path: '/nova-plus', label: t('nav_novaplus'), isPill: true },
              { path: '/assistant', label: t('nav_assistant'), isAi: true }
            ].map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                style={({ isActive }) => ({
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all var(--transition-fast)'
                })}
              >
                {link.isAi && <Sparkles size={14} color="#8B5CF6" />}
                {link.isPill && <Crown size={14} color="#F59E0B" />}
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Center: Amazon Mega Search Bar */}
        <div
          ref={searchContainerRef}
          style={{
            flex: 1,
            maxWidth: '560px',
            position: 'relative',
            display: 'none'
          }}
          className="desktop-search"
        >
          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              height: '42px',
              borderRadius: '8px',
              overflow: 'hidden',
              background: 'var(--bg-input)',
              border: '1.5px solid var(--border-medium)',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
            }}
            className="amazon-search-form"
          >
            {/* Category dropdown selector */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                background: 'var(--bg-tertiary)',
                color: 'var(--text-secondary)',
                border: 'none',
                borderRight: '1px solid var(--border-medium)',
                height: '100%',
                padding: '0 10px',
                fontSize: '0.78rem',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer',
                maxWidth: '135px'
              }}
              aria-label="Select Category"
            >
              <option value="all">All Departments</option>
              {categoriesData.map(c => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>

            {/* Input field */}
            <div style={{ position: 'relative', flex: 1, height: '100%' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search Nova Mall, 500+ luxury products, tech..."
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  background: 'transparent',
                  padding: '0 32px 0 12px',
                  fontSize: '0.86rem',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Amber Search Button */}
            <button
              type="submit"
              style={{
                width: '46px',
                height: '100%',
                background: 'var(--amazon-amber)',
                border: 'none',
                color: '#131921',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 0.15s ease',
                flexShrink: 0
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--amazon-orange)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--amazon-amber)'}
              title="Search"
              aria-label="Search"
            >
              <Search size={18} strokeWidth={2.5} />
            </button>
          </form>

          {/* Autocomplete Results Dropdown */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="glass-modal"
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '8px',
                  padding: '12px',
                  zIndex: 8500,
                  maxHeight: '380px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                {searchResults.length > 0 ? (
                  searchResults.map(p => (
                    <Link
                      key={p.id}
                      to={`/product/${p.id}`}
                      onClick={() => setIsSearchOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '8px 10px',
                        borderRadius: 'var(--radius-xs)',
                        transition: 'background 0.15s'
                      }}
                      className="btn-ghost"
                    >
                      <img
                        src={p.thumbnail}
                        alt={p.title}
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80";
                        }}
                        style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.title}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--amazon-orange)', fontWeight: 800 }}>
                          ₹{p.price.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div style={{ padding: '12px', fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    Type to search across 500+ curated luxury products, fashion & tech.
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Actions (Language, Theme, Notif, Compare, Wishlist, Cart, Profile) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Language Selector Dropdown */}
          <div style={{ position: 'relative' }} className="nav-action-desktop">
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="btn btn-secondary btn-sm"
              style={{
                borderRadius: 'var(--radius-full)',
                padding: '6px 12px',
                fontSize: '0.8rem',
                gap: '6px'
              }}
              title="Change Language"
            >
              <Globe size={14} />
              <span>{languages.find(l => l.code === language)?.short || 'EN'}</span>
              <ChevronDown size={12} />
            </button>

            <AnimatePresence>
              {isLangMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="glass-modal"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    padding: '6px',
                    minWidth: '150px',
                    zIndex: 8600,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px'
                  }}
                >
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangMenuOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-xs)',
                        fontSize: '0.85rem',
                        fontWeight: language === lang.code ? 700 : 500,
                        background: language === lang.code ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                        color: language === lang.code ? 'var(--accent-primary)' : 'var(--text-primary)'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </span>
                      {language === lang.code && <span>✓</span>}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="btn-icon"
            style={{ width: '40px', height: '40px' }}
            title={t('nav_switch_theme')}
            aria-label="Toggle theme"
          >
            <motion.div
              initial={false}
              animate={{ rotate: isDark ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              {isDark ? <Sun size={18} color="#F59E0B" /> : <Moon size={18} color="#6366F1" />}
            </motion.div>
          </button>

          {/* Notifications Button */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="btn-icon"
              style={{ width: '40px', height: '40px', position: 'relative' }}
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    width: '9px',
                    height: '9px',
                    borderRadius: '50%',
                    background: 'var(--accent-rose)',
                    boxShadow: '0 0 6px var(--accent-rose)'
                  }}
                />
              )}
            </button>

            <NotificationDropdown
              isOpen={isNotifOpen}
              onClose={() => setIsNotifOpen(false)}
            />
          </div>

          {/* Compare Button */}
          <Link
            to="/compare"
            className="btn-icon nav-action-desktop"
            style={{ width: '40px', height: '40px', position: 'relative' }}
            title={t('nav_compare')}
          >
            <Layers size={18} />
            {compareCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: 'var(--accent-primary)',
                  color: '#FFFFFF',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {compareCount}
              </span>
            )}
          </Link>

          {/* Wishlist Button */}
          <Link
            to="/wishlist"
            className="btn-icon nav-action-desktop"
            style={{ width: '40px', height: '40px', position: 'relative' }}
            title={t('nav_wishlist')}
          >
            <Heart size={18} />
            {wishlistCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: 'var(--accent-rose)',
                  color: '#FFFFFF',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Returns & Orders Quick Link (Amazon Style) */}
          <Link
            to="/orders"
            style={{
              display: 'none',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '4px 8px',
              borderRadius: '6px',
              textDecoration: 'none',
              lineHeight: 1.15,
              border: '1px solid transparent',
              transition: 'border-color 0.2s ease, background 0.2s ease'
            }}
            className="nav-orders-link"
            title="Returns & Orders"
          >
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>Returns</span>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>& Orders</span>
          </Link>

          {/* Cart Trigger Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="btn-icon"
            style={{
              width: '40px',
              height: '40px',
              position: 'relative',
              background: 'rgba(99, 102, 241, 0.15)',
              borderColor: 'rgba(99, 102, 241, 0.3)',
              color: 'var(--accent-primary)'
            }}
            title={t('nav_cart')}
            aria-label="Open Shopping Bag"
          >
            <ShoppingBag size={18} />
            {totalItemCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'var(--grad-primary)',
                  color: '#FFFFFF',
                  fontSize: '0.72rem',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px var(--accent-primary-glow)'
                }}
              >
                {totalItemCount}
              </span>
            )}
          </button>

          {/* User Profile Menu */}
          <div style={{ position: 'relative' }}>
            {isAuthenticated && user ? (
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-medium)',
                  background: 'var(--bg-card)'
                }}
                aria-label="Open profile menu"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                />
              </button>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm" style={{ borderRadius: 'var(--radius-full)' }}>
                <User size={14} />
                <span>{t('nav_login')}</span>
              </Link>
            )}

            {/* Profile Menu Dropdown */}
            <AnimatePresence>
              {isProfileMenuOpen && user && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="glass-modal"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    padding: '16px',
                    width: '240px',
                    zIndex: 8700,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  <div style={{ paddingBottom: '10px', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{user.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
                    <div className="badge badge-gold" style={{ marginTop: '6px', fontSize: '0.68rem' }}>
                      {user.tier}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileMenuOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', fontSize: '0.85rem', fontWeight: 600, borderRadius: '6px' }}
                      className="btn-ghost"
                    >
                      <User size={15} />
                      <span>{t('nav_profile')}</span>
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setIsProfileMenuOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', fontSize: '0.85rem', fontWeight: 600, borderRadius: '6px' }}
                      className="btn-ghost"
                    >
                      <Package size={15} />
                      <span>{t('nav_orders')}</span>
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setIsProfileMenuOpen(false);
                      }}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', fontSize: '0.85rem', fontWeight: 600, borderRadius: '6px', color: 'var(--accent-rose)', width: '100%', textAlign: 'left' }}
                      className="btn-ghost"
                    >
                      <LogOut size={15} />
                      <span>{t('nav_logout')}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="btn-icon mobile-menu-toggle"
            style={{ width: '40px', height: '40px', display: 'none' }}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Amazon Sub-Navbar Department Strip */}
      <div
        style={{
          background: 'var(--amazon-navy-light)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.25)',
          padding: '0 20px',
          height: '38px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.82rem',
          color: '#F8FAFC',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          scrollbarWidth: 'none'
        }}
        className="amazon-subnav"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link
            to="/shop"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 800,
              color: '#FFFFFF',
              textDecoration: 'none'
            }}
            className="subnav-item"
          >
            <Menu size={15} />
            <span>All Departments</span>
          </Link>
          <Link to="/shop?sale=true" style={{ color: '#febd69', fontWeight: 800, textDecoration: 'none' }} className="subnav-item">
            ⚡ Today's Deals
          </Link>
          <Link to="/shop?category=electronics" style={{ color: '#F8FAFC', textDecoration: 'none' }} className="subnav-item">
            Electronics
          </Link>
          <Link to="/shop?category=computing" style={{ color: '#F8FAFC', textDecoration: 'none' }} className="subnav-item">
            Laptops & PCs
          </Link>
          <Link to="/shop?category=mobiles" style={{ color: '#F8FAFC', textDecoration: 'none' }} className="subnav-item">
            Mobiles
          </Link>
          <Link to="/shop?category=watches" style={{ color: '#F8FAFC', textDecoration: 'none' }} className="subnav-item">
            Watches
          </Link>
          <Link to="/shop?category=fashion-men" style={{ color: '#F8FAFC', textDecoration: 'none' }} className="subnav-item">
            Menswear
          </Link>
          <Link to="/shop?category=fashion-women" style={{ color: '#F8FAFC', textDecoration: 'none' }} className="subnav-item">
            Haute Couture
          </Link>
          <Link to="/shop?category=jewellery" style={{ color: '#F8FAFC', textDecoration: 'none' }} className="subnav-item">
            Fine Jewellery
          </Link>
          <Link to="/shop?category=beauty" style={{ color: '#F8FAFC', textDecoration: 'none' }} className="subnav-item">
            Beauty
          </Link>
          <Link to="/nova-plus" style={{ color: '#febd69', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }} className="subnav-item">
            <Crown size={13} color="#febd69" />
            <span>Nova+ VIP</span>
          </Link>
          <Link to="/stores" style={{ color: '#F8FAFC', textDecoration: 'none' }} className="subnav-item">
            Flagship Stores
          </Link>
        </div>

        <div
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.78rem',
            color: 'var(--amazon-amber)',
            fontWeight: 700
          }}
          className="subnav-perk"
        >
          <span>★ Free Next-Day Delivery with Nova+</span>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: 'var(--bg-secondary)',
              borderBottom: '1px solid var(--border-medium)',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            {/* Mobile Search input */}
            <form onSubmit={handleSearchSubmit}>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('nav_search_placeholder')}
                  className="input-field"
                  style={{ paddingLeft: '38px', borderRadius: 'var(--radius-full)' }}
                />
                <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </form>

            {/* Mobile Delivery Location Selector */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsLocationModalOpen(true);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%'
              }}
            >
              <MapPin size={18} color="var(--amazon-amber)" style={{ flexShrink: 0 }} />
              <div style={{ lineHeight: 1.2 }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>
                  Deliver to {selectedAddress?.name ? selectedAddress.name.split(' ')[0] : 'You'}
                </span>
                <span style={{ fontSize: '0.88rem', fontWeight: 800 }}>
                  {selectedAddress ? `${selectedAddress.city} ${selectedAddress.pincode}` : 'Select Delivery Location'}
                </span>
              </div>
            </button>

            {/* Mobile Language Selector Chips */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '4px 0', scrollbarWidth: 'none' }}>
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.78rem',
                    fontWeight: language === lang.code ? 800 : 600,
                    border: language === lang.code ? '1px solid var(--amazon-orange)' : '1px solid var(--border-subtle)',
                    background: language === lang.code ? 'rgba(255, 153, 0, 0.15)' : 'var(--bg-card)',
                    color: language === lang.code ? 'var(--amazon-amber)' : 'var(--text-primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px', fontSize: '1rem', fontWeight: 700 }}>
                {t('nav_home')}
              </Link>
              <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px', fontSize: '1rem', fontWeight: 700 }}>
                {t('nav_shop')}
              </Link>
              <Link to="/stores" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px', fontSize: '1rem', fontWeight: 700 }}>
                {t('nav_stores')}
              </Link>
              <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px', fontSize: '1rem', fontWeight: 700 }}>
                📦 {t('nav_orders')}
              </Link>
              <Link to="/compare" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px', fontSize: '1rem', fontWeight: 700 }}>
                ⚖ {t('nav_compare')}
              </Link>
              <Link to="/nova-plus" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px', fontSize: '1rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                ★ {t('nav_novaplus')}
              </Link>
              <Link to="/assistant" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px', fontSize: '1rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                ✨ {t('nav_assistant')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 992px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-search {
            display: block !important;
          }
        }
        @media (min-width: 900px) {
          .nav-deliver-pill {
            display: flex !important;
          }
          .nav-orders-link {
            display: flex !important;
          }
        }
        @media (min-width: 1280px) {
          .subnav-perk {
            display: flex !important;
          }
        }
        @media (max-width: 991px) {
          .mobile-menu-toggle {
            display: flex !important;
          }
        }
        @media (max-width: 768px) {
          .nav-action-desktop {
            display: none !important;
          }
        }
        @media (max-width: 420px) {
          .logo-subtitle {
            display: none !important;
          }
        }
        .amazon-subnav::-webkit-scrollbar {
          display: none;
        }
        .subnav-item {
          padding: 4px 8px;
          border-radius: 4px;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .subnav-item:hover {
          background: rgba(255, 255, 255, 0.12);
        }
        .amazon-search-form:focus-within {
          border-color: var(--amazon-orange) !important;
          box-shadow: 0 0 0 2px rgba(255, 153, 0, 0.35) !important;
        }
        .nav-deliver-pill:hover, .nav-orders-link:hover {
          border-color: rgba(255, 255, 255, 0.3) !important;
          background: rgba(255, 255, 255, 0.06);
        }
      `}</style>

      {/* Smart Delivery Location Modal */}
      <DeliveryLocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
    </header>
  );
};
