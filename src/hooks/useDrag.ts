/**
 * useDrag hook - Handles drag gestures for touch and mouse events
 * Used by Sheet component for drag-to-dismiss functionality
 */

import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Drag state information
 */
export interface IDragState {
  /** Whether a drag is currently active */
  isDragging: boolean;
  /** Current drag offset from start position */
  offset: number;
  /** Drag velocity (pixels per ms) */
  velocity: number;
  /** Drag direction */
  direction: 'up' | 'down' | 'none';
}

/**
 * Options for useDrag hook
 */
export interface IUseDragOptions {
  /** Drag axis - 'y' for vertical (default), 'x' for horizontal */
  axis?: 'x' | 'y';
  /** Minimum distance before drag starts (pixels) */
  threshold?: number;
  /** Enable/disable drag functionality */
  enabled?: boolean;
  /** Called when drag starts */
  onDragStart?: () => void;
  /** Called during drag with current offset */
  onDrag?: (offset: number, velocity: number) => void;
  /** Called when drag ends */
  onDragEnd?: (offset: number, velocity: number) => void;
  /** Boundaries for drag movement [min, max] */
  bounds?: [number, number];
}

/**
 * Return type for useDrag hook
 */
export interface IUseDragReturn {
  /** Current drag state */
  dragState: IDragState;
  /** Props to spread on the draggable element */
  dragHandlers: {
    onMouseDown: (e: React.MouseEvent) => void;
    onTouchStart: (e: React.TouchEvent) => void;
  };
  /** Manually reset drag state */
  reset: () => void;
  /** Whether drag is currently active */
  isDragging: boolean;
}

/**
 * Hook for handling drag gestures
 *
 * @example
 * ```tsx
 * const { dragState, dragHandlers, isDragging } = useDrag({
 *   axis: 'y',
 *   onDragEnd: (offset, velocity) => {
 *     if (offset > 100 || velocity > 0.5) {
 *       closeSheet();
 *     }
 *   }
 * });
 *
 * return (
 *   <div {...dragHandlers} style={{ transform: `translateY(${dragState.offset}px)` }}>
 *     Drag me
 *   </div>
 * );
 * ```
 */
export function useDrag(options: IUseDragOptions = {}): IUseDragReturn {
  const {
    axis = 'y',
    threshold = 5,
    enabled = true,
    onDragStart,
    onDrag,
    onDragEnd,
    bounds,
  } = options;

  // Drag state
  const [dragState, setDragState] = useState<IDragState>({
    isDragging: false,
    offset: 0,
    velocity: 0,
    direction: 'none',
  });

  // Refs for tracking drag
  const startPositionRef = useRef<number>(0);
  const lastPositionRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const hasPassedThresholdRef = useRef<boolean>(false);

  /**
   * Get position from event (mouse or touch)
   */
  const getPosition = useCallback(
    (e: MouseEvent | TouchEvent): number => {
      if ('touches' in e) {
        const touch = e.touches[0] ?? e.changedTouches[0];
        if (!touch) {return 0;}
        return axis === 'y' ? touch.clientY : touch.clientX;
      }
      return axis === 'y' ? e.clientY : e.clientX;
    },
    [axis]
  );

  /**
   * Calculate velocity based on movement
   */
  const calculateVelocity = useCallback(
    (currentPosition: number, currentTime: number): number => {
      const timeDelta = currentTime - lastTimeRef.current;
      if (timeDelta === 0) {return 0;}

      const positionDelta = currentPosition - lastPositionRef.current;
      return positionDelta / timeDelta;
    },
    []
  );

  /**
   * Apply bounds to offset value
   */
  const applyBounds = useCallback(
    (value: number): number => {
      if (!bounds) {return value;}
      const [min, max] = bounds;
      return Math.max(min, Math.min(max, value));
    },
    [bounds]
  );

  /**
   * Handle mouse/touch move
   */
  const handleMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) {return;}

      const currentPosition = getPosition(e);
      const currentTime = Date.now();
      const rawOffset = currentPosition - startPositionRef.current;

      // Check threshold
      if (!hasPassedThresholdRef.current) {
        if (Math.abs(rawOffset) < threshold) {
          return;
        }
        hasPassedThresholdRef.current = true;
        onDragStart?.();
      }

      const offset = applyBounds(rawOffset);
      const velocity = calculateVelocity(currentPosition, currentTime);
      const direction = velocity > 0 ? 'down' : velocity < 0 ? 'up' : 'none';

      lastPositionRef.current = currentPosition;
      lastTimeRef.current = currentTime;

      setDragState({
        isDragging: true,
        offset,
        velocity,
        direction,
      });

      onDrag?.(offset, velocity);
    },
    [getPosition, threshold, applyBounds, calculateVelocity, onDragStart, onDrag]
  );

  /**
   * Handle mouse/touch end
   */
  const handleEnd = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) {return;}

      isDraggingRef.current = false;

      const currentPosition = getPosition(e);
      const currentTime = Date.now();
      const offset = applyBounds(currentPosition - startPositionRef.current);
      const velocity = calculateVelocity(currentPosition, currentTime);

      // Reset state
      setDragState({
        isDragging: false,
        offset: 0,
        velocity: 0,
        direction: 'none',
      });

      // Only call onDragEnd if threshold was passed
      if (hasPassedThresholdRef.current) {
        onDragEnd?.(offset, velocity);
      }

      hasPassedThresholdRef.current = false;
    },
    [getPosition, applyBounds, calculateVelocity, onDragEnd]
  );

  /**
   * Set up document event listeners
   */
  useEffect(() => {
    if (!enabled) {return undefined;}

    const moveHandler = (e: MouseEvent | TouchEvent): void => { handleMove(e); };
    const endHandler = (e: MouseEvent | TouchEvent): void => { handleEnd(e); };

    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', endHandler);
    document.addEventListener('touchmove', moveHandler, { passive: true });
    document.addEventListener('touchend', endHandler);
    document.addEventListener('touchcancel', endHandler);

    return () => {
      document.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('mouseup', endHandler);
      document.removeEventListener('touchmove', moveHandler);
      document.removeEventListener('touchend', endHandler);
      document.removeEventListener('touchcancel', endHandler);
    };
  }, [enabled, handleMove, handleEnd]);

  /**
   * Handle mouse down
   */
  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!enabled) {return;}
      e.preventDefault();

      isDraggingRef.current = true;
      hasPassedThresholdRef.current = false;
      startPositionRef.current = axis === 'y' ? e.clientY : e.clientX;
      lastPositionRef.current = startPositionRef.current;
      lastTimeRef.current = Date.now();
    },
    [enabled, axis]
  );

  /**
   * Handle touch start
   */
  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled) {return;}

      const touch = e.touches[0];
      if (!touch) {return;}

      isDraggingRef.current = true;
      hasPassedThresholdRef.current = false;
      startPositionRef.current = axis === 'y' ? touch.clientY : touch.clientX;
      lastPositionRef.current = startPositionRef.current;
      lastTimeRef.current = Date.now();
    },
    [enabled, axis]
  );

  /**
   * Reset drag state
   */
  const reset = useCallback(() => {
    isDraggingRef.current = false;
    hasPassedThresholdRef.current = false;
    setDragState({
      isDragging: false,
      offset: 0,
      velocity: 0,
      direction: 'none',
    });
  }, []);

  return {
    dragState,
    dragHandlers: {
      onMouseDown,
      onTouchStart,
    },
    reset,
    isDragging: dragState.isDragging,
  };
}
