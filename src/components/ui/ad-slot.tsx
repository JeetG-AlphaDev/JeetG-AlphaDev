import { cn } from '@/utils';
import type { AdSlot } from '@/types';

interface AdSlotProps {
  position: AdSlot['position'];
  size?: string;
  className?: string;
}

export function AdSlot({ position, size = 'medium', className }: AdSlotProps) {
  const sizeClasses = {
    small: 'h-24 w-full',
    medium: 'h-32 w-full',
    large: 'h-48 w-full',
    banner: 'h-20 w-full',
    sidebar: 'h-96 w-full',
  };

  const positionLabels = {
    header: 'Header Ad',
    sidebar: 'Sponsored Content',
    content: 'Advertisement',
    footer: 'Footer Ad',
  };

  return (
    <div
      className={cn(
        'flex items-center justify-center bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md',
        sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.medium,
        className
      )}
    >
      <div className="text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          {positionLabels[position]}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          {size} • {position}
        </p>
      </div>
    </div>
  );
}

// Helper component for responsive ad placements
export function ResponsiveAdSlot({ position, className }: Omit<AdSlotProps, 'size'>) {
  return (
    <div className={cn('w-full', className)}>
      {/* Mobile ad */}
      <div className="block sm:hidden">
        <AdSlot position={position} size="banner" />
      </div>
      
      {/* Tablet ad */}
      <div className="hidden sm:block lg:hidden">
        <AdSlot position={position} size="medium" />
      </div>
      
      {/* Desktop ad */}
      <div className="hidden lg:block">
        <AdSlot 
          position={position} 
          size={position === 'sidebar' ? 'sidebar' : 'large'} 
        />
      </div>
    </div>
  );
}