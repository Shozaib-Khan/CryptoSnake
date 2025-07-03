import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { FoodType } from './types';

interface FoodDisplayProps {
  type: FoodType;
}

const foodIconMap: Record<FoodType, string> = {
  BTC: '/btc.ico',
  ETH: '/eth.ico',
  SONIC: '/sonic.ico',
  '1INCH': '/1inch.ico',
  AARNA: '/aarna.ico',
};

export const FoodDisplay = ({ type }: FoodDisplayProps) => {
  const iconSrc = foodIconMap[type];

  if (!iconSrc) {
    // Fallback for any unknown food types
    return <div className="h-full w-full rounded-full bg-accent" />;
  }

  return (
    <div
      className={cn(
        'relative h-full w-full',
        // Add the pulse animation for the special Aarna icon
        type === 'AARNA' && 'animate-pulse'
      )}
    >
      <Image
        src={iconSrc}
        alt={`${type} icon`}
        width={20}
        height={20}
        // This will make the image fill the container while maintaining aspect ratio
        className="h-full w-full object-contain"
      />
    </div>
  );
};
