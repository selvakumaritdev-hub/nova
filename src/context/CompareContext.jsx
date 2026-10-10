import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const { addToast } = useToast();

  const [compareList, setCompareList] = useState(() => {
    try {
      const saved = localStorage.getItem('nova_compare');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCompareOpen, setIsCompareOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('nova_compare', JSON.stringify(compareList));
  }, [compareList]);

  const isInCompare = (id) => {
    return compareList.some(item => item.id === Number(id));
  };

  const addToCompare = (product) => {
    if (isInCompare(product.id)) {
      removeFromCompare(product.id);
      return;
    }

    if (compareList.length >= 4) {
      addToast('Maximum 4 products can be compared at once', 'warning');
      return;
    }

    setCompareList(prev => [...prev, product]);
    addToast(`Added "${product.title.slice(0, 25)}..." to Compare`, 'info');
  };

  const removeFromCompare = (id) => {
    setCompareList(prev => prev.filter(item => item.id !== Number(id)));
    addToast('Removed from comparison', 'info');
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        isInCompare,
        addToCompare,
        removeFromCompare,
        clearCompare,
        compareCount: compareList.length,
        isCompareOpen,
        setIsCompareOpen
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within CompareProvider');
  }
  return context;
};
