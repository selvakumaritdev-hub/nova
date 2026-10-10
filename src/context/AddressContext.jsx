import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const AddressContext = createContext();

const DEFAULT_ADDRESSES = [
  {
    id: 'addr-1',
    name: 'Selva Kumar',
    type: 'Home',
    street: 'Penthouse 42B, Oberoi Sky City, Western Heights',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400066',
    phone: '+91 93636 38730',
    isDefault: true
  },
  {
    id: 'addr-2',
    name: 'Selva Kumar',
    type: 'Work',
    street: 'NOVA Executive Tower, 18th Floor, BKC Financial Center',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400051',
    phone: '+91 93636 38730',
    isDefault: false
  }
];

export const AddressProvider = ({ children }) => {
  const { addToast } = useToast();

  const [addresses, setAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem('nova_addresses_v2');
      return saved ? JSON.parse(saved) : DEFAULT_ADDRESSES;
    } catch {
      return DEFAULT_ADDRESSES;
    }
  });

  const [selectedAddressId, setSelectedAddressId] = useState(() => {
    const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
    return defaultAddr ? defaultAddr.id : '';
  });

  useEffect(() => {
    localStorage.setItem('nova_addresses_v2', JSON.stringify(addresses));
  }, [addresses]);

  const addAddress = (newAddr) => {
    const item = {
      ...newAddr,
      id: 'addr-' + Date.now(),
      isDefault: addresses.length === 0 || !!newAddr.isDefault
    };

    setAddresses(prev => {
      let updated = [...prev];
      if (item.isDefault) {
        updated = updated.map(a => ({ ...a, isDefault: false }));
      }
      return [...updated, item];
    });

    setSelectedAddressId(item.id);
    addToast('New delivery address added', 'success');
    return item;
  };

  const updateAddress = (id, updatedFields) => {
    setAddresses(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, ...updatedFields };
      }
      if (updatedFields.isDefault) {
        return { ...a, isDefault: false };
      }
      return a;
    }));
    addToast('Address updated successfully', 'success');
  };

  const deleteAddress = (id) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    addToast('Address removed', 'info');
  };

  const setDefaultAddress = (id) => {
    setAddresses(prev => prev.map(a => ({
      ...a,
      isDefault: a.id === id
    })));
    setSelectedAddressId(id);
    addToast('Default address updated', 'info');
  };

  const selectedAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0];

  return (
    <AddressContext.Provider
      value={{
        addresses,
        selectedAddress,
        selectedAddressId,
        setSelectedAddressId,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error('useAddress must be used within AddressProvider');
  }
  return context;
};
