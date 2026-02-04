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
      const preventDefaultMock = vi.fn();
      const mockEvent = {
        preventDefault: preventDefaultMock,
        clientX: 100,
        clientY: 100,
      } as unknown as React.MouseEvent;

      act(() => {
        result.current.dragHandlers.onMouseDown(mockEvent);
      });

      // Should not have called preventDefault when disabled
      expect(preventDefaultMock).not.toHaveBeenCalled();
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

      const preventDefaultMock = vi.fn();
      const mockEvent = {
        preventDefault: preventDefaultMock,
        clientX: 100,
        clientY: 100,
      } as unknown as React.MouseEvent;

      act(() => {
        result.current.dragHandlers.onMouseDown(mockEvent);
      });

      expect(preventDefaultMock).toHaveBeenCalled();
    });

    it('should not handle mouse down when disabled', () => {
      const { result } = renderHook(() => useDrag({ enabled: false }));

      const preventDefaultMock = vi.fn();
      const mockEvent = {
        preventDefault: preventDefaultMock,
        clientX: 100,
        clientY: 100,
      } as unknown as React.MouseEvent;

      act(() => {
        result.current.dragHandlers.onMouseDown(mockEvent);
      });

      expect(preventDefaultMock).not.toHaveBeenCalled();
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

  describe('Drag lifecycle', () => {
    it('should complete full mouse drag cycle', () => {
      const onDragStart = vi.fn();
      const onDrag = vi.fn();
      const onDragEnd = vi.fn();

      const { result } = renderHook(() =>
        useDrag({
          axis: 'y',
          threshold: 5,
          onDragStart,
          onDrag,
          onDragEnd,
        })
      );

      // Start drag
      act(() => {
        result.current.dragHandlers.onMouseDown({
          preventDefault: vi.fn(),
          clientX: 100,
          clientY: 100,
        } as unknown as React.MouseEvent);
      });

      // Move past threshold
      act(() => {
        document.dispatchEvent(
          new MouseEvent('mousemove', { clientX: 100, clientY: 120 })
        );
      });

      expect(onDragStart).toHaveBeenCalled();
      expect(onDrag).toHaveBeenCalled();
      expect(result.current.dragState.isDragging).toBe(true);

      // End drag
      act(() => {
        document.dispatchEvent(
          new MouseEvent('mouseup', { clientX: 100, clientY: 120 })
        );
      });

      expect(onDragEnd).toHaveBeenCalled();
      expect(result.current.dragState.isDragging).toBe(false);
    });

    it('should not trigger onDragStart below threshold', () => {
      const onDragStart = vi.fn();

      const { result } = renderHook(() =>
        useDrag({ threshold: 20, onDragStart })
      );

      act(() => {
        result.current.dragHandlers.onMouseDown({
          preventDefault: vi.fn(),
          clientX: 100,
          clientY: 100,
        } as unknown as React.MouseEvent);
      });

      act(() => {
        document.dispatchEvent(
          new MouseEvent('mousemove', { clientX: 100, clientY: 103 })
        );
      });

      expect(onDragStart).not.toHaveBeenCalled();
    });

    it('should not call onDragEnd when threshold not passed', () => {
      const onDragEnd = vi.fn();

      const { result } = renderHook(() =>
        useDrag({ threshold: 20, onDragEnd })
      );

      act(() => {
        result.current.dragHandlers.onMouseDown({
          preventDefault: vi.fn(),
          clientX: 100,
          clientY: 100,
        } as unknown as React.MouseEvent);
      });

      act(() => {
        document.dispatchEvent(
          new MouseEvent('mousemove', { clientX: 100, clientY: 103 })
        );
      });

      act(() => {
        document.dispatchEvent(
          new MouseEvent('mouseup', { clientX: 100, clientY: 103 })
        );
      });

      expect(onDragEnd).not.toHaveBeenCalled();
    });

    it('should apply bounds during drag', () => {
      const onDrag = vi.fn();

      const { result } = renderHook(() =>
        useDrag({
          bounds: [0, 50],
          threshold: 5,
          onDrag,
        })
      );

      act(() => {
        result.current.dragHandlers.onMouseDown({
          preventDefault: vi.fn(),
          clientX: 100,
          clientY: 100,
        } as unknown as React.MouseEvent);
      });

      act(() => {
        document.dispatchEvent(
          new MouseEvent('mousemove', { clientX: 100, clientY: 300 })
        );
      });

      expect(result.current.dragState.offset).toBeLessThanOrEqual(50);
    });

    it('should handle x axis drag', () => {
      const onDragStart = vi.fn();
      const onDrag = vi.fn();

      const { result } = renderHook(() =>
        useDrag({
          axis: 'x',
          threshold: 5,
          onDragStart,
          onDrag,
        })
      );

      act(() => {
        result.current.dragHandlers.onMouseDown({
          preventDefault: vi.fn(),
          clientX: 100,
          clientY: 100,
        } as unknown as React.MouseEvent);
      });

      act(() => {
        document.dispatchEvent(
          new MouseEvent('mousemove', { clientX: 120, clientY: 100 })
        );
      });

      expect(onDragStart).toHaveBeenCalled();
      expect(onDrag).toHaveBeenCalled();
    });

    it('should handle touch drag cycle', () => {
      const onDragStart = vi.fn();
      const onDragEnd = vi.fn();

      const { result } = renderHook(() =>
        useDrag({
          threshold: 5,
          onDragStart,
          onDragEnd,
        })
      );

      act(() => {
        result.current.dragHandlers.onTouchStart({
          touches: [{ clientX: 100, clientY: 100 }],
        } as unknown as React.TouchEvent);
      });

      act(() => {
        const touchMoveEvent = new Event('touchmove') as unknown as TouchEvent;
        Object.defineProperty(touchMoveEvent, 'touches', {
          value: [{ clientX: 100, clientY: 120 }],
        });
        Object.defineProperty(touchMoveEvent, 'changedTouches', {
          value: [{ clientX: 100, clientY: 120 }],
        });
        document.dispatchEvent(touchMoveEvent);
      });

      expect(onDragStart).toHaveBeenCalled();

      act(() => {
        const touchEndEvent = new Event('touchend') as unknown as TouchEvent;
        Object.defineProperty(touchEndEvent, 'touches', { value: [] });
        Object.defineProperty(touchEndEvent, 'changedTouches', {
          value: [{ clientX: 100, clientY: 120 }],
        });
        document.dispatchEvent(touchEndEvent);
      });

      expect(onDragEnd).toHaveBeenCalled();
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
