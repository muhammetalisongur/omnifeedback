/**
 * Banner component - Full-width announcement bar
 * Supports top/bottom positioning, multiple variants, and action buttons
 */

import { memo, forwardRef, useState, useEffect } from 'react';
import type React from 'react';
import { cn } from '../../utils/cn';
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  MegaphoneIcon,
  XMarkIcon,
} from './icons';
import type { FeedbackStatus, BannerVariant, IBannerAction } from '../../core/types';

/**
 * Banner component props
 */
export interface IBannerProps {
  /** Banner message (required) */
  message: string;
  /** Banner title */
  title?: string;
  /** Visual variant */
  variant?: BannerVariant;
  /** Banner position */
  position?: 'top' | 'bottom';
  /** Sticky positioning */
  sticky?: boolean;
  /** Show close button */
  dismissible?: boolean;
  /** Custom icon */
  icon?: React.ReactNode;
  /** Hide default icon */
  hideIcon?: boolean;
  /** Action buttons */
  actions?: IBannerAction[];
  /** Full width banner */
  fullWidth?: boolean;
  /** Center content */
  centered?: boolean;
  /** Current animation status */
  status: FeedbackStatus;
  /** Callback when dismiss clicked */
  onRequestDismiss: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Test ID for testing */
  testId?: string;
}

/**
 * Variant-specific styles
 */
const variantStyles: Record<BannerVariant, { bg: string; text: string; border: string }> = {
  default: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200',
  },
  info: {
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-200',
  },
  success: {
    bg: 'bg-green-50',
    text: 'text-green-800',
    border: 'border-green-200',
  },
  warning: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
  },
  error: {
    bg: 'bg-red-50',
    text: 'text-red-800',
    border: 'border-red-200',
  },
  announcement: {
    bg: 'bg-gradient-to-r from-purple-600 to-blue-600',
    text: 'text-white',
    border: 'border-transparent',
  },
};

/**
 * Default icons for each variant
 */
const defaultIcons: Record<BannerVariant, React.ReactNode> = {
  default: <InformationCircleIcon className="w-5 h-5" />,
  info: <InformationCircleIcon className="w-5 h-5" />,
  success: <CheckCircleIcon className="w-5 h-5" />,
  warning: <ExclamationTriangleIcon className="w-5 h-5" />,
  error: <XCircleIcon className="w-5 h-5" />,
  announcement: <MegaphoneIcon className="w-5 h-5" />,
};

/**
 * Banner component
 * Full-width announcement bar for page-level messages
 *
 * @example
 * ```tsx
 * // Cookie consent banner
 * <Banner
 *   message="This site uses cookies."
 *   variant="info"
 *   position="bottom"
 *   actions={[
 *     { label: 'Accept', onClick: handleAccept, variant: 'primary' },
 *     { label: 'Settings', onClick: openSettings, variant: 'secondary' },
 *   ]}
 *   status="visible"
 *   onRequestDismiss={handleDismiss}
 * />
 *
 * // Maintenance warning
 * <Banner
 *   message="Scheduled maintenance: 10 PM - 2 AM"
 *   variant="warning"
 *   position="top"
 *   dismissible={false}
 *   status="visible"
 *   onRequestDismiss={() => {}}
 * />
 * ```
 */
export const Banner = memo(
  forwardRef<HTMLDivElement, IBannerProps>(function Banner(props, ref) {
    const {
      message,
      title,
      variant = 'default',
      position = 'top',
      sticky = true,
      dismissible = true,
      icon,
      hideIcon = false,
      actions,
      fullWidth = true,
      centered = true,
      status,
      onRequestDismiss,
      className,
      style,
      testId,
    } = props;

    const [isVisible, setIsVisible] = useState(false);

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

    const styles = variantStyles[variant];
    const displayIcon = hideIcon ? null : (icon ?? defaultIcons[variant]);
    const isAnnouncement = variant === 'announcement';

    return (
      <div
        ref={ref}
        role="banner"
        aria-live="polite"
        data-testid={testId}
        data-status={status}
        data-variant={variant}
        data-position={position}
        className={cn(
          'w-full border-b',
          styles.bg,
          styles.text,
          styles.border,
          sticky && 'sticky z-50',
          position === 'top' ? 'top-0' : 'bottom-0',
          // Animation
          'transition-all duration-300 ease-out',
          isVisible
            ? 'opacity-100 translate-y-0'
            : position === 'top'
              ? 'opacity-0 -translate-y-full'
              : 'opacity-0 translate-y-full',
          className
        )}
        style={style}
      >
        <div
          className={cn(
            'flex items-center gap-3 px-4 py-3',
            fullWidth ? 'w-full' : 'max-w-7xl mx-auto',
            centered && 'justify-center'
          )}
          data-testid={testId ? `${testId}-content` : undefined}
        >
          {/* Icon */}
          {displayIcon && (
            <span
              className="flex-shrink-0"
              data-testid={testId ? `${testId}-icon` : undefined}
            >
              {displayIcon}
            </span>
          )}

          {/* Content */}
          <div
            className={cn('flex-1', centered && 'text-center')}
            data-testid={testId ? `${testId}-text` : undefined}
          >
            {title && (
              <span
                className="font-semibold mr-2"
                data-testid={testId ? `${testId}-title` : undefined}
              >
                {title}
              </span>
            )}
            <span
              className="text-sm"
              data-testid={testId ? `${testId}-message` : undefined}
            >
              {message}
            </span>
          </div>

          {/* Actions */}
          {actions && actions.length > 0 && (
            <div
              className="flex items-center gap-2 flex-shrink-0"
              data-testid={testId ? `${testId}-actions` : undefined}
            >
              {actions.map((action, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={action.onClick}
                  className={cn(
                    'text-sm font-medium px-3 py-1 rounded transition-colors',
                    action.variant === 'primary' && isAnnouncement &&
                      'bg-white/20 hover:bg-white/30 text-current',
                    action.variant === 'primary' && !isAnnouncement &&
                      'bg-current/10 hover:bg-current/20',
                    action.variant === 'secondary' &&
                      'border border-current/30 hover:bg-current/10',
                    (!action.variant || action.variant === 'link') &&
                      'underline hover:no-underline'
                  )}
                  data-testid={testId ? `${testId}-action-${index}` : undefined}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Dismiss Button */}
          {dismissible && (
            <button
              type="button"
              onClick={onRequestDismiss}
              className={cn(
                'flex-shrink-0 p-1 rounded transition-colors',
                isAnnouncement
                  ? 'hover:bg-white/20'
                  : 'hover:bg-black/10'
              )}
              aria-label="Dismiss banner"
              data-testid={testId ? `${testId}-dismiss` : undefined}
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  })
);

Banner.displayName = 'Banner';
