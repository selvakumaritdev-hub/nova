import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import { track } from '../services/track';

const API_URL = import.meta.env.VITE_API_URL || '';

const OrdersContext = createContext();

const INITIAL_DEMO_ORDERS = [
  {
    id: 'NOV-849201',
    date: '2026-10-06',
    items: [
      {
        id: 101,
        title: 'Nova Horizon Pro ANC Spatial Wireless Headphones',
        brand: 'Nova Acoustics',
        price: 24999,
        quantity: 1,
        thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'
      }
    ],
    subtotal: 24999,
    discount: 2500,
    deliveryFee: 0,
    total: 22499,
    paymentMethod: 'UPI (Google Pay)',
    address: {
      name: 'Selva Kumar',
      street: 'Penthouse 42B, Oberoi Sky City, Western Heights',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400066'
    },
    status: 'Out for Delivery',
    trackingNumber: 'NOV-EXP-99201948',
    carrier: 'NOVA Lightning Fleet',
    estimatedDelivery: 'Today by 5:30 PM',
    trackingSteps: [
      { status: 'Confirmed', date: 'Oct 06, 10:15 AM', completed: true, desc: 'Payment verified and order confirmed by NOVA Vault.' },
      { status: 'Packed', date: 'Oct 06, 11:30 AM', completed: true, desc: 'Hand-inspected & luxury gift packaged at BKC Distribution Center.' },
      { status: 'Shipped', date: 'Oct 07, 08:00 AM', completed: true, desc: 'Dispatched in climate-controlled express vehicle.' },
      { status: 'Out for Delivery', date: 'Today, 01:20 PM', completed: true, desc: 'Delivery partner Rahul Verma is on the way (Vehicle #MH-02-EL-4820).' },
      { status: 'Delivered', date: 'Pending', completed: false, desc: 'Recipient signature verification required upon arrival.' }
    ]
  },
  {
    id: 'NOV-773190',
    date: '2026-09-28',
    items: [
      {
        id: 105,
        title: 'Maison De Nuit 24K Gold Botanical Elixir & Fragrance',
        brand: 'Maison De Nuit',
        price: 12499,
        quantity: 1,
        thumbnail: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80'
      }
    ],
    subtotal: 12499,
    discount: 1875,
    deliveryFee: 0,
    total: 10624,
    paymentMethod: 'Credit Card (Visa Signature)',
    address: {
      name: 'Selva Kumar',
      street: 'Penthouse 42B, Oberoi Sky City, Western Heights',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400066'
    },
    status: 'Delivered',
    trackingNumber: 'NOV-EXP-88194012',
    carrier: 'NOVA Express',
    estimatedDelivery: 'Delivered on Sep 30, 2026',
    trackingSteps: [
      { status: 'Confirmed', date: 'Sep 28, 09:00 AM', completed: true, desc: 'Order verified.' },
      { status: 'Packed', date: 'Sep 28, 11:00 AM', completed: true, desc: 'Luxury boxed.' },
      { status: 'Shipped', date: 'Sep 29, 07:30 AM', completed: true, desc: 'In transit.' },
      { status: 'Out for Delivery', date: 'Sep 30, 10:00 AM', completed: true, desc: 'Out for delivery.' },
      { status: 'Delivered', date: 'Sep 30, 02:45 PM', completed: true, desc: 'Delivered to resident.' }
    ]
  }
];

export const OrdersProvider = ({ children }) => {
  const { addToast } = useToast();
  const { user } = useAuth();

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('nova_orders_v2');
      return saved ? JSON.parse(saved) : INITIAL_DEMO_ORDERS;
    } catch {
      return INITIAL_DEMO_ORDERS;
    }
  });

  const [returns, setReturns] = useState(() => {
    try {
      const saved = localStorage.getItem('nova_returns');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('nova_orders_v2', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('nova_returns', JSON.stringify(returns));
  }, [returns]);

  const placeOrder = (orderData) => {
    const orderId = 'NOV-' + Math.floor(100000 + Math.random() * 900000);
    const trackingNo = 'NOV-EXP-' + Math.floor(10000000 + Math.random() * 90000000);
    const todayStr = new Date().toISOString().split('T')[0];

    const newOrder = {
      id: orderId,
      date: todayStr,
      items: orderData.items,
      subtotal: orderData.subtotal,
      discount: orderData.discount || 0,
      deliveryFee: orderData.deliveryFee || 0,
      total: orderData.total,
      paymentMethod: orderData.paymentMethod || 'UPI / QR Code',
      address: orderData.address,
      status: 'Confirmed',
      trackingNumber: trackingNo,
      carrier: 'NOVA Express Fleet',
      estimatedDelivery: 'Tomorrow by 2:00 PM',
      trackingSteps: [
        { status: 'Confirmed', date: 'Just Now', completed: true, desc: 'Order placed & payment verified successfully.' },
        { status: 'Packed', date: 'Expected within 2 hours', completed: false, desc: 'Dispatched to cleanroom packing station.' },
        { status: 'Shipped', date: 'Expected Tomorrow morning', completed: false, desc: 'Handoff to express linehaul courier.' },
        { status: 'Out for Delivery', date: 'Pending', completed: false, desc: 'Courier route optimization active.' },
        { status: 'Delivered', date: 'Pending', completed: false, desc: 'Handover and verified recipient signature.' }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);

    // Send a copy to the shop owner's server so the admin dashboard can see it.
    // If the server is offline the customer's order still works normally.
    try {
      fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newOrder,
          customer: { name: user?.name, email: user?.email, phone: user?.phone }
        })
      }).catch(() => {});
    } catch {
      /* ignore */
    }
    return newOrder;
  };

  // When the owner updates an order in the admin dashboard (Packed, Shipped, Delivered...),
  // the customer sees the new status and tracking progress here.
  useEffect(() => {
    const FLOW = ['Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
    const sync = async () => {
      try {
        const res = await fetch(`${API_URL}/api/orders`);
        if (!res.ok) return;
        const server = await res.json();
        setOrders(prev => {
          let changed = false;
          const next = prev.map(o => {
            const s = server.find(x => x.id === o.id);
            if (!s || s.status === o.status) return o;
            changed = true;
            const idx = FLOW.indexOf(s.status);
            return {
              ...o,
              status: s.status,
              cancelReason: s.cancelReason || o.cancelReason,
              trackingSteps: idx >= 0 && o.trackingSteps
                ? o.trackingSteps.map((st, i) => ({
                    ...st,
                    completed: i <= idx,
                    date: i <= idx && !st.completed ? 'Updated just now' : st.date
                  }))
                : o.trackingSteps
            };
          });
          return changed ? next : prev;
        });
      } catch {
        /* server offline */
      }
    };
    sync();
    const id = setInterval(sync, 8000);
    return () => clearInterval(id);
  }, []);

  const cancelOrder = (orderId, reason = 'Changed my mind') => {
    setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status: 'Cancelled', cancelReason: reason } : o)));
    try {
      fetch(`${API_URL}/api/orders/${encodeURIComponent(orderId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Cancelled',
          reason,
          user: { name: user?.name, email: user?.email, phone: user?.phone }
        })
      }).catch(() => {});
    } catch {
      /* ignore */
    }
    addToast('Your order has been cancelled', 'info');
  };

  const getOrderById = (id) => {
    return orders.find(o => o.id === id);
  };

  const createReturnRequest = (orderId, productId, reason, refundMethod) => {
    const order = getOrderById(orderId);
    const product = order?.items?.find(i => i.id === productId) || order?.items?.[0];

    const returnId = 'RET-' + Math.floor(10000 + Math.random() * 90000);
    const newReturn = {
      id: returnId,
      orderId,
      productTitle: product ? product.title : 'Luxury Item',
      productThumbnail: product?.thumbnail,
      price: product ? product.price : order?.total,
      reason,
      refundMethod,
      createdAt: new Date().toLocaleDateString(),
      status: 'Requested',
      pickupDate: 'Estimated Pickup: in 48 Hours',
      timeline: [
        { title: 'Return Requested', date: 'Today', done: true },
        { title: 'Return Approved', date: 'Pending', done: false },
        { title: 'Pickup Scheduled', date: 'Pending', done: false },
        { title: 'Item Inspected', date: 'Pending', done: false },
        { title: 'Refund Dispatched', date: 'Pending', done: false }
      ]
    };

    setReturns(prev => [newReturn, ...prev]);
    track('return_requested', user, { orderId, reason, product: newReturn.productTitle });
    addToast('Return request submitted successfully!', 'success');
    return newReturn;
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        returns,
        placeOrder,
        cancelOrder,
        getOrderById,
        createReturnRequest
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within OrdersProvider');
  }
  return context;
};
