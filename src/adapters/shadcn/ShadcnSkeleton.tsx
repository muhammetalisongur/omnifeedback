/**
 * ShadcnSkeleton - shadcn/ui adapter skeleton component
 */

import { memo, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterSkeletonProps } from '../types';

/**
 * ShadcnSkeleton component
 */
export const ShadcnSkeleton = memo(
  forwardRef<HTMLDivElement, IAdapterSkeletonProps>(function ShadcnSkeleton(props, ref): JSX.Element {
    const {
      shape = 'text',
      width,
      height,
      lines = 1,
      animate = true,
      status,
      className,
      style,
      testId,
    } = props;

    const isVisible = status === 'visible' || status === 'entering';
    const baseClass = cn(
      'bg-muted',
      animate && 'animate-pulse',
      !isVisible && 'opacity-0'
    );

    const widthValue = typeof width === 'number' ? `${String(width)}px` : width;
    const heightValue = typeof height === 'number' ? `${String(height)}px` : height;

    switch (shape) {
      case 'circle':
        return (
          <div
            ref={ref}
            data-testid={testId}
            className={cn(baseClass, 'rounded-full', className)}
            style={{
              width: widthValue ?? '48px',
              height: heightValue ?? '48px',
              ...style,
            }}
            aria-hidden="true"
          />
        );

      case 'rectangle':
        return (
          <div
            ref={ref}
            data-testid={testId}
            className={cn(baseClass, 'rounded-md', className)}
            style={{
              width: widthValue ?? '100%',
              height: heightValue ?? '100px',
              ...style,
            }}
            aria-hidden="true"
          />
        );

      case 'avatar':
        return (
          <div
            ref={ref}
            data-testid={testId}
            className={cn('flex items-center gap-4', className)}
            style={style}
          >
            <div
              className={cn(baseClass, 'h-12 w-12 rounded-full')}
              aria-hidden="true"
            />
            <div className="space-y-2">
              <div
                className={cn(baseClass, 'h-4 w-[250px] rounded')}
                aria-hidden="true"
              />
              <div
                className={cn(baseClass, 'h-4 w-[200px] rounded')}
                aria-hidden="true"
              />
            </div>
          </div>
        );

      case 'button':
        return (
          <div
            ref={ref}
            data-testid={testId}
            className={cn(baseClass, 'rounded-md', className)}
            style={{
              width: widthValue ?? '80px',
              height: heightValue ?? '36px',
              ...style,
            }}
            aria-hidden="true"
          />
        );

      case 'card':
        return (
          <div
            ref={ref}
            data-testid={testId}
            className={cn('flex flex-col space-y-3', className)}
            style={{ width: widthValue ?? '100%', ...style }}
          >
            <div
              className={cn(baseClass, 'rounded-xl')}
              style={{ height: heightValue ?? '125px' }}
              aria-hidden="true"
            />
            <div className="space-y-2">
              <div className={cn(baseClass, 'h-4 w-[250px] rounded')} aria-hidden="true" />
              <div className={cn(baseClass, 'h-4 w-[200px] rounded')} aria-hidden="true" />
            </div>
          </div>
        );

      case 'text':
      default:
        return (
          <div
            ref={ref}
            data-testid={testId}
            className={cn('space-y-2', className)}
            style={{ width: widthValue ?? '100%', ...style }}
          >
            {Array.from({ length: lines }).map((_, index) => (
              <div
                key={index}
                className={cn(baseClass, 'h-4 rounded')}
                style={{
                  width: index === lines - 1 && lines > 1 ? '80%' : '100%',
                  height: heightValue,
                }}
                aria-hidden="true"
              />
            ))}
          </div>
        );
    }
  })
);

ShadcnSkeleton.displayName = 'ShadcnSkeleton';
