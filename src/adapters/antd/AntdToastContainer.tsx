/**
 * AntdToastContainer - Container for positioning Ant Design style toasts
 * Implements Ant Design notification positioning system
 */

import { memo } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterToastContainerProps } from '../types';

/**
 * Position styles for toast container following Ant Design placement
 */
const positionStyles = {
  'top-left': 'top-6 left-6',
  'top-center': 'top-6 left-1/2 -translate-x-1/2',
  'top-right': 'top-6 right-6',
  'bottom-left': 'bottom-6 left-6',
  'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-6 right-6',
};

/**
 * AntdToastContainer component
 * Positions and stacks toast notifications with Ant Design spacing
 */
export const AntdToastContainer = memo(function AntdToastContainer({
  position,
  gap,
  children,
}: IAdapterToastContainerProps) {
  return (
    <div
      className={cn(
        'of-antd-toast-container',
        'fixed z-[1010] flex flex-col p-0 pointer-events-none',
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

AntdToastContainer.displayName = 'AntdToastContainer';
