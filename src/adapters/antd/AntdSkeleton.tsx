/**
 * AntdSkeleton - Ant Design adapter skeleton loader component
 * Implements Ant Design Skeleton with multiple shape variants
 */

import { memo, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { IAdapterSkeletonProps } from '../types';

/**
 * Animation classes following Ant Design skeleton animations
 */
const animationClasses = {
  pulse: 'animate-pulse',
  wave: 'of-antd-skeleton-wave',
  none: '',
};

/**
 * AntdSkeleton component
 * Renders placeholder loading elements with Ant Design styling
 */
export const AntdSkeleton = memo(
  forwardRef<HTMLDivElement, IAdapterSkeletonProps>(function AntdSkeleton(props, ref) {
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
      'of-antd-skeleton',
      'bg-gray-200',
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
            className={cn(baseClass, 'of-antd-skeleton-avatar rounded-full', className)}
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
            className={cn(baseClass, 'of-antd-skeleton-image rounded', className)}
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
            className={cn('of-antd-skeleton-with-avatar flex items-center gap-4', className)}
            style={style}
          >
            <div
              className={cn(baseClass, 'of-antd-skeleton-avatar rounded-full flex-shrink-0')}
              style={{ width: '40px', height: '40px' }}
              aria-hidden="true"
            />
            <div className="of-antd-skeleton-content flex-1 space-y-3">
              <div
                className={cn(baseClass, 'of-antd-skeleton-title rounded h-4')}
                style={{ width: '50%' }}
                aria-hidden="true"
              />
              <div
                className={cn(baseClass, 'of-antd-skeleton-paragraph rounded h-3')}
                style={{ width: '100%' }}
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
            className={cn(baseClass, 'of-antd-skeleton-button rounded', className)}
            style={{
              width: widthValue ?? '64px',
              height: heightValue ?? '32px',
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
              'of-antd-skeleton-card rounded-lg border border-gray-200 overflow-hidden',
              className
            )}
            style={{ width: widthValue ?? '100%', ...style }}
          >
            {/* Cover */}
            <div
              className={cn(baseClass, 'of-antd-skeleton-image')}
              style={{ height: heightValue ?? '160px' }}
              aria-hidden="true"
            />
            {/* Body */}
            <div className="p-4 space-y-3">
              <div
                className={cn(baseClass, 'of-antd-skeleton-title rounded h-4')}
                style={{ width: '60%' }}
                aria-hidden="true"
              />
              <div className="space-y-2">
                <div
                  className={cn(baseClass, 'of-antd-skeleton-paragraph rounded h-3 w-full')}
                  aria-hidden="true"
                />
                <div
                  className={cn(baseClass, 'of-antd-skeleton-paragraph rounded h-3 w-4/5')}
                  aria-hidden="true"
                />
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
            className={cn('of-antd-skeleton-paragraph space-y-3', className)}
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

AntdSkeleton.displayName = 'AntdSkeleton';
