import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Compass,
  Calendar,
  Sparkles,
  CheckCircle2,
  Navigation,
  X
} from 'lucide-react';
import { storesData } from '../../data/stores';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';

export const Stores = () => {
  const { addToast } = useToast();
  const { t, language } = useLanguage();

  const [selectedCity, setSelectedCity] = useState('All');
  const [activeStore, setActiveStore] = useState(storesData[0]);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [appointmentName, setAppointmentName] = useState('Selva Kumar');
  const [appointmentDate, setAppointmentDate] = useState('2026-10-15');
  const [appointmentTime, setAppointmentTime] = useState('02:00 PM');
  const [appointmentService, setAppointmentService] = useState('360 VR Product Pod Demo');

  const filteredStores = storesData.filter(store => {
    if (selectedCity === 'All') return true;
    return store.city.toLowerCase() === selectedCity.toLowerCase();
  });

  const handleBookAppointment = (e) => {
    e.preventDefault();
    setIsAppointmentModalOpen(false);
    addToast(`VIP Appointment confirmed at ${activeStore.name} for ${appointmentDate} at ${appointmentTime}!`, 'success');
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header */}
      <div>
        <span className="section-tag">
          <MapPin size={14} />
          <span>Global Architectural Marvels</span>
        </span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '6px' }}>
          {t('stores_title')}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '600px', marginTop: '4px' }}>
          {t('stores_subtitle')}
        </p>
      </div>

      {/* City Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {['All', 'Mumbai', 'Bengaluru', 'Delhi NCR', 'Chennai', 'Hyderabad', 'Dubai'].map(city => (
          <button
            key={city}
            onClick={() => setSelectedCity(city)}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 700,
              background: selectedCity === city ? 'var(--accent-primary)' : 'var(--bg-card)',
              color: selectedCity === city ? '#FFFFFF' : 'var(--text-secondary)',
              border: '1px solid var(--border-medium)',
              whiteSpace: 'nowrap'
            }}
          >
            {city === 'All' ? t('stores_all_cities') : city}
          </button>
        ))}
      </div>

      {/* Interactive Map Visual Area */}
      <div
        className="glass-panel"
        style={{
          borderRadius: 'var(--radius-xl)',
          height: '320px',
          position: 'relative',
          overflow: 'hidden',
          background: 'radial-gradient(ellipse at center, rgba(15, 23, 42, 0.95) 0%, rgba(9, 11, 16, 1) 100%)',
          border: '1px solid var(--border-medium)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Architectural Blueprint Grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(99, 102, 241, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.08) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />

        {/* Global Cities Pins on stylized map */}
        {storesData.map((store, idx) => {
          const isSelected = activeStore.id === store.id;

          return (
            <motion.div
              key={store.id}
              whileHover={{ scale: 1.15 }}
              onClick={() => setActiveStore(store)}
              style={{
                position: 'absolute',
                top: `${30 + (idx % 3) * 22}%`,
                left: `${15 + idx * 13}%`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <div
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  background: isSelected ? 'var(--accent-primary)' : 'rgba(9, 11, 16, 0.85)',
                  border: isSelected ? '2px solid #FFF' : '1px solid var(--border-subtle)',
                  color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  backdropFilter: 'blur(8px)',
                  marginBottom: '4px',
                  boxShadow: isSelected ? '0 0 15px var(--accent-primary-glow)' : 'none'
                }}
              >
                {store.city}
              </div>
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: isSelected ? 'var(--accent-gold)' : 'var(--accent-primary)',
                  border: '2px solid #FFF',
                  boxShadow: '0 0 10px rgba(0,0,0,0.5)'
                }}
              />
            </motion.div>
          );
        })}

        {/* Selected Store Floating HUD Card */}
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            padding: '12px 18px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(9, 11, 16, 0.9)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border-medium)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 20
          }}
        >
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: 'var(--accent-emerald)',
              boxShadow: '0 0 8px var(--accent-emerald)'
            }}
          />
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>{activeStore.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{activeStore.hours}</div>
          </div>
        </div>
      </div>

      {/* Stores List Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}
      >
        {filteredStores.map(store => (
          <div
            key={store.id}
            className="glass-panel"
            style={{
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ width: '100%', height: '200px', position: 'relative' }}>
              <img src={store.image} alt={store.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <span
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(9, 11, 16, 0.8)',
                  backdropFilter: 'blur(8px)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--accent-emerald)'
                }}
              >
                ● {store.status}
              </span>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{store.name}</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <MapPin size={16} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{store.address}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={16} color="var(--accent-gold)" style={{ flexShrink: 0 }} />
                  <span>{store.hours}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={16} color="var(--accent-emerald)" style={{ flexShrink: 0 }} />
                  <span>{store.phone}</span>
                </div>
              </div>

              {/* Amenities Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                {store.amenities.map((amenity, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '3px 8px',
                      borderRadius: '4px',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: 'var(--text-muted)'
                    }}
                  >
                    ✦ {amenity}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={() => {
                    setActiveStore(store);
                    setIsAppointmentModalOpen(true);
                  }}
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                >
                  <Calendar size={14} />
                  <span>{t('stores_book_vip')}</span>
                </button>

                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary btn-sm"
                >
                  <Navigation size={14} />
                  <span>Directions</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Book VIP Appointment Modal */}
      <AnimatePresence>
        {isAppointmentModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(5, 7, 12, 0.8)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px'
            }}
            onClick={() => setIsAppointmentModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-modal"
              style={{
                maxWidth: '480px',
                width: '100%',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Book VIP Store Appointment</h3>
                <button onClick={() => setIsAppointmentModalOpen(false)} className="btn-icon btn-sm">
                  <X size={16} />
                </button>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Store: <strong>{activeStore.name}</strong>
              </div>

              <form onSubmit={handleBookAppointment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="input-group">
                  <label className="input-label">Your Name</label>
                  <input
                    type="text"
                    value={appointmentName}
                    onChange={(e) => setAppointmentName(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Preferred Experience Service</label>
                  <select
                    value={appointmentService}
                    onChange={(e) => setAppointmentService(e.target.value)}
                    className="input-field"
                  >
                    <option value="360 VR Product Pod Demo">360° VR Product Pod Demo</option>
                    <option value="Personal Stylist & Fashion Atelier">Personal Stylist & Fashion Atelier</option>
                    <option value="Audiophile Sound Chamber Consultation">Audiophile Sound Chamber Consultation</option>
                    <option value="Luxury Watch Valuation & Fitting">Luxury Watch Valuation & Fitting</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="input-group">
                    <label className="input-label">Date</label>
                    <input
                      type="date"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Time</label>
                    <select
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      className="input-field"
                    >
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="05:00 PM">05:00 PM</option>
                      <option value="07:30 PM">07:30 PM</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '6px' }}>
                  Confirm VIP Reservation
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
