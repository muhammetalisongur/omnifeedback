/**
 * AntdSheet - Ant Design adapter bottom sheet component
 * Implements a bottom sheet with snap points and drag support
 */

import { memo, forwardRef, useEffect, useRef, useCallback, useState } from 'react';
import { cn } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import { useDrag } from '../../hooks/useDrag';
import type { IAdapterSheetProps } from '../types';

/**
 * AntdSheet component
 * Renders a draggable bottom sheet with Ant Design styling
 */
export const AntdSheet = memo(
  forwardRef<HTMLDivElement, IAdapterSheetProps>(function AntdSheet(props, ref) {
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
    useEffect((): void => {
      setSnapIndex(currentSnapIndex);
    }, [currentSnapIndex]);

    // Get current height percentage
    const currentHeight = snapPoints[snapIndex] ?? 50;

    // Calculate snap thresholds
    const { dragHandlers, dragState, reset: resetDrag } = useDrag({
      axis: 'y',
      onDragEnd: (offset: number, velocity: number): void => {
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
    useEffect((): (() => void) | undefined => {
      if (!isVisible) {return undefined;}

      const handleKeyDown = (e: KeyboardEvent): void => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onRequestClose();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return (): void => { document.removeEventListener('keydown', handleKeyDown); };
    }, [isVisible, onRequestClose]);

    const handleBackdropClick = useCallback((): void => {
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
        aria-labelledby={title ? 'antd-sheet-title' : undefined}
        data-testid={testId}
        className={cn(
          'of-antd-sheet-wrapper',
          'fixed inset-0 z-[1000]',
          'transition-opacity duration-300',
          isVisible && !isExiting ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        style={style}
      >
        {/* Backdrop */}
        <div
          className={cn(
            'of-antd-sheet-mask',
            'absolute inset-0 bg-black/45',
            'transition-opacity duration-300',
            isVisible && !isExiting ? 'opacity-100' : 'opacity-0'
          )}
          onClick={handleBackdropClick}
        />

        {/* Sheet */}
        <div
          ref={sheetRef}
          className={cn(
            'of-antd-sheet',
            'absolute bottom-0 left-0 right-0',
            'bg-white',
            'rounded-t-xl shadow-xl',
            'flex flex-col',
            'transition-all duration-300 ease-out',
            isVisible && !isExiting ? 'translate-y-0' : 'translate-y-full',
            className
          )}
          style={{
            height: `${String(visualHeight)}%`,
            maxHeight: '90%',
          }}
        >
          {/* Handle */}
          {showHandle && (
            <div
              className="of-antd-sheet-handle flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none"
              {...dragHandlers}
            >
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>
          )}

          {/* Title */}
          {title && (
            <div className="of-antd-sheet-header px-6 py-3 border-b border-gray-200">
              <h2
                id="antd-sheet-title"
                className="of-antd-sheet-title text-base font-semibold text-gray-900 text-center"
              >
                {title}
              </h2>
            </div>
          )}

          {/* Content */}
          <div className="of-antd-sheet-body flex-1 overflow-y-auto">{content}</div>
        </div>
      </div>
    );
  })
);

AntdSheet.displayName = 'AntdSheet';
