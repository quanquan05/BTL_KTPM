import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

export const CountdownTimer = ({ endTime, onExpire, isCompact = false }) => {
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, Math.floor((endTime - Date.now()) / 1000)));

  useEffect(() => {
    const updateTime = () => {
      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0 && onExpire) {
        onExpire();
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [endTime, onExpire]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const pad = (n) => String(n).padStart(2, '0');

  if (timeLeft === 0) {
    return (
      <span
        id="timer-expired-badge"
        data-testid="timer-expired"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '5px 10px',
          borderRadius: 6,
          background: 'var(--accent-red-bg)',
          color: '#DC2626',
          border: '1px solid var(--accent-red-border)',
          fontWeight: 600,
          fontSize: isCompact ? '0.82rem' : '0.92rem'
        }}
      >
        <AlertTriangle size={15} /> Đã hết hạn thuê
      </span>
    );
  }

  const isUrgent = timeLeft < 900; // Dưới 15 phút
  const isCritical = timeLeft < 300; // Dưới 5 phút

  const timerColor = isCritical ? '#DC2626' : isUrgent ? '#D97706' : 'var(--primary)';
  const bgColor = isCritical
    ? 'var(--accent-red-bg)'
    : isUrgent
    ? 'var(--accent-amber-bg)'
    : 'var(--primary-light)';
  const borderColor = isCritical
    ? 'var(--accent-red-border)'
    : isUrgent
    ? 'var(--accent-amber-border)'
    : 'var(--border-active)';

  return (
    <div
      id="live-countdown-timer"
      data-testid="live-countdown-timer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: isCompact ? '3px 8px' : '6px 12px',
        borderRadius: 8,
        background: bgColor,
        color: timerColor,
        border: `1px solid ${borderColor}`,
        fontFamily: 'monospace',
        fontWeight: 700,
        fontSize: isCompact ? '0.9rem' : '1.15rem',
        letterSpacing: '0.5px'
      }}
    >
      <Clock size={isCompact ? 14 : 18} />
      <span>
        {pad(hours)}:{pad(minutes)}:{pad(seconds)}
      </span>
      {isCritical && (
        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#DC2626', marginLeft: 4 }}>
          (Sắp hết hạn!)
        </span>
      )}
    </div>
  );
};
