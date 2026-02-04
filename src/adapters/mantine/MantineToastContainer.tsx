/**
 * MantineToastContainer - Container for positioning toasts
 * Styled with Mantine design patterns
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
 * MantineToastContainer component
 * Positions and stacks toast notifications
 */
export const MantineToastContainer = memo(function MantineToastContainer({
  position,
  gap,
  children,
}: IAdapterToastContainerProps): JSX.Element {
  return (
    <div
      className={cn(
        'fixed z-[var(--mantine-z-index-overlay)] flex flex-col p-4 pointer-events-none',
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

MantineToastContainer.displayName = 'MantineToastContainer';
