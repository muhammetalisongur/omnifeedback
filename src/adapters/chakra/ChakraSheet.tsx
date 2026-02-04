/**
 * ChakraSheet - Chakra UI adapter bottom sheet component
 * Chakra UI-specific styling with snap points and drag support
 */

import { memo, forwardRef, useEffect, useRef, useCallback, useState } from 'react';
import { cn } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import { useDrag } from '../../hooks/useDrag';
import type { IAdapterSheetProps } from '../types';

/**
 * ChakraSheet component
 * Renders a draggable bottom sheet with Chakra UI styling
 */
export const ChakraSheet = memo(
  forwardRef<HTMLDivElement, IAdapterSheetProps>(function ChakraSheet(props, ref) {
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
        aria-labelledby={title ? 'chakra-sheet-title' : undefined}
        data-testid={testId}
        className={cn(
          'chakra-modal-overlay',
          'fixed inset-0 z-50',
          'transition-opacity duration-200',
          isVisible && !isExiting ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        style={style}
      >
        {/* Backdrop */}
        <div
          className={cn(
            'chakra-modal-overlay-bg',
            'absolute inset-0',
            'transition-opacity duration-200',
            isVisible && !isExiting ? 'opacity-100' : 'opacity-0'
          )}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.48)' }}
          onClick={handleBackdropClick}
        />

        {/* Sheet */}
        <div
          ref={sheetRef}
          className={cn(
            'chakra-sheet-content',
            'absolute bottom-0 left-0 right-0',
            'bg-white dark:bg-gray-800',
            'rounded-t-xl shadow-xl',
            'flex flex-col',
            'transition-all duration-200 ease-out',
            isVisible && !isExiting ? 'translate-y-0' : 'translate-y-full',
            className
          )}
          style={{
            height: `${visualHeight}%`,
            maxHeight: '90%',
          }}
        >
          {/* Handle */}
          {showHandle && (
            <div
              className="chakra-sheet-handle flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none"
              {...dragHandlers}
            >
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>
          )}

          {/* Title */}
          {title && (
            <div className="chakra-sheet-header px-4 py-2 border-b border-gray-200 dark:border-gray-600">
              <h2
                id="chakra-sheet-title"
                className="text-lg font-semibold text-gray-900 dark:text-white text-center"
              >
                {title}
              </h2>
            </div>
          )}

          {/* Content */}
          <div className="chakra-sheet-body flex-1 overflow-y-auto">{content}</div>
        </div>
      </div>
    );
  })
);

ChakraSheet.displayName = 'ChakraSheet';
