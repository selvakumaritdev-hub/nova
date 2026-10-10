import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  ShoppingBag,
  MapPin,
  Truck,
  CreditCard,
  QrCode,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Plus,
  Lock,
  Building,
  Home as HomeIcon,
  Briefcase
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../../context/CartContext';
import { useAddress } from '../../context/AddressContext';
import { useOrders } from '../../context/OrdersContext';
import { useRewards } from '../../context/RewardsContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';

export const Checkout = () => {
  const { cart, subtotal, discountAmount, deliveryFee, totalAmount, clearCart } = useCart();
  const { addresses, selectedAddress, selectedAddressId, setSelectedAddressId, addAddress } = useAddress();
  const { placeOrder } = useOrders();
  const { earnPoints } = useRewards();
  const { addToast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState('express'); // 'standard' | 'express'
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'cod' | 'netbanking'
  const [upiId, setUpiId] = useState('selvakumar@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('789');
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // New Address Form State
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPincode, setNewPincode] = useState('');
  const [newType, setNewType] = useState('Home');

  const expressFee = deliveryMethod === 'express' ? 0 : 0; // free with promo
  const finalPayable = totalAmount + expressFee;

  const handleAddNewAddress = (e) => {
    e.preventDefault();
    if (!newStreet || !newCity || !newPincode) {
      addToast('Please complete all address fields', 'warning');
      return;
    }

    const addr = addAddress({
      name: 'Selva Kumar',
      type: newType,
      street: newStreet,
      city: newCity,
      state: newState || 'Maharashtra',
      pincode: newPincode,
      phone: '+91 93636 38730',
      isDefault: true
    });

    setShowNewAddressForm(false);
  };

  const handleCompleteOrder = () => {
    // Generate order
    const orderPayload = {
      items: cart,
      subtotal,
      discount: discountAmount,
      deliveryFee,
      total: finalPayable,
      paymentMethod: paymentMethod === 'upi' ? `UPI (${upiId})` : paymentMethod === 'card' ? `Card (Ending ${cardNumber.slice(-4)})` : 'Cash on Delivery',
      address: selectedAddress || addresses[0]
    };

    const newOrder = placeOrder(orderPayload);
    setConfirmedOrder(newOrder);

    // Reward loyalty points (1 point per ₹10 spent)
    earnPoints(Math.round(finalPayable / 10));

    // Clear shopping cart
    clearCart();

    // Trigger celebratory confetti
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#6366F1', '#F59E0B', '#10B981', '#EC4899']
    });

    setCurrentStep(5);
  };

  const steps = [
    { num: 1, label: t('checkout_step_review') },
    { num: 2, label: t('checkout_step_address') },
    { num: 3, label: t('checkout_step_delivery') },
    { num: 4, label: t('checkout_step_payment') }
  ];

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem', maxWidth: '1080px' }}>
      {/* Checkout Progress Stepper (Steps 1 to 4) */}
      {currentStep < 5 && (
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '20px',
                right: '20px',
                height: '2px',
                background: 'var(--border-medium)',
                zIndex: 0,
                transform: 'translateY(-50%)'
              }}
            />
            {steps.map(s => {
              const isDone = currentStep > s.num;
              const isCurrent = currentStep === s.num;

              return (
                <div
                  key={s.num}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-full)',
                      background: isDone ? 'var(--accent-emerald)' : isCurrent ? 'var(--grad-primary)' : 'var(--bg-secondary)',
                      border: isCurrent ? 'none' : '2px solid var(--border-medium)',
                      color: isDone || isCurrent ? '#FFFFFF' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      boxShadow: isCurrent ? '0 0 15px var(--accent-primary-glow)' : 'none'
                    }}
                  >
                    {isDone ? <Check size={18} /> : s.num}
                  </div>
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: isCurrent ? 800 : 600,
                      color: isCurrent ? 'var(--text-primary)' : 'var(--text-muted)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 1: CART REVIEW */}
      {currentStep === 1 && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ padding: '32px', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Review Your Luxury Selection</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cart.map(item => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  gap: '16px'
                }}
              >
                <img src={item.thumbnail} alt={item.title} style={{ width: '64px', height: '64px', borderRadius: '6px', objectFit: 'cover' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>{item.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Quantity: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</div>
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
            <Link to="/cart" className="btn btn-secondary btn-sm">
              <ArrowLeft size={15} />
              <span>Modify Cart</span>
            </Link>
            <button onClick={() => setCurrentStep(2)} className="btn btn-primary">
              <span>Continue to Address</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 2: ADDRESS SELECTION */}
      {currentStep === 2 && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ padding: '32px', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{t('checkout_address_select')}</h2>
            <button
              onClick={() => setShowNewAddressForm(!showNewAddressForm)}
              className="btn btn-secondary btn-sm"
            >
              <Plus size={15} />
              <span>{t('checkout_address_add_new')}</span>
            </button>
          </div>

          {/* New Address Form */}
          {showNewAddressForm && (
            <form onSubmit={handleAddNewAddress} className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '14px', background: 'var(--bg-card)' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['Home', 'Work', 'Other'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setNewType(type)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-full)',
                      background: newType === type ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                      color: newType === type ? '#FFF' : 'var(--text-secondary)',
                      fontSize: '0.8rem',
                      fontWeight: 700
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Street address, building, floor..."
                value={newStreet}
                onChange={(e) => setNewStreet(e.target.value)}
                className="input-field"
                required
              />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="City"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="input-field"
                  required
                />
                <input
                  type="text"
                  placeholder="State"
                  value={newState}
                  onChange={(e) => setNewState(e.target.value)}
                  className="input-field"
                />
                <input
                  type="text"
                  placeholder="Pincode"
                  value={newPincode}
                  onChange={(e) => setNewPincode(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowNewAddressForm(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Address
                </button>
              </div>
            </form>
          )}

          {/* Saved Addresses List */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {addresses.map(addr => {
              const isSelected = selectedAddressId === addr.id;

              return (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddressId(addr.id)}
                  style={{
                    padding: '18px',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-secondary)',
                    border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-medium)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className="badge badge-new">
                      {addr.type === 'Home' ? <HomeIcon size={12} /> : <Briefcase size={12} />}
                      <span>{addr.type}</span>
                    </span>
                    {isSelected && <Check size={18} color="var(--accent-primary)" />}
                  </div>

                  <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>{addr.name}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Phone: {addr.phone}</span>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
            <button onClick={() => setCurrentStep(1)} className="btn btn-secondary btn-sm">
              <ArrowLeft size={15} />
              <span>Back</span>
            </button>
            <button onClick={() => setCurrentStep(3)} className="btn btn-primary">
              <span>Continue to Delivery</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 3: DELIVERY METHOD */}
      {currentStep === 3 && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ padding: '32px', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Select Delivery Speed</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              {
                id: 'express',
                title: "NOVA Lightning 2-Hour Express",
                desc: "Dispatched from BKC micro-fulfillment vault via climate-controlled EV",
                eta: "Today by 4:30 PM",
                price: "FREE with NOVA+"
              },
              {
                id: 'standard',
                title: "NOVA Standard White Glove Delivery",
                desc: "Scheduled delivery with scheduled time slot verification",
                eta: "Tomorrow by 2:00 PM",
                price: "FREE"
              }
            ].map(opt => (
              <div
                key={opt.id}
                onClick={() => setDeliveryMethod(opt.id)}
                style={{
                  padding: '20px',
                  borderRadius: 'var(--radius-md)',
                  background: deliveryMethod === opt.id ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-secondary)',
                  border: deliveryMethod === opt.id ? '2px solid var(--accent-primary)' : '1px solid var(--border-medium)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <Truck size={24} color="var(--accent-primary)" />
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800 }}>{opt.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{opt.desc}</p>
                    <span style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)', fontWeight: 700, display: 'block', marginTop: '4px' }}>
                      ETA: {opt.eta}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontWeight: 800, color: 'var(--accent-emerald)', fontSize: '0.9rem' }}>
                    {opt.price}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
            <button onClick={() => setCurrentStep(2)} className="btn btn-secondary btn-sm">
              <ArrowLeft size={15} />
              <span>Back</span>
            </button>
            <button onClick={() => setCurrentStep(4)} className="btn btn-primary">
              <span>Continue to Payment</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 4: PAYMENT SELECTION & ORDER PLACEMENT */}
      {currentStep === 4 && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ padding: '32px', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{t('checkout_payment_method')}</h2>
            <span style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)' }}>
              Payable: ₹{finalPayable.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Payment Tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
            {[
              { id: 'upi', label: 'UPI / FastPay', icon: QrCode },
              { id: 'card', label: 'Card Payment', icon: CreditCard },
              { id: 'cod', label: 'Cash on Delivery', icon: ShieldCheck }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setPaymentMethod(tab.id)}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-sm)',
                    background: paymentMethod === tab.id ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                    color: paymentMethod === tab.id ? '#FFFFFF' : 'var(--text-secondary)',
                    border: '1px solid var(--border-medium)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}
                >
                  <Icon size={20} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Payment Method Details */}
          {paymentMethod === 'upi' && (
            <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '14px', background: 'var(--bg-secondary)' }}>
              <div
                style={{
                  width: '160px',
                  height: '160px',
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=novamall@luxury&pn=NOVA%20MALL&am=24999"
                  alt="UPI QR Scanner"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>

              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>Scan QR with any UPI App</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Google Pay • PhonePe • Paytm • BHIM</p>
              </div>

              <div style={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
                <label className="input-label">Or Enter Virtual UPI ID:</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '14px', background: 'var(--bg-secondary)' }}>
              <div className="input-group">
                <label className="input-label">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="input-field"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="input-group">
                  <label className="input-label">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">CVV</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'cod' && (
            <div style={{ padding: '20px', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                ✓ Cash, Card or UPI accepted by our delivery personnel at your doorstep upon verification.
              </p>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
            <button onClick={() => setCurrentStep(3)} className="btn btn-secondary btn-sm">
              <ArrowLeft size={15} />
              <span>Back</span>
            </button>
            <button onClick={handleCompleteOrder} className="btn btn-primary btn-lg">
              <Lock size={16} />
              <span>{t('checkout_place_order')} (₹{finalPayable.toLocaleString('en-IN')})</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 5: ORDER CONFIRMATION CELEBRATION */}
      {currentStep === 5 && confirmedOrder && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-panel"
          style={{
            padding: '48px 32px',
            borderRadius: 'var(--radius-xl)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '2px solid var(--accent-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-emerald)'
            }}
          >
            <CheckCircle2 size={44} />
          </div>

          <div>
            <span className="badge badge-success" style={{ marginBottom: '8px' }}>
              PAYMENT VERIFIED & SECURED
            </span>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '4px' }}>
              {t('checkout_order_success')}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginTop: '6px' }}>
              Thank you, Selva. Your luxury order reference is <strong>{confirmedOrder.id}</strong>.
            </p>
          </div>

          {/* Order Details Pod */}
          <div
            style={{
              width: '100%',
              maxWidth: '520px',
              padding: '20px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-medium)',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Estimated Delivery:</span>
              <span style={{ fontWeight: 800, color: 'var(--accent-emerald)' }}>{confirmedOrder.estimatedDelivery}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Carrier:</span>
              <span style={{ fontWeight: 700 }}>{confirmedOrder.carrier}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Tracking Number:</span>
              <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{confirmedOrder.trackingNumber}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 900, paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
              <span>Total Paid:</span>
              <span>₹{confirmedOrder.total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '12px' }}>
            <Link to={`/orders/${confirmedOrder.id}`} className="btn btn-primary btn-lg">
              <Truck size={18} />
              <span>{t('checkout_track_order_btn')}</span>
            </Link>
            <Link to="/shop" className="btn btn-secondary btn-lg">
              <span>{t('checkout_continue_shopping')}</span>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};
