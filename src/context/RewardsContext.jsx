import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const RewardsContext = createContext();

export const RewardsProvider = ({ children }) => {
  const { addToast } = useToast();

  const [points, setPoints] = useState(() => {
    try {
      const saved = localStorage.getItem('nova_points');
      return saved ? Number(saved) : 2450;
    } catch {
      return 2450;
    }
  });

  const [claimedRewards, setClaimedRewards] = useState(() => {
    try {
      const saved = localStorage.getItem('nova_claimed_rewards');
      return saved ? JSON.parse(saved) : ['WELCOME-BONUS'];
    } catch {
      return ['WELCOME-BONUS'];
    }
  });

  useEffect(() => {
    localStorage.setItem('nova_points', points.toString());
  }, [points]);

  useEffect(() => {
    localStorage.setItem('nova_claimed_rewards', JSON.stringify(claimedRewards));
  }, [claimedRewards]);

  const earnPoints = (amount) => {
    setPoints(prev => prev + amount);
    addToast(`Earned +${amount} NOVA Reward Points!`, 'success');
  };

  const redeemPoints = (cost, rewardTitle) => {
    if (points < cost) {
      addToast(`Insufficient points. You need ${cost} points.`, 'warning');
      return false;
    }
    setPoints(prev => prev - cost);
    setClaimedRewards(prev => [...prev, rewardTitle]);
    addToast(`Redeemed "${rewardTitle}" for ${cost} points!`, 'success');
    return true;
  };

  return (
    <RewardsContext.Provider
      value={{
        points,
        claimedRewards,
        earnPoints,
        redeemPoints
      }}
    >
      {children}
    </RewardsContext.Provider>
  );
};

export const useRewards = () => {
  const context = useContext(RewardsContext);
  if (!context) {
    throw new Error('useRewards must be used within RewardsProvider');
  }
  return context;
};
