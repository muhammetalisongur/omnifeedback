/**
 * ChakraToastContainer - Container for positioning toasts
 * Chakra UI-specific styling implementation
 */

import { memo } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterToastContainerProps } from '../types';

/**
 * Position styles for toast container (Chakra UI positioning)
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
 * ChakraToastContainer component
 * Positions and stacks toast notifications with Chakra UI styling
 */
export const ChakraToastContainer = memo(function ChakraToastContainer({
  position,
  gap,
  children,
}: IAdapterToastContainerProps): JSX.Element {
  return (
    <div
      className={cn(
        'chakra-toast-container',
        'fixed z-50 flex flex-col p-4 pointer-events-none',
        positionStyles[position],
        position.includes('bottom') && 'flex-col-reverse'
      )}
      style={{ gap: `${String(gap)}px` }}
      aria-live="polite"
      aria-label="Notifications"
    >
      {children}
    </div>
  );
});

ChakraToastContainer.displayName = 'ChakraToastContainer';
