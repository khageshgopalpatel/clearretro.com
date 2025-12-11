import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="10" y="10" width="140" height="140" rx="20" fill="none" stroke="currentColor" strokeWidth="12"></rect>
    <text x="80" y="115" fill="currentColor" fontSize="90" fontFamily="monospace" fontWeight="bold" textAnchor="middle">CR</text>
  </svg>
);
