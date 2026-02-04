/**
 * ShadcnSheet - shadcn/ui adapter bottom sheet component
 */

import { memo, forwardRef, useEffect, useRef, useCallback, useState } from 'react';
import { cn } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import { useDrag } from '../../hooks/useDrag';
import type { IAdapterSheetProps } from '../types';

/**
 * ShadcnSheet component
 */
export const ShadcnSheet = memo(
  forwardRef<HTMLDivElement, IAdapterSheetProps>(function ShadcnSheet(props, ref): JSX.Element {
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

    useEffect((): void => {
      setSnapIndex(currentSnapIndex);
    }, [currentSnapIndex]);

    const currentHeight = snapPoints[snapIndex] ?? 50;

    const { dragHandlers, dragState, reset: resetDrag } = useDrag({
      axis: 'y',
      onDragEnd: (offset: number, velocity: number): void => {
        const threshold = 50;
        const velocityThreshold = 0.5;

        if (offset > threshold || velocity > velocityThreshold) {
          const lowerSnapIndex = snapIndex - 1;
          if (lowerSnapIndex >= 0) {
            setSnapIndex(lowerSnapIndex);
            onSnapChange?.(lowerSnapIndex);
          } else {
            onRequestClose();
          }
        } else if (offset < -threshold || velocity < -velocityThreshold) {
          const higherSnapIndex = snapIndex + 1;
          if (higherSnapIndex < snapPoints.length) {
            setSnapIndex(higherSnapIndex);
            onSnapChange?.(higherSnapIndex);
          }
        }

        resetDrag();
      },
    });

    useEffect((): (() => void) | undefined => {
      if (!isVisible) {return undefined;}

      const handleKeyDown = (e: KeyboardEvent): void => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onRequestClose();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return (): void => document.removeEventListener('keydown', handleKeyDown);
    }, [isVisible, onRequestClose]);

    const handleBackdropClick = useCallback((): void => {
      if (closeOnBackdropClick) {
        onRequestClose();
      }
    }, [closeOnBackdropClick, onRequestClose]);

    const visualHeight = Math.max(0, currentHeight - (dragState.offset / window.innerHeight) * 100);

    return (
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'sheet-title' : undefined}
        data-testid={testId}
        data-state={isVisible && !isExiting ? 'open' : 'closed'}
        className={cn(
          'fixed inset-0 z-50',
          'transition-opacity duration-300',
          isVisible && !isExiting ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        style={style}
      >
        {/* Backdrop */}
        <div
          className={cn(
            'fixed inset-0 bg-black/80',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
          )}
          data-state={isVisible && !isExiting ? 'open' : 'closed'}
          onClick={handleBackdropClick}
        />

        {/* Sheet */}
        <div
          ref={sheetRef}
          data-state={isVisible && !isExiting ? 'open' : 'closed'}
          className={cn(
            'fixed inset-x-0 bottom-0 z-50 mt-24',
            'border-t bg-background',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
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
              className="mx-auto mt-4 flex h-2 w-[100px] cursor-grab rounded-full bg-muted active:cursor-grabbing touch-none"
              {...dragHandlers}
            />
          )}

          {/* Title */}
          {title && (
            <div className="flex flex-col space-y-2 px-4 pt-4 text-center sm:text-left">
              <h2 id="sheet-title" className="text-lg font-semibold">
                {title}
              </h2>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">{content}</div>
        </div>
      </div>
    );
  })
);

ShadcnSheet.displayName = 'ShadcnSheet';
