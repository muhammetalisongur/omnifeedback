/**
 * MuiSkeleton - Material UI adapter skeleton component
 * Material Design skeleton loader with wave animation
 */

import { memo, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterSkeletonProps } from '../types';

/**
 * Animation classes (MUI-style animations)
 */
const animationClasses = {
  pulse: 'animate-pulse',
  wave: 'animate-shimmer overflow-hidden relative before:absolute before:inset-0 before:-translate-x-full before:animate-wave before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
  none: '',
};

/**
 * MuiSkeleton component
 * Renders placeholder loading elements with Material Design styling
 */
export const MuiSkeleton = memo(
  forwardRef<HTMLDivElement, IAdapterSkeletonProps>(function MuiSkeleton(props, ref): JSX.Element {
    const {
      shape = 'text',
      width,
      height,
      lines = 1,
      animate = true,
      animationType = 'wave',
      status,
      className,
      style,
      testId,
    } = props;

    const isVisible = status === 'visible' || status === 'entering';
    const baseClass = cn(
      // MUI Skeleton base styling
      'bg-gray-300 dark:bg-gray-700',
      animate && animationClasses[animationType],
      !isVisible && 'opacity-0'
    );

    // Convert width/height to CSS value
    const widthValue = typeof width === 'number' ? `${String(width)}px` : width;
    const heightValue = typeof height === 'number' ? `${String(height)}px` : height;

    // Render based on shape
    switch (shape) {
      case 'circle':
        return (
          <div
            ref={ref}
            data-testid={testId}
            className={cn(baseClass, 'rounded-full', className)}
            style={{
              width: widthValue ?? '40px',
              height: heightValue ?? '40px',
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
            className={cn(baseClass, 'rounded', className)}
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
              className={cn(baseClass, 'rounded-full flex-shrink-0')}
              style={{ width: '40px', height: '40px' }}
              aria-hidden="true"
            />
            <div className="flex-1 space-y-2">
              <div
                className={cn(baseClass, 'rounded h-4')}
                style={{ width: '50%' }}
                aria-hidden="true"
              />
              <div
                className={cn(baseClass, 'rounded h-3')}
                style={{ width: '80%' }}
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
            className={cn(baseClass, 'rounded', className)}
            style={{
              width: widthValue ?? '100px',
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
            className={cn(
              'rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow',
              className
            )}
            style={{ width: widthValue ?? '100%', ...style }}
          >
            {/* Image placeholder */}
            <div
              className={cn(baseClass)}
              style={{ height: heightValue ?? '140px' }}
              aria-hidden="true"
            />
            {/* Content */}
            <div className="p-4 space-y-3">
              <div
                className={cn(baseClass, 'rounded h-5')}
                style={{ width: '60%' }}
                aria-hidden="true"
              />
              <div className="space-y-2">
                <div className={cn(baseClass, 'rounded h-3 w-full')} aria-hidden="true" />
                <div className={cn(baseClass, 'rounded h-3 w-4/5')} aria-hidden="true" />
              </div>
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
                className={cn(baseClass, 'rounded h-4')}
                style={{
                  width: index === lines - 1 && lines > 1 ? '60%' : '100%',
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

MuiSkeleton.displayName = 'MuiSkeleton';
