import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Package Out for Delivery 🚚',
    message: 'Your Nova Horizon Pro ANC Headphones order (#NOV-849201) is out for delivery with Rahul Verma.',
    time: '20 mins ago',
    type: 'order',
    isRead: false,
    link: '/orders'
  },
  {
    id: 'notif-2',
    title: 'Price Drop Alert 🔥',
    message: 'Apex Celestial Titanium Watch in your wishlist dropped by ₹1,500! Limited units available.',
    time: '2 hours ago',
    type: 'price_drop',
    isRead: false,
    link: '/wishlist'
  },
  {
    id: 'notif-3',
    title: 'Flash Sale Live ⚡',
    message: 'Up to 30% OFF on Flagship OLEDs and Luxury Horology for the next 4 hours.',
    time: '5 hours ago',
    type: 'promo',
    isRead: true,
    link: '/shop'
  },
  {
    id: 'notif-4',
    title: 'NOVA+ Points Credited ⭐',
    message: '250 Reward points added to your account for your recent shopping spree.',
    time: '1 day ago',
    type: 'reward',
    isRead: true,
    link: '/profile'
  }
];

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('nova_notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  useEffect(() => {
    localStorage.setItem('nova_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        markAsRead,
        markAllAsRead,
        unreadCount
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};
