'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Direction } from './types';

interface MobileControlsProps {
  onDirectionChange: (direction: Direction) => void;
}

export function MobileControls({ onDirectionChange }: MobileControlsProps) {
  return (
    <div className="mt-4 grid h-48 w-48 grid-cols-3 grid-rows-3 gap-2 md:hidden">
      {/* Empty cells for grid layout */}
      <div />
      <Button
        size="icon"
        variant="outline"
        className="col-start-2 row-start-1"
        onClick={() => onDirectionChange('UP')}
        aria-label="Move snake up"
      >
        <ChevronUp className="h-8 w-8" />
      </Button>
      <div />

      <Button
        size="icon"
        variant="outline"
        className="col-start-1 row-start-2"
        onClick={() => onDirectionChange('LEFT')}
        aria-label="Move snake left"
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>
      {/* Center empty cell */}
      <div />
      <Button
        size="icon"
        variant="outline"
        className="col-start-3 row-start-2"
        onClick={() => onDirectionChange('RIGHT')}
        aria-label="Move snake right"
      >
        <ChevronRight className="h-8 w-8" />
      </Button>
      
      {/* Empty cells for grid layout */}
      <div />
      <Button
        size="icon"
        variant="outline"
        className="col-start-2 row-start-3"
        onClick={() => onDirectionChange('DOWN')}
        aria-label="Move snake down"
      >
        <ChevronDown className="h-8 w-8" />
      </Button>
      <div />
    </div>
  );
}
