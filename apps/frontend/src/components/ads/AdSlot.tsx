'use client';

import React from 'react';

interface AdSlotProps {
  name: string;
  className?: string;
}

export function AdSlot({ name, className = '' }: AdSlotProps) {
  // In a real implementation, this would fetch ad configuration from the backend
  // and render actual ad code. For now, we'll show a placeholder.
  
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    return (
      <div className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center ${className}`}>
        <div className="text-gray-500 text-sm">
          <div className="font-medium">Ad Slot: {name}</div>
          <div className="text-xs mt-1">AdSense code will be inserted here in production</div>
        </div>
      </div>
    );
  }

  // In production, this would render the actual ad code
  // For now, return null to hide ads in development
  return null;
}