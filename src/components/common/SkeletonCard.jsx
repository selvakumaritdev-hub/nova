import React from 'react';

export const SkeletonCard = () => {
  return (
    <div
      className="glass-panel"
      style={{
        padding: '16px',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        className="shimmer-bg"
        style={{
          width: '100%',
          aspectRatio: '1/1',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(255, 255, 255, 0.05)'
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div
          className="shimmer-bg"
          style={{ width: '40%', height: '12px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)' }}
        />
        <div
          className="shimmer-bg"
          style={{ width: '20%', height: '12px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)' }}
        />
      </div>
      <div
        className="shimmer-bg"
        style={{ width: '80%', height: '18px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)' }}
      />
      <div
        className="shimmer-bg"
        style={{ width: '50%', height: '22px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)' }}
      />
      <div
        className="shimmer-bg"
        style={{
          width: '100%',
          height: '40px',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(255, 255, 255, 0.05)',
          marginTop: '6px'
        }}
      />
    </div>
  );
};
