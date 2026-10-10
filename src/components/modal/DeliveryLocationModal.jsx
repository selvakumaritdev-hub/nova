import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  X,
  Navigation,
  Check,
  Plus,
  Home,
  Briefcase,
  AlertCircle,
  Truck,
  ShieldCheck
} from 'lucide-react';
import { useAddress } from '../../context/AddressContext';
import { useToast } from '../../context/ToastContext';

// Verified Metro Serviceability Database
const METRO_ZONES = [
  { prefix: '400', city: 'Mumbai', state: 'Maharashtra', estimate: 'Today by 9:00 PM (Nova+ Priority Hub)' },
  { prefix: '110', city: 'Delhi', state: 'Delhi', estimate: 'Tomorrow by 11:00 AM' },
  { prefix: '560', city: 'Bengaluru', state: 'Karnataka', estimate: 'Tomorrow by 1:00 PM' },
  { prefix: '600', city: 'Chennai', state: 'Tamil Nadu', estimate: 'Tomorrow by 2:00 PM' },
  { prefix: '500', city: 'Hyderabad', state: 'Telangana', estimate: 'Tomorrow by 2:00 PM' },
  { prefix: '411', city: 'Pune', state: 'Maharashtra', estimate: 'Tomorrow by 3:00 PM' },
  { prefix: '380', city: 'Ahmedabad', state: 'Gujarat', estimate: '2 Business Days' },
  { prefix: '700', city: 'Kolkata', state: 'West Bengal', estimate: '2 Business Days' }
];

export const DeliveryLocationModal = ({ isOpen, onClose }) => {
  const { addresses, selectedAddressId, setSelectedAddressId, addAddress } = useAddress();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('select'); // 'select' | 'new'
  const [pincodeInput, setPincodeInput] = useState('');
  const [pincodeResult, setPincodeResult] = useState(null);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [geoError, setGeoError] = useState(null);

  // New Address Form State
  const [newForm, setNewForm] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    type: 'Home',
    isDefault: false
  });
  const [formErrors, setFormErrors] = useState({});

  if (!isOpen) return null;

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    const cleanPin = pincodeInput.trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      setPincodeResult({ valid: false, message: 'Please enter a valid 6-digit Indian PIN code.' });
      return;
    }

    const prefix = cleanPin.substring(0, 3);
    const matched = METRO_ZONES.find(m => m.prefix === prefix);

    if (matched) {
      setPincodeResult({
        valid: true,
        pincode: cleanPin,
        city: matched.city,
        state: matched.state,
        estimate: matched.estimate,
        express: true
      });
      addToast(`Delivery confirmed for ${matched.city} (${cleanPin})!`, 'success');
    } else {
      setPincodeResult({
        valid: true,
        pincode: cleanPin,
        city: 'Verified Service Area',
        state: 'India',
        estimate: 'Delivery within 2 to 3 Business Days',
        express: false
      });
      addToast(`Standard Delivery confirmed for ${cleanPin}`, 'info');
    }
  };

  const handleApplyPincode = () => {
    if (!pincodeResult || !pincodeResult.valid) return;
    const tempAddr = addAddress({
      name: 'Guest Shopper',
      phone: '+91 98000 00000',
      street: `Area Postal Service Zone`,
      city: pincodeResult.city,
      state: pincodeResult.state,
      pincode: pincodeResult.pincode,
      type: 'Home',
      isDefault: false
    });
    setSelectedAddressId(tempAddr.id);
    onClose();
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Browser geolocation is not supported by your device.');
      return;
    }

    setIsGeolocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsGeolocating(false);
        const { latitude, longitude } = pos.coords;

        // Map nearest hub based on latitude coordinate approximation
        let detected = METRO_ZONES[0]; // Mumbai default
        if (latitude > 25) detected = METRO_ZONES[1]; // Delhi
        else if (latitude < 13.5 && longitude > 79) detected = METRO_ZONES[3]; // Chennai
        else if (latitude < 14) detected = METRO_ZONES[2]; // Bengaluru

        const autoAddr = addAddress({
          name: 'My Current Location',
          phone: '+91 98840 11223',
          street: `GPS Detected Coordinate Pin (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`,
          city: detected.city,
          state: detected.state,
          pincode: `${detected.prefix}001`,
          type: 'Home',
          isDefault: true
        });

        setSelectedAddressId(autoAddr.id);
        addToast(`Location set to ${detected.city} (${detected.prefix}001)!`, 'success');
        onClose();
      },
      (err) => {
        setIsGeolocating(false);
        if (err.code === 1) {
          setGeoError('Location permission was denied. You can still enter your 6-digit PIN code below.');
        } else {
          setGeoError('Could not detect location. Please search by PIN code.');
        }
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleCreateAddress = (e) => {
    e.preventDefault();
    const errs = {};
    if (!newForm.name.trim()) errs.name = 'Full name is required';
    if (!newForm.phone.trim()) errs.phone = 'Phone number is required';
    if (!newForm.street.trim()) errs.street = 'Street / House details required';
    if (!newForm.city.trim()) errs.city = 'City is required';
    if (!newForm.state.trim()) errs.state = 'State is required';
    if (!/^\d{6}$/.test(newForm.pincode.trim())) errs.pincode = 'Valid 6-digit PIN code required';

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    const saved = addAddress(newForm);
    setSelectedAddressId(saved.id);
    setActiveTab('select');
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 7, 12, 0.75)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        style={{
          width: '100%',
          maxWidth: '520px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 22px',
            background: 'var(--amazon-navy)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MapPin size={20} color="var(--amazon-amber)" />
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Choose Delivery Location</h3>
              <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Select a delivery address to view live product availability</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-icon"
            style={{ width: '32px', height: '32px', background: 'transparent', color: '#FFFFFF', border: 'none', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Selector */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-tertiary)' }}>
          <button
            onClick={() => setActiveTab('select')}
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'select' ? 800 : 600,
              color: activeTab === 'select' ? 'var(--amazon-amber)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'select' ? '2px solid var(--amazon-amber)' : 'none',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Saved Addresses & PIN Code
          </button>
          <button
            onClick={() => setActiveTab('new')}
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'new' ? 800 : 600,
              color: activeTab === 'new' ? 'var(--amazon-amber)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'new' ? '2px solid var(--amazon-amber)' : 'none',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Plus size={14} />
            <span>Add New Address</span>
          </button>
        </div>

        {/* Body Content */}
        <div style={{ padding: '22px', maxHeight: '500px', overflowY: 'auto' }}>
          {activeTab === 'select' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Geolocation Button */}
              <div>
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={isGeolocating}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    background: 'rgba(254, 189, 105, 0.12)',
                    border: '1px solid var(--amazon-amber)',
                    color: 'var(--amazon-amber)',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: isGeolocating ? 'wait' : 'pointer',
                    transition: 'background 0.15s ease'
                  }}
                >
                  <Navigation size={16} />
                  <span>{isGeolocating ? 'Detecting your coordinates...' : 'Use My Current Location'}</span>
                </button>

                {geoError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-rose)', fontSize: '0.78rem', marginTop: '6px' }}>
                    <AlertCircle size={13} />
                    <span>{geoError}</span>
                  </div>
                )}
              </div>

              {/* Saved Addresses List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                  Saved Addresses
                </span>

                {addresses.map(addr => {
                  const isSelected = addr.id === selectedAddressId;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '8px',
                        border: isSelected ? '2px solid var(--amazon-amber)' : '1px solid var(--border-medium)',
                        background: isSelected ? 'rgba(254, 189, 105, 0.08)' : 'var(--bg-card)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: '12px',
                        transition: 'border-color 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <div style={{ marginTop: '2px', color: isSelected ? 'var(--amazon-amber)' : 'var(--text-muted)' }}>
                          {addr.type === 'Work' ? <Briefcase size={16} /> : <Home size={16} />}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{addr.name}</span>
                            <span className="badge badge-gold" style={{ fontSize: '0.66rem', padding: '1px 6px' }}>{addr.type}</span>
                            {addr.isDefault && (
                              <span style={{ fontSize: '0.68rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>Default</span>
                            )}
                          </div>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '4px 0 0', lineHeight: 1.35 }}>
                            {addr.street}, {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                          </p>
                          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Phone: {addr.phone}</span>
                        </div>
                      </div>

                      {isSelected && (
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--amazon-amber)', color: '#131921', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Check size={13} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Pincode Quick Checker */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                  Or Check PIN Code Serviceability
                </span>
                <form onSubmit={handlePincodeCheck} style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <input
                    type="text"
                    value={pincodeInput}
                    onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit Indian PIN Code"
                    className="input-field"
                    style={{ flex: 1, padding: '9px 12px', fontSize: '0.86rem' }}
                  />
                  <button type="submit" className="btn btn-secondary" style={{ padding: '9px 16px', fontSize: '0.85rem' }}>
                    Check
                  </button>
                </form>

                {pincodeResult && (
                  <div
                    style={{
                      marginTop: '10px',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      background: pincodeResult.valid ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                      border: `1px solid ${pincodeResult.valid ? 'var(--accent-emerald)' : 'var(--accent-rose)'}`,
                      fontSize: '0.82rem'
                    }}
                  >
                    {pincodeResult.valid ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-emerald)', fontWeight: 800 }}>
                          <Truck size={14} />
                          <span>Serviceable: {pincodeResult.city} ({pincodeResult.pincode})</span>
                        </div>
                        <div style={{ color: 'var(--text-secondary)' }}>
                          Estimated Delivery: <strong>{pincodeResult.estimate}</strong>
                        </div>
                        <button
                          type="button"
                          onClick={handleApplyPincode}
                          style={{
                            marginTop: '6px',
                            background: 'var(--amazon-amber)',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '6px 12px',
                            fontSize: '0.78rem',
                            fontWeight: 800,
                            color: '#131921',
                            cursor: 'pointer',
                            width: 'fit-content'
                          }}
                        >
                          Deliver to this PIN Code
                        </button>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--accent-rose)', fontWeight: 600 }}>{pincodeResult.message}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Add New Address Form */
            <form onSubmit={handleCreateAddress} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label className="input-label" style={{ fontSize: '0.78rem' }}>Full Name *</label>
                <input
                  type="text"
                  value={newForm.name}
                  onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                  placeholder="e.g. Selva Kumar"
                  className="input-field"
                  style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                />
                {formErrors.name && <span style={{ color: 'var(--accent-rose)', fontSize: '0.72rem' }}>{formErrors.name}</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label className="input-label" style={{ fontSize: '0.78rem' }}>Phone Number *</label>
                  <input
                    type="text"
                    value={newForm.phone}
                    onChange={(e) => setNewForm({ ...newForm, phone: e.target.value })}
                    placeholder="+91 98840 00000"
                    className="input-field"
                    style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                  />
                  {formErrors.phone && <span style={{ color: 'var(--accent-rose)', fontSize: '0.72rem' }}>{formErrors.phone}</span>}
                </div>

                <div>
                  <label className="input-label" style={{ fontSize: '0.78rem' }}>PIN Code *</label>
                  <input
                    type="text"
                    value={newForm.pincode}
                    onChange={(e) => setNewForm({ ...newForm, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                    placeholder="6-digit PIN"
                    className="input-field"
                    style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                  />
                  {formErrors.pincode && <span style={{ color: 'var(--accent-rose)', fontSize: '0.72rem' }}>{formErrors.pincode}</span>}
                </div>
              </div>

              <div>
                <label className="input-label" style={{ fontSize: '0.78rem' }}>Flat, Building, Apartment, Street *</label>
                <input
                  type="text"
                  value={newForm.street}
                  onChange={(e) => setNewForm({ ...newForm, street: e.target.value })}
                  placeholder="e.g. 402 Silver Palm, BKC Main Road"
                  className="input-field"
                  style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                />
                {formErrors.street && <span style={{ color: 'var(--accent-rose)', fontSize: '0.72rem' }}>{formErrors.street}</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label className="input-label" style={{ fontSize: '0.78rem' }}>City *</label>
                  <input
                    type="text"
                    value={newForm.city}
                    onChange={(e) => setNewForm({ ...newForm, city: e.target.value })}
                    placeholder="e.g. Mumbai"
                    className="input-field"
                    style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                  />
                  {formErrors.city && <span style={{ color: 'var(--accent-rose)', fontSize: '0.72rem' }}>{formErrors.city}</span>}
                </div>

                <div>
                  <label className="input-label" style={{ fontSize: '0.78rem' }}>State *</label>
                  <input
                    type="text"
                    value={newForm.state}
                    onChange={(e) => setNewForm({ ...newForm, state: e.target.value })}
                    placeholder="e.g. Maharashtra"
                    className="input-field"
                    style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                  />
                  {formErrors.state && <span style={{ color: 'var(--accent-rose)', fontSize: '0.72rem' }}>{formErrors.state}</span>}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '4px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Address Type:</span>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="addrType"
                    checked={newForm.type === 'Home'}
                    onChange={() => setNewForm({ ...newForm, type: 'Home' })}
                  />
                  <span>Home</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="addrType"
                    checked={newForm.type === 'Work'}
                    onChange={() => setNewForm({ ...newForm, type: 'Work' })}
                  />
                  <span>Work / Office</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: 'var(--amazon-amber)',
                    color: '#131921',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: 'pointer'
                  }}
                >
                  Save & Deliver Here
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('select')}
                  className="btn btn-secondary"
                  style={{ padding: '10px 18px', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer Actions */}
        {activeTab === 'select' && (
          <div
            style={{
              padding: '14px 22px',
              borderTop: '1px solid var(--border-subtle)',
              background: 'var(--bg-tertiary)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px'
            }}
          >
            <button
              onClick={onClose}
              style={{
                background: 'var(--amazon-amber)',
                color: '#131921',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 20px',
                fontSize: '0.86rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Done
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
