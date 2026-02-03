/**
 * Empty - Empty state component for displaying meaningful messages
 * Used when there's no data to show or an error occurred
 */

import { memo, forwardRef, type ReactNode, type CSSProperties } from 'react';
import { cn } from '../../utils/cn';
import { emptyPresets, type EmptyPresetType } from './presets';

/**
 * Empty state action button configuration
 */
export interface IEmptyAction {
  /** Button label text */
  label: string;
  /** Click handler */
  onClick: () => void;
  /** Button style variant */
  variant?: 'primary' | 'secondary' | 'link';
  /** Optional icon before label */
  icon?: ReactNode;
}

/**
 * Empty state size variants
 */
export type EmptySize = 'sm' | 'md' | 'lg';

/**
 * Props for the Empty component
 */
export interface IEmptyProps {
  /** Preset type for default icon, title, description */
  type?: EmptyPresetType | 'custom';
  /** Custom title (overrides preset) */
  title?: string;
  /** Custom description (overrides preset) */
  description?: string;
  /** Custom icon (overrides preset) */
  icon?: ReactNode;
  /** Hide the icon */
  hideIcon?: boolean;
  /** Action button(s) */
  action?: IEmptyAction | IEmptyAction[];
  /** Size variant */
  size?: EmptySize;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
  /** Custom children content */
  children?: ReactNode;
  /** Test ID for testing */
  testId?: string;
}

/**
 * Size configurations for padding and text
 */
const sizeConfig: Record<EmptySize, { padding: string; iconSize: string; titleSize: string; descSize: string }> = {
  sm: {
    padding: 'py-8',
    iconSize: 'w-12 h-12',
    titleSize: 'text-base',
    descSize: 'text-sm',
  },
  md: {
    padding: 'py-12',
    iconSize: 'w-16 h-16',
    titleSize: 'text-lg',
    descSize: 'text-base',
  },
  lg: {
    padding: 'py-16',
    iconSize: 'w-20 h-20',
    titleSize: 'text-xl',
    descSize: 'text-base',
  },
};

/**
 * Button variant styles
 */
const buttonVariants: Record<NonNullable<IEmptyAction['variant']>, string> = {
  primary:
    'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  secondary:
    'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600',
  link: 'text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400',
};

/**
 * Action buttons component
 */
function ActionButtons({ actions, size }: { actions: IEmptyAction | IEmptyAction[]; size: EmptySize }) {
  const actionList = Array.isArray(actions) ? actions : [actions];
  const isSmall = size === 'sm';

  return (
    <div className={cn('flex flex-wrap gap-3 justify-center', isSmall ? 'mt-4' : 'mt-6')}>
      {actionList.map((action, index) => {
        const variant = action.variant ?? 'primary';
        const isLink = variant === 'link';

        return (
          <button
            key={index}
            type="button"
            onClick={action.onClick}
            className={cn(
              'inline-flex items-center justify-center gap-2 font-medium transition-colors',
              isLink ? '' : 'px-4 py-2 rounded-md',
              isSmall && !isLink && 'text-sm px-3 py-1.5',
              buttonVariants[variant]
            )}
          >
            {action.icon && <span className="flex-shrink-0">{action.icon}</span>}
            {action.label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Empty component
 * Displays an empty state with icon, title, description and action buttons
 *
 * @example
 * ```tsx
 * // Basic preset usage
 * <Empty type="no-data" />
 *
 * // With custom content
 * <Empty
 *   type="no-data"
 *   title="No orders yet"
 *   description="Start shopping to see your orders here"
 *   action={{ label: 'Start Shopping', onClick: goToShop }}
 * />
 *
 * // Multiple actions
 * <Empty
 *   type="error"
 *   action={[
 *     { label: 'Retry', onClick: retry, variant: 'primary' },
 *     { label: 'Go Back', onClick: goBack, variant: 'secondary' },
 *   ]}
 * />
 * ```
 */
export const Empty = memo(
  forwardRef<HTMLDivElement, IEmptyProps>(function Empty(props, ref) {
    const {
      type = 'no-data',
      title,
      description,
      icon,
      hideIcon = false,
      action,
      size = 'md',
      className,
      style,
      children,
      testId,
    } = props;

    // Get preset configuration if not custom
    const preset = type !== 'custom' ? emptyPresets[type] : null;

    // Determine what to display
    const displayIcon = icon ?? preset?.icon;
    const displayTitle = title ?? preset?.title;
    const displayDescription = description ?? preset?.description;

    // Get size configuration
    const sizes = sizeConfig[size];

    return (
      <div
        ref={ref}
        role="status"
        className={cn(
          'flex flex-col items-center justify-center text-center',
          sizes.padding,
          className
        )}
        style={style}
        data-testid={testId}
        data-empty-type={type}
      >
        {/* Icon */}
        {!hideIcon && displayIcon && (
          <div
            className={cn(
              'text-gray-400 dark:text-gray-500 mb-4',
              sizes.iconSize,
              '[&>svg]:w-full [&>svg]:h-full'
            )}
            data-testid={testId ? `${testId}-icon` : undefined}
          >
            {displayIcon}
          </div>
        )}

        {/* Title */}
        {displayTitle && (
          <h3
            className={cn(
              'font-semibold text-gray-900 dark:text-gray-100 mb-2',
              sizes.titleSize
            )}
            data-testid={testId ? `${testId}-title` : undefined}
          >
            {displayTitle}
          </h3>
        )}

        {/* Description */}
        {displayDescription && (
          <p
            className={cn(
              'text-gray-500 dark:text-gray-400 max-w-md',
              sizes.descSize
            )}
            data-testid={testId ? `${testId}-description` : undefined}
          >
            {displayDescription}
          </p>
        )}

        {/* Custom children */}
        {children}

        {/* Action buttons */}
        {action && <ActionButtons actions={action} size={size} />}
      </div>
    );
  })
);

Empty.displayName = 'Empty';
