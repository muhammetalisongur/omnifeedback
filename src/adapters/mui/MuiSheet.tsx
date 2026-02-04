/**
 * MuiSheet - Material UI adapter bottom sheet component
 * Material Design bottom sheet with snap points and drag support
 */

import { memo, forwardRef, useEffect, useRef, useCallback, useState } from 'react';
import { cn } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import { useDrag } from '../../hooks/useDrag';
import type { IAdapterSheetProps } from '../types';

/**
 * MuiSheet component
 * Renders a draggable bottom sheet with Material Design styling
 */
export const MuiSheet = memo(
  forwardRef<HTMLDivElement, IAdapterSheetProps>(function MuiSheet(props, ref) {
    const {
      title,
      content,
      snapPoints = [50],
      defaultSnapPoint = 0,
      closeOnBackdropClick = true,
      showHandle = true,
      currentSnapIndex,
      onSnapChange,
      onRequestClose,
      status,
      className,
      style,
      testId,
    } = props;

    const sheetRef = useRef<HTMLDivElement>(null);
    const [snapIndex, setSnapIndex] = useState(defaultSnapPoint);
    const isVisible = status === 'visible' || status === 'entering';
    const isExiting = status === 'exiting';

    useFocusTrap(sheetRef, { enabled: isVisible });
    useScrollLock(isVisible);

    // Sync external snap index
    useEffect(() => {
      if (currentSnapIndex !== undefined) {
        setSnapIndex(currentSnapIndex);
      }
    }, [currentSnapIndex]);

    // Get current height percentage
    const currentHeight = snapPoints[snapIndex] ?? 50;

    // Calculate snap thresholds
    const { dragHandlers, dragState, reset: resetDrag } = useDrag({
      axis: 'y',
      onDragEnd: (offset, velocity) => {
        const threshold = 50;
        const velocityThreshold = 0.5;

        // Close if dragged down significantly
        if (offset > threshold || velocity > velocityThreshold) {
          // Find next lower snap point or close
          const lowerSnapIndex = snapIndex - 1;
          if (lowerSnapIndex >= 0) {
            setSnapIndex(lowerSnapIndex);
            onSnapChange?.(lowerSnapIndex);
          } else {
            onRequestClose();
          }
        }
        // Expand if dragged up significantly
        else if (offset < -threshold || velocity < -velocityThreshold) {
          const higherSnapIndex = snapIndex + 1;
          if (higherSnapIndex < snapPoints.length) {
            setSnapIndex(higherSnapIndex);
            onSnapChange?.(higherSnapIndex);
          }
        }

        resetDrag();
      },
    });

    // Handle escape key
    useEffect(() => {
      if (!isVisible) return undefined;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onRequestClose();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isVisible, onRequestClose]);

    const handleBackdropClick = useCallback(() => {
      if (closeOnBackdropClick) {
        onRequestClose();
      }
    }, [closeOnBackdropClick, onRequestClose]);

    // Calculate visual height with drag offset
    const visualHeight = Math.max(0, currentHeight - (dragState.offset / window.innerHeight) * 100);

    return (
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'mui-sheet-title' : undefined}
        data-testid={testId}
        className={cn(
          'fixed inset-0 z-[1200]',
          'transition-opacity duration-225',
          isVisible && !isExiting ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        style={style}
      >
        {/* Backdrop */}
        <div
          className={cn(
            'absolute inset-0 bg-black/50',
            'transition-opacity duration-225',
            isVisible && !isExiting ? 'opacity-100' : 'opacity-0'
          )}
          onClick={handleBackdropClick}
        />

        {/* Sheet - MUI Paper styling */}
        <div
          ref={sheetRef}
          className={cn(
            'absolute bottom-0 left-0 right-0',
            'bg-white dark:bg-gray-900',
            'rounded-t-2xl shadow-2xl',
            'flex flex-col',
            'transition-all duration-225 ease-out',
            isVisible && !isExiting ? 'translate-y-0' : 'translate-y-full',
            className
          )}
          style={{
            height: `${visualHeight}%`,
            maxHeight: '90%',
          }}
        >
          {/* Handle - MUI Sheet handle */}
          {showHandle && (
            <div
              className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none"
              {...dragHandlers}
            >
              <div className="w-8 h-1 bg-gray-400 dark:bg-gray-600 rounded-full" />
            </div>
          )}

          {/* Title */}
          {title && (
            <div className="px-6 py-3 border-b dark:border-gray-700">
              <h2
                id="mui-sheet-title"
                className="text-lg font-medium text-gray-900 dark:text-gray-100 text-center"
              >
                {title}
              </h2>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto">{content}</div>
        </div>
      </div>
    );
  })
);

MuiSheet.displayName = 'MuiSheet';
