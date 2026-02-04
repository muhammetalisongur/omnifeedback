/**
 * @vitest-environment jsdom
 */

/**
 * useSheet hook unit tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { useSheet } from './useSheet';
import { FeedbackProvider } from '../providers/FeedbackProvider';
import { FeedbackManager } from '../core/FeedbackManager';
import { useFeedbackStore } from '../core/FeedbackStore';

/**
 * Wrapper component for renderHook
 */
function createWrapper() {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <FeedbackProvider
        renderToasts={false}
        renderModals={false}
        renderLoadings={false}
        renderConfirms={false}
        renderBanners={false}
        renderDrawers={false}
        renderPopconfirms={false}
        renderSheets={false}
      >
        {children}
      </FeedbackProvider>
    );
  };
}

describe('useSheet', () => {
  beforeEach(() => {
    FeedbackManager.resetInstance();
    useFeedbackStore.getState().clear();
  });

  afterEach(() => {
    FeedbackManager.resetInstance();
    useFeedbackStore.getState().clear();
  });

  describe('open()', () => {
    it('should add sheet to store', () => {
      const { result } = renderHook(() => useSheet(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.open({ content: <div>Test Content</div> });
      });

      const store = useFeedbackStore.getState();
      const sheets = Array.from(store.items.values()).filter(
        (item) => item.type === 'sheet'
      );

      expect(sheets).toHaveLength(1);
    });

    it('should return sheet ID', () => {
      const { result } = renderHook(() => useSheet(), {
        wrapper: createWrapper(),
      });

      let sheetId = '';
      act(() => {
        sheetId = result.current.open({ content: <div>Test</div> });
      });

      expect(typeof sheetId).toBe('string');
      expect(sheetId.length).toBeGreaterThan(0);
    });

    it('should set isOpen to true when showing', () => {
      const { result } = renderHook(() => useSheet(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isOpen).toBe(false);

      act(() => {
        result.current.open({ content: <div>Test</div> });
      });

      expect(result.current.isOpen).toBe(true);
    });

    it('should use custom snap points', () => {
      const { result } = renderHook(() => useSheet(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.open({
          content: <div>Test</div>,
          snapPoints: [30, 60, 90],
        });
      });

      const store = useFeedbackStore.getState();
      const sheet = Array.from(store.items.values()).find(
        (item) => item.type === 'sheet'
      );

      expect(sheet?.options).toHaveProperty('snapPoints', [30, 60, 90]);
    });

    it('should use default snap points when not provided', () => {
      const { result } = renderHook(() => useSheet(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.open({ content: <div>Test</div> });
      });

      const store = useFeedbackStore.getState();
      const sheet = Array.from(store.items.values()).find(
        (item) => item.type === 'sheet'
      );

      expect(sheet?.options).toHaveProperty('snapPoints', [50, 90]);
    });
  });

  describe('close()', () => {
    it('should remove sheet from store', () => {
      const { result } = renderHook(() => useSheet(), {
        wrapper: createWrapper(),
      });

      let sheetId = '';
      act(() => {
        sheetId = result.current.open({ content: <div>Test</div> });
      });

      act(() => {
        result.current.close(sheetId);
      });

      const store = useFeedbackStore.getState();
      const sheets = Array.from(store.items.values()).filter(
        (item) => item.type === 'sheet' && item.status !== 'removed' && item.status !== 'exiting'
      );

      expect(sheets).toHaveLength(0);
    });

    it('should set isOpen to false', () => {
      const { result } = renderHook(() => useSheet(), {
        wrapper: createWrapper(),
      });

      let sheetId = '';
      act(() => {
        sheetId = result.current.open({ content: <div>Test</div> });
      });

      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.close(sheetId);
      });

      expect(result.current.isOpen).toBe(false);
    });
  });

  describe('closeAll()', () => {
    it('should remove all sheets from store', () => {
      const { result } = renderHook(() => useSheet(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.open({ content: <div>Test 1</div> });
        result.current.open({ content: <div>Test 2</div> });
      });

      // Verify sheets exist
      const storeBefore = useFeedbackStore.getState();
      const sheetsBefore = Array.from(storeBefore.items.values()).filter(
        (item) => item.type === 'sheet'
      );
      expect(sheetsBefore.length).toBeGreaterThan(0);

      act(() => {
        result.current.closeAll();
      });

      expect(result.current.isOpen).toBe(false);
    });
  });

  describe('showActions()', () => {
    it('should add action sheet to store', () => {
      const { result } = renderHook(() => useSheet(), {
        wrapper: createWrapper(),
      });

      act(() => {
        void result.current.showActions({
          title: 'Choose Option',
          actions: [
            { key: 'option1', label: 'Option 1' },
            { key: 'option2', label: 'Option 2' },
          ],
        });
      });

      const store = useFeedbackStore.getState();
      const sheets = Array.from(store.items.values()).filter(
        (item) => item.type === 'sheet'
      );

      expect(sheets).toHaveLength(1);
    });

    it('should set isOpen to true', () => {
      const { result } = renderHook(() => useSheet(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isOpen).toBe(false);

      act(() => {
        void result.current.showActions({
          actions: [{ key: 'test', label: 'Test' }],
        });
      });

      expect(result.current.isOpen).toBe(true);
    });
  });

  describe('confirm()', () => {
    it('should add confirm sheet to store', () => {
      const { result } = renderHook(() => useSheet(), {
        wrapper: createWrapper(),
      });

      act(() => {
        void result.current.confirm({
          title: 'Confirm Action',
        });
      });

      const store = useFeedbackStore.getState();
      const sheets = Array.from(store.items.values()).filter(
        (item) => item.type === 'sheet'
      );

      expect(sheets).toHaveLength(1);
    });

    it('should set isOpen to true', () => {
      const { result } = renderHook(() => useSheet(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isOpen).toBe(false);

      act(() => {
        void result.current.confirm({
          title: 'Confirm',
        });
      });

      expect(result.current.isOpen).toBe(true);
    });
  });

  describe('Error handling', () => {
    it('should throw if used outside FeedbackProvider', () => {
      expect(() => {
        renderHook(() => useSheet());
      }).toThrow('useFeedbackContext must be used within a FeedbackProvider');
    });
  });
});
