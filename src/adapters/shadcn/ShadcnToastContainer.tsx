/**
 * ShadcnToastContainer - Container for positioning toasts with shadcn styling
 */

import { memo } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterToastContainerProps } from '../types';

/**
 * Position styles for toast container
 */
const positionStyles = {
  'top-left': 'top-0 left-0',
  'top-center': 'top-0 left-1/2 -translate-x-1/2',
  'top-right': 'top-0 right-0',
  'bottom-left': 'bottom-0 left-0',
  'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-0 right-0',
};

/**
 * ShadcnToastContainer component
 */
export const ShadcnToastContainer = memo(function ShadcnToastContainer({
  position,
  gap,
  children,
}: IAdapterToastContainerProps) {
  return (
    <div
      className={cn(
        'fixed z-[100] flex max-h-screen w-full flex-col-reverse p-4 pointer-events-none',
        'sm:flex-col md:max-w-[420px]',
        positionStyles[position],
        position.includes('bottom') && 'flex-col-reverse'
      )}
      style={{ gap: `${gap}px` }}
    >
      {children}
    </div>
  );
});

ShadcnToastContainer.displayName = 'ShadcnToastContainer';
