/**
 * ShadcnResult - shadcn/ui adapter result page component
 */

import { memo, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterResultProps, ResultStatus } from '../types';

/**
 * Default icons
 */
const defaultIcons: Record<ResultStatus, React.ReactNode> = {
  success: (
    <svg
      className="h-16 w-16 text-green-500"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  error: (
    <svg
      className="h-16 w-16 text-destructive"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  info: (
    <svg
      className="h-16 w-16 text-blue-500"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  warning: (
    <svg
      className="h-16 w-16 text-yellow-500"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  ),
  '404': <div className="text-6xl font-bold text-muted-foreground">404</div>,
  '403': <div className="text-6xl font-bold text-muted-foreground">403</div>,
  '500': <div className="text-6xl font-bold text-muted-foreground">500</div>,
};

/**
 * ShadcnResult component
 */
export const ShadcnResult = memo(
  forwardRef<HTMLDivElement, IAdapterResultProps>(function ShadcnResult(props, ref) {
    const {
      resultStatus,
      title,
      subtitle,
      icon,
      extra,
      actions,
      status,
      className,
      style,
      testId,
    } = props;

    const isVisible = status === 'visible' || status === 'entering';
    const displayIcon = icon ?? defaultIcons[resultStatus];

    return (
      <div
        ref={ref}
        role="status"
        data-testid={testId}
        className={cn(
          'flex flex-col items-center justify-center py-12 px-4 text-center',
          'transition-opacity duration-200',
          isVisible ? 'opacity-100' : 'opacity-0',
          className
        )}
        style={style}
      >
        {displayIcon && <div className="mb-6">{displayIcon}</div>}

        <h2 className="text-xl font-semibold mb-2">{title}</h2>

        {subtitle && (
          <p className="text-muted-foreground max-w-md mb-6">{subtitle}</p>
        )}

        {extra && <div className="mb-6">{extra}</div>}

        {actions && actions.length > 0 && (
          <div className="flex flex-wrap gap-3 justify-center">
            {actions.map((action, index) => (
              <button
                key={index}
                type="button"
                onClick={action.onClick}
                className={cn(
                  'inline-flex items-center justify-center rounded-md text-sm font-medium',
                  'ring-offset-background transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  'disabled:pointer-events-none disabled:opacity-50',
                  'h-10 px-4 py-2',
                  action.variant === 'primary' &&
                    'bg-primary text-primary-foreground hover:bg-primary/90',
                  action.variant === 'secondary' &&
                    'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                  action.variant === 'danger' &&
                    'bg-destructive text-destructive-foreground hover:bg-destructive/90',
                  action.variant === 'link' &&
                    'text-primary underline-offset-4 hover:underline',
                  !action.variant &&
                    'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                )}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  })
);

ShadcnResult.displayName = 'ShadcnResult';
