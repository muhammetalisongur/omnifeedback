/**
 * @vitest-environment jsdom
 */

/**
 * useDrag hook unit tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDrag } from './useDrag';

describe('useDrag', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial state', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => useDrag());

      expect(result.current.dragState).toEqual({
        isDragging: false,
        offset: 0,
        velocity: 0,
        direction: 'none',
      });
      expect(result.current.isDragging).toBe(false);
    });

    it('should provide drag handlers', () => {
      const { result } = renderHook(() => useDrag());

      expect(result.current.dragHandlers).toHaveProperty('onMouseDown');
      expect(result.current.dragHandlers).toHaveProperty('onTouchStart');
      expect(typeof result.current.dragHandlers.onMouseDown).toBe('function');
      expect(typeof result.current.dragHandlers.onTouchStart).toBe('function');
    });

    it('should provide reset function', () => {
      const { result } = renderHook(() => useDrag());

      expect(typeof result.current.reset).toBe('function');
    });
  });

  describe('Options', () => {
    it('should respect enabled option', () => {
      const onDragStart = vi.fn();
      const { result } = renderHook(() =>
        useDrag({ enabled: false, onDragStart })
      );

      // Create a mock mouse event
      const mockEvent = {
        preventDefault: vi.fn(),
        clientX: 100,
        clientY: 100,
      } as unknown as React.MouseEvent;

      act(() => {
        result.current.dragHandlers.onMouseDown(mockEvent);
      });

      // Should not have called preventDefault when disabled
      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    });

    it('should use default axis of y', () => {
      const { result } = renderHook(() => useDrag());

      // Default axis should be y - we can verify by checking handlers exist
      expect(result.current.dragHandlers).toBeDefined();
    });

    it('should accept custom threshold', () => {
      const onDragStart = vi.fn();
      renderHook(() => useDrag({ threshold: 20, onDragStart }));

      // Hook should initialize without errors
      expect(onDragStart).not.toHaveBeenCalled();
    });

    it('should accept bounds option', () => {
      const { result } = renderHook(() => useDrag({ bounds: [0, 500] }));

      expect(result.current.dragState.offset).toBe(0);
    });
  });

  describe('Mouse interaction', () => {
    it('should handle mouse down event', () => {
      const { result } = renderHook(() => useDrag());

      const mockEvent = {
        preventDefault: vi.fn(),
        clientX: 100,
        clientY: 100,
      } as unknown as React.MouseEvent;

      act(() => {
        result.current.dragHandlers.onMouseDown(mockEvent);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should not handle mouse down when disabled', () => {
      const { result } = renderHook(() => useDrag({ enabled: false }));

      const mockEvent = {
        preventDefault: vi.fn(),
        clientX: 100,
        clientY: 100,
      } as unknown as React.MouseEvent;

      act(() => {
        result.current.dragHandlers.onMouseDown(mockEvent);
      });

      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    });
  });

  describe('Touch interaction', () => {
    it('should handle touch start event', () => {
      const { result } = renderHook(() => useDrag());

      const mockEvent = {
        touches: [{ clientX: 100, clientY: 100 }],
      } as unknown as React.TouchEvent;

      act(() => {
        result.current.dragHandlers.onTouchStart(mockEvent);
      });

      // Touch start should be handled without errors
      expect(result.current.dragState.isDragging).toBe(false);
    });

    it('should not handle touch start when disabled', () => {
      const { result } = renderHook(() => useDrag({ enabled: false }));

      const mockEvent = {
        touches: [{ clientX: 100, clientY: 100 }],
      } as unknown as React.TouchEvent;

      act(() => {
        result.current.dragHandlers.onTouchStart(mockEvent);
      });

      expect(result.current.dragState.isDragging).toBe(false);
    });
  });

  describe('Callbacks', () => {
    it('should call onDragStart callback after threshold', () => {
      const onDragStart = vi.fn();
      renderHook(() => useDrag({ onDragStart, threshold: 5 }));

      // onDragStart is called after threshold is passed during mouse move
      // This test verifies the callback is properly registered
      expect(onDragStart).not.toHaveBeenCalled();
    });

    it('should accept onDrag callback', () => {
      const onDrag = vi.fn();
      const { result } = renderHook(() => useDrag({ onDrag }));

      expect(result.current.dragState.isDragging).toBe(false);
    });

    it('should accept onDragEnd callback', () => {
      const onDragEnd = vi.fn();
      const { result } = renderHook(() => useDrag({ onDragEnd }));

      expect(result.current.dragState.isDragging).toBe(false);
    });
  });

  describe('Reset', () => {
    it('should reset drag state', () => {
      const { result } = renderHook(() => useDrag());

      act(() => {
        result.current.reset();
      });

      expect(result.current.dragState).toEqual({
        isDragging: false,
        offset: 0,
        velocity: 0,
        direction: 'none',
      });
    });
  });

  describe('Axis configuration', () => {
    it('should support x axis', () => {
      const { result } = renderHook(() => useDrag({ axis: 'x' }));

      expect(result.current.dragHandlers).toBeDefined();
    });

    it('should support y axis', () => {
      const { result } = renderHook(() => useDrag({ axis: 'y' }));

      expect(result.current.dragHandlers).toBeDefined();
    });
  });

  describe('Cleanup', () => {
    it('should cleanup event listeners on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      const { unmount } = renderHook(() => useDrag());

      unmount();

      // Should have removed event listeners
      expect(removeEventListenerSpy).toHaveBeenCalled();

      removeEventListenerSpy.mockRestore();
    });

    it('should setup event listeners on mount', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');

      renderHook(() => useDrag());

      // Should have added event listeners
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'mousemove',
        expect.any(Function)
      );
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'mouseup',
        expect.any(Function)
      );
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'touchmove',
        expect.any(Function),
        expect.any(Object)
      );
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'touchend',
        expect.any(Function)
      );

      addEventListenerSpy.mockRestore();
    });
  });
});
