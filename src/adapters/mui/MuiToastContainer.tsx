/**
 * MuiToastContainer - Material UI adapter toast container component
 * Container for positioning toasts with MUI-style spacing
 */

import { memo } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterToastContainerProps } from '../types';

/**
 * Position styles for toast container (MUI-style positioning)
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
 * MuiToastContainer component
 * Positions and stacks toast notifications with Material Design spacing
 */
export const MuiToastContainer = memo(function MuiToastContainer({
  position,
  gap,
  children,
}: IAdapterToastContainerProps) {
  return (
    <div
      className={cn(
        // Fixed positioning with MUI-style spacing (24px padding)
        'fixed z-[1400] flex flex-col p-6 pointer-events-none',
        positionStyles[position],
        position.includes('bottom') && 'flex-col-reverse'
      )}
      style={{ gap: `${gap}px` }}
      aria-live="polite"
      aria-label="Notifications"
    >
      {children}
    </div>
  );
});

MuiToastContainer.displayName = 'MuiToastContainer';
