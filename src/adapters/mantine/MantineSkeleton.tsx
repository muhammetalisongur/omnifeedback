/**
 * MantineSkeleton - Mantine adapter skeleton loader component
 * Styled with Mantine color variables and multiple shapes
 */

import { memo, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterSkeletonProps } from '../types';

/**
 * Animation classes
 */
const animationClasses = {
  pulse: 'animate-pulse',
  wave: 'animate-shimmer',
  none: '',
};

/**
 * MantineSkeleton component
 * Renders placeholder loading elements
 */
export const MantineSkeleton = memo(
  forwardRef<HTMLDivElement, IAdapterSkeletonProps>(function MantineSkeleton(props, ref) {
    const {
      shape = 'text',
      width,
      height,
      lines = 1,
      animate = true,
      animationType = 'pulse',
      status,
      className,
      style,
      testId,
    } = props;

    const isVisible = status === 'visible' || status === 'entering';
    const baseClass = cn(
      'bg-[var(--mantine-color-gray-2)] dark:bg-[var(--mantine-color-dark-5)]',
      animate && animationClasses[animationType],
      !isVisible && 'opacity-0'
    );

    // Convert width/height to CSS value
    const widthValue = typeof width === 'number' ? `${width}px` : width;
    const heightValue = typeof height === 'number' ? `${height}px` : height;

    // Render based on shape
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
            className={cn('flex items-center gap-3', className)}
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
                style={{ width: '60%' }}
                aria-hidden="true"
              />
              <div
                className={cn(baseClass, 'rounded h-3')}
                style={{ width: '40%' }}
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
            className={cn(
              'rounded-md border border-[var(--mantine-color-gray-3)] dark:border-[var(--mantine-color-dark-4)] p-4 space-y-4',
              className
            )}
            style={{ width: widthValue ?? '100%', ...style }}
          >
            {/* Image placeholder */}
            <div
              className={cn(baseClass, 'rounded-md')}
              style={{ height: heightValue ?? '160px' }}
              aria-hidden="true"
            />
            {/* Title */}
            <div
              className={cn(baseClass, 'rounded h-5')}
              style={{ width: '70%' }}
              aria-hidden="true"
            />
            {/* Description lines */}
            <div className="space-y-2">
              <div className={cn(baseClass, 'rounded h-3 w-full')} aria-hidden="true" />
              <div className={cn(baseClass, 'rounded h-3 w-4/5')} aria-hidden="true" />
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

MantineSkeleton.displayName = 'MantineSkeleton';
