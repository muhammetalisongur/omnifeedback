/**
 * Drawer component - Slide-out panel from screen edges
 * Supports 4 positions (left, right, top, bottom) and 5 sizes (sm, md, lg, xl, full)
 */

import {
  memo,
  forwardRef,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import type React from 'react';
import { cn } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import type {
  FeedbackStatus,
  DrawerPosition,
  DrawerSize,
} from '../../core/types';

/**
 * Drawer component props
 */
export interface IDrawerProps {
  /** Drawer title */
  title?: React.ReactNode;
  /** Drawer content (required) */
  content: React.ReactNode;
  /** Drawer position */
  position?: DrawerPosition;
  /** Drawer size preset */
  size?: DrawerSize;
  /** Custom width/height (overrides size) */
  customSize?: string | number;
  /** Show overlay backdrop */
  overlay?: boolean;
  /** Overlay opacity (0-1) */
  overlayOpacity?: number;
  /** Close when clicking overlay */
  closeOnOverlayClick?: boolean;
  /** Close when pressing ESC */
  closeOnEscape?: boolean;
  /** Show close button */
  closable?: boolean;
  /** Footer content */
  footer?: React.ReactNode;
  /** Prevent body scroll */
  preventScroll?: boolean;
  /** Push main content instead of overlay */
  push?: boolean;
  /** Current animation status */
  status: FeedbackStatus;
  /** Callback when close requested */
  onRequestClose: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Test ID for testing */
  testId?: string;
}

/**
 * Horizontal drawer sizes (left/right)
 */
const horizontalSizes: Record<DrawerSize, string> = {
  sm: 'w-[280px]',
  md: 'w-[400px]',
  lg: 'w-[600px]',
  xl: 'w-[800px]',
  full: 'w-full',
};

/**
 * Vertical drawer sizes (top/bottom)
 */
const verticalSizes: Record<DrawerSize, string> = {
  sm: 'h-[200px]',
  md: 'h-[300px]',
  lg: 'h-[400px]',
  xl: 'h-[500px]',
  full: 'h-full',
};

/**
 * Horizontal drawer pixel sizes for push content transform
 */
const horizontalSizePx: Record<DrawerSize, string> = {
  sm: '280px',
  md: '400px',
  lg: '600px',
  xl: '800px',
  full: '100vw',
};

/**
 * Vertical drawer pixel sizes for push content transform
 */
const verticalSizePx: Record<DrawerSize, string> = {
  sm: '200px',
  md: '300px',
  lg: '400px',
  xl: '500px',
  full: '100vh',
};

/**
 * Position styles
 */
const positionStyles: Record<DrawerPosition, string> = {
  left: 'left-0 top-0 h-full',
  right: 'right-0 top-0 h-full',
  top: 'top-0 left-0 w-full',
  bottom: 'bottom-0 left-0 w-full',
};

/**
 * Transform styles for open/closed states
 */
const transformStyles: Record<DrawerPosition, { open: string; closed: string }> = {
  left: { open: 'translate-x-0', closed: '-translate-x-full' },
  right: { open: 'translate-x-0', closed: 'translate-x-full' },
  top: { open: 'translate-y-0', closed: '-translate-y-full' },
  bottom: { open: 'translate-y-0', closed: 'translate-y-full' },
};

/**
 * X Mark Icon for close button
 */
function XMarkIcon({ className }: { className?: string }): React.ReactElement {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

/**
 * Drawer component
 * Slide-out panel for navigation, settings, and detail views
 *
 * @example
 * ```tsx
 * // Settings drawer
 * <Drawer
 *   title="Settings"
 *   position="right"
 *   size="md"
 *   content={<SettingsPanel />}
 *   footer={<Button>Save</Button>}
 *   status="visible"
 *   onRequestClose={handleClose}
 * />
 *
 * // Navigation menu
 * <Drawer
 *   position="left"
 *   size="sm"
 *   content={<NavigationMenu />}
 *   closable={false}
 *   status="visible"
 *   onRequestClose={handleClose}
 * />
 *
 * // Bottom sheet style
 * <Drawer
 *   position="bottom"
 *   size="sm"
 *   content={<ActionsList />}
 *   status="visible"
 *   onRequestClose={handleClose}
 * />
 * ```
 */
export const Drawer = memo(
  forwardRef<HTMLDivElement, IDrawerProps>(function Drawer(props, ref) {
    const {
      title,
      content,
      position = 'right',
      size = 'md',
      customSize,
      overlay = true,
      overlayOpacity = 0.5,
      closeOnOverlayClick = true,
      closeOnEscape = true,
      closable = true,
      footer,
      preventScroll = true,
      push = false,
      status,
      onRequestClose,
      className,
      style,
      testId,
    } = props;

    const drawerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    const isHorizontal = position === 'left' || position === 'right';
    const isExiting = status === 'exiting';

    // Focus trap
    useFocusTrap(contentRef, { enabled: status === 'visible' });

    // Scroll lock
    useScrollLock(preventScroll && (status === 'visible' || status === 'entering'));

    // Handle enter animation
    useEffect(() => {
      if (status === 'entering' || status === 'visible') {
        const raf = requestAnimationFrame(() => {
          setIsVisible(true);
        });
        return () => cancelAnimationFrame(raf);
      }
      return undefined;
    }, [status]);

    // Handle exit animation
    useEffect(() => {
      if (status === 'exiting') {
        setIsVisible(false);
      }
    }, [status]);

    // Push content: apply transform to document.body based on status
    useEffect(() => {
      if (!push) {return undefined;}

      const pushSize = customSize
        ? (typeof customSize === 'number' ? `${String(customSize)}px` : customSize)
        : isHorizontal
          ? horizontalSizePx[size]
          : verticalSizePx[size];

      const pushTransforms: Record<DrawerPosition, string> = {
        left: `translateX(${pushSize})`,
        right: `translateX(-${pushSize})`,
        top: `translateY(${pushSize})`,
        bottom: `translateY(-${pushSize})`,
      };

      const isActive = status === 'entering' || status === 'visible';

      if (isActive) {
        document.body.style.transition = 'transform 300ms ease-out';
        document.body.style.transform = pushTransforms[position];
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.transition = 'transform 300ms ease-out';
        document.body.style.transform = '';
      }

      return () => {
        document.body.style.transition = '';
        document.body.style.transform = '';
        document.body.style.overflow = '';
      };
    }, [push, status, position, size, customSize, isHorizontal]);

    // ESC key handler
    useEffect(() => {
      if (!closeOnEscape) {return undefined;}

      const handleKeyDown = (e: KeyboardEvent): void => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onRequestClose();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [closeOnEscape, onRequestClose]);

    // Overlay click handler
    const handleOverlayClick = useCallback(
      (e: React.MouseEvent) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
          onRequestClose();
        }
      },
      [closeOnOverlayClick, onRequestClose]
    );

    // Determine size class
    const sizeClass = customSize
      ? ''
      : isHorizontal
        ? horizontalSizes[size]
        : verticalSizes[size];

    // Determine custom size style
    const sizeStyle: React.CSSProperties = customSize
      ? isHorizontal
        ? { width: typeof customSize === 'number' ? `${String(customSize)}px` : customSize }
        : { height: typeof customSize === 'number' ? `${String(customSize)}px` : customSize }
      : {};

    return (
      <div
        ref={ref}
        data-testid={testId}
        data-status={status}
        data-position={position}
        data-size={size}
        className={cn('fixed inset-0 z-50', push && 'pointer-events-none')}
        style={style}
      >
        {/* Overlay Backdrop - hidden in push mode */}
        {overlay && !push && (
          <div
            data-testid={testId ? `${testId}-overlay` : undefined}
            className={cn(
              'absolute inset-0 bg-black transition-opacity duration-300',
              isVisible && !isExiting
                ? 'opacity-100'
                : 'opacity-0 pointer-events-none'
            )}
            style={{
              opacity: isVisible && !isExiting ? overlayOpacity : 0,
            }}
            onClick={handleOverlayClick}
            aria-hidden="true"
          />
        )}

        {/* Drawer Panel */}
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title && testId ? `${testId}-title` : undefined}
          data-testid={testId ? `${testId}-panel` : undefined}
          className={cn(
            'fixed bg-white dark:bg-gray-900 shadow-xl pointer-events-auto',
            'flex flex-col',
            'transition-transform duration-300 ease-out',
            positionStyles[position],
            sizeClass,
            isVisible && !isExiting
              ? transformStyles[position].open
              : transformStyles[position].closed,
            className
          )}
          style={sizeStyle}
        >
          {/* Header */}
          {(title ?? closable) && (
            <div
              className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700"
              data-testid={testId ? `${testId}-header` : undefined}
            >
              {title && (
                <h2
                  id={testId ? `${testId}-title` : undefined}
                  className="text-lg font-semibold text-gray-900 dark:text-gray-100"
                  data-testid={testId ? `${testId}-title-text` : undefined}
                >
                  {title}
                </h2>
              )}
              {!title && <div />}
              {closable && (
                <button
                  type="button"
                  onClick={onRequestClose}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
                  aria-label="Close drawer"
                  data-testid={testId ? `${testId}-close` : undefined}
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div
            ref={contentRef}
            className="flex-1 overflow-y-auto p-4"
            data-testid={testId ? `${testId}-content` : undefined}
          >
            {content}
          </div>

          {/* Footer */}
          {footer && (
            <div
              className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
              data-testid={testId ? `${testId}-footer` : undefined}
            >
              {footer}
            </div>
          )}
        </div>
      </div>
    );
  })
);

Drawer.displayName = 'Drawer';
