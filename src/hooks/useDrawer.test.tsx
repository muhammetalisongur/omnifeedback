/**
 * @vitest-environment jsdom
 */

/**
 * useDrawer hook unit tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { useDrawer } from './useDrawer';
import { FeedbackProvider } from '../providers/FeedbackProvider';
import { FeedbackManager } from '../core/FeedbackManager';
import { useFeedbackStore } from '../core/FeedbackStore';
import type { IDrawerOptions } from '../core/types';

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
      >
        {children}
      </FeedbackProvider>
    );
  };
}

describe('useDrawer', () => {
  beforeEach(() => {
    FeedbackManager.resetInstance();
    useFeedbackStore.getState().clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    FeedbackManager.resetInstance();
    useFeedbackStore.getState().clear();
  });

  describe('open()', () => {
    it('should add drawer to store and return id', () => {
      const { result } = renderHook(() => useDrawer(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.open({ content: <div>Test</div> });
      });

      expect(id!).toBeDefined();
      expect(typeof id!).toBe('string');

      const store = useFeedbackStore.getState();
      const drawers = Array.from(store.items.values()).filter(
        (item) => item.type === 'drawer'
      );

      expect(drawers).toHaveLength(1);
    });

    it('should apply default options', () => {
      const { result } = renderHook(() => useDrawer(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.open({ content: <div>Test</div> });
      });

      const store = useFeedbackStore.getState();
      const drawer = Array.from(store.items.values()).find(
        (item) => item.type === 'drawer'
      );
      const options = drawer?.options as IDrawerOptions | undefined;

      expect(options?.position).toBe('right');
      expect(options?.size).toBe('md');
      expect(options?.overlay).toBe(true);
      expect(options?.overlayOpacity).toBe(0.5);
      expect(options?.closeOnOverlayClick).toBe(true);
      expect(options?.closeOnEscape).toBe(true);
      expect(options?.closable).toBe(true);
      expect(options?.preventScroll).toBe(true);
    });

    it('should apply custom options', () => {
      const { result } = renderHook(() => useDrawer(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.open({
          content: <div>Test</div>,
          title: 'Settings',
          position: 'left',
          size: 'lg',
          overlay: false,
        });
      });

      const store = useFeedbackStore.getState();
      const drawer = Array.from(store.items.values()).find(
        (item) => item.type === 'drawer'
      );
      const options = drawer?.options as IDrawerOptions | undefined;

      expect(options?.title).toBe('Settings');
      expect(options?.position).toBe('left');
      expect(options?.size).toBe('lg');
      expect(options?.overlay).toBe(false);
    });

    it('should call onOpen callback', () => {
      const onOpen = vi.fn();
      const { result } = renderHook(() => useDrawer(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.open({
          content: <div>Test</div>,
          onOpen,
        });
      });

      expect(onOpen).toHaveBeenCalledTimes(1);
    });
  });

  describe('close()', () => {
    it('should remove drawer by id', () => {
      const { result } = renderHook(() => useDrawer(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.open({ content: <div>Test</div> });
      });

      // Verify drawer exists
      let drawers = Array.from(useFeedbackStore.getState().items.values()).filter(
        (item) => item.type === 'drawer'
      );
      expect(drawers).toHaveLength(1);

      act(() => {
        result.current.close(id!);
      });

      // Wait for removal
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Verify drawer is removed
      drawers = Array.from(useFeedbackStore.getState().items.values()).filter(
        (item) => item.type === 'drawer' && item.status !== 'removed'
      );
      expect(drawers).toHaveLength(0);
    });

    it('should call onClose callback', () => {
      const onClose = vi.fn();
      const { result } = renderHook(() => useDrawer(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.open({
          content: <div>Test</div>,
          onClose,
        });
      });

      act(() => {
        result.current.close(id!);
      });

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('closeAll()', () => {
    it('should remove all drawers', () => {
      const { result } = renderHook(() => useDrawer(), {
        wrapper: createWrapper(),
      });

      // Open multiple drawers
      act(() => {
        result.current.open({ content: <div>Drawer 1</div>, position: 'left' });
        result.current.open({ content: <div>Drawer 2</div>, position: 'right' });
        result.current.open({ content: <div>Drawer 3</div>, position: 'bottom' });
      });

      // Verify drawers exist
      let drawers = Array.from(useFeedbackStore.getState().items.values()).filter(
        (item) => item.type === 'drawer'
      );
      expect(drawers).toHaveLength(3);

      act(() => {
        result.current.closeAll();
      });

      // Wait for removal
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Verify all drawers are removed
      drawers = Array.from(useFeedbackStore.getState().items.values()).filter(
        (item) => item.type === 'drawer' && item.status !== 'removed'
      );
      expect(drawers).toHaveLength(0);
    });

    it('should call onClose callback for each drawer', () => {
      const onClose1 = vi.fn();
      const onClose2 = vi.fn();
      const { result } = renderHook(() => useDrawer(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.open({ content: <div>1</div>, onClose: onClose1 });
        result.current.open({ content: <div>2</div>, onClose: onClose2 });
      });

      act(() => {
        result.current.closeAll();
      });

      expect(onClose1).toHaveBeenCalledTimes(1);
      expect(onClose2).toHaveBeenCalledTimes(1);
    });
  });

  describe('update()', () => {
    it('should update drawer options', () => {
      const { result } = renderHook(() => useDrawer(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.open({
          content: <div>Original</div>,
          title: 'Original Title',
        });
      });

      act(() => {
        result.current.update(id!, { title: 'Updated Title' });
      });

      const store = useFeedbackStore.getState();
      const drawer = Array.from(store.items.values()).find(
        (item) => item.type === 'drawer'
      );
      const options = drawer?.options as IDrawerOptions | undefined;

      expect(options?.title).toBe('Updated Title');
    });

    it('should update drawer size', () => {
      const { result } = renderHook(() => useDrawer(), {
        wrapper: createWrapper(),
      });

      let id: string;
      act(() => {
        id = result.current.open({
          content: <div>Test</div>,
          size: 'sm',
        });
      });

      act(() => {
        result.current.update(id!, { size: 'xl' });
      });

      const store = useFeedbackStore.getState();
      const drawer = Array.from(store.items.values()).find(
        (item) => item.type === 'drawer'
      );
      const options = drawer?.options as IDrawerOptions | undefined;

      expect(options?.size).toBe('xl');
    });
  });

  describe('isOpen', () => {
    it('should return false when no drawers are open', () => {
      const { result } = renderHook(() => useDrawer(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isOpen).toBe(false);
    });

    it('should return true when a drawer is open', () => {
      const { result } = renderHook(() => useDrawer(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.open({ content: <div>Test</div> });
      });

      expect(result.current.isOpen).toBe(true);
    });
  });

  describe('openDrawers', () => {
    it('should return empty array when no drawers are open', () => {
      const { result } = renderHook(() => useDrawer(), {
        wrapper: createWrapper(),
      });

      expect(result.current.openDrawers).toHaveLength(0);
    });

    it('should return array of open drawer IDs', () => {
      const { result } = renderHook(() => useDrawer(), {
        wrapper: createWrapper(),
      });

      let id1: string;
      let id2: string;
      act(() => {
        id1 = result.current.open({ content: <div>1</div> });
        id2 = result.current.open({ content: <div>2</div> });
      });

      expect(result.current.openDrawers).toHaveLength(2);
      expect(result.current.openDrawers).toContain(id1!);
      expect(result.current.openDrawers).toContain(id2!);
    });
  });

  describe('drawers (reactive list)', () => {
    it('should return current drawers', () => {
      const { result } = renderHook(() => useDrawer(), {
        wrapper: createWrapper(),
      });

      expect(result.current.drawers).toHaveLength(0);

      act(() => {
        result.current.open({ content: <div>1</div> });
      });

      expect(result.current.drawers).toHaveLength(1);

      act(() => {
        result.current.open({ content: <div>2</div> });
      });

      expect(result.current.drawers).toHaveLength(2);
    });
  });

  describe('Error handling', () => {
    it('should throw if used outside FeedbackProvider', () => {
      expect(() => {
        renderHook(() => useDrawer());
      }).toThrow('useDrawer must be used within FeedbackProvider');
    });
  });

  describe('Position scenarios', () => {
    it('should open drawer at each position', () => {
      const { result } = renderHook(() => useDrawer(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.open({ content: <div>Left</div>, position: 'left' });
        result.current.open({ content: <div>Right</div>, position: 'right' });
        result.current.open({ content: <div>Top</div>, position: 'top' });
        result.current.open({ content: <div>Bottom</div>, position: 'bottom' });
      });

      const drawers = result.current.drawers;
      const positions = drawers.map((d) => d.options.position);

      expect(positions).toContain('left');
      expect(positions).toContain('right');
      expect(positions).toContain('top');
      expect(positions).toContain('bottom');
    });
  });

  describe('Size scenarios', () => {
    it('should open drawer with each size', () => {
      const { result } = renderHook(() => useDrawer(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.open({ content: <div>SM</div>, size: 'sm' });
        result.current.open({ content: <div>MD</div>, size: 'md' });
        result.current.open({ content: <div>LG</div>, size: 'lg' });
        result.current.open({ content: <div>XL</div>, size: 'xl' });
        result.current.open({ content: <div>Full</div>, size: 'full' });
      });

      const drawers = result.current.drawers;
      const sizes = drawers.map((d) => d.options.size);

      expect(sizes).toContain('sm');
      expect(sizes).toContain('md');
      expect(sizes).toContain('lg');
      expect(sizes).toContain('xl');
      expect(sizes).toContain('full');
    });
  });

  describe('Settings Panel Scenario', () => {
    it('should implement settings drawer flow', () => {
      const onClose = vi.fn();
      const { result } = renderHook(() => useDrawer(), {
        wrapper: createWrapper(),
      });

      let settingsId: string;
      act(() => {
        settingsId = result.current.open({
          title: 'Settings',
          content: <div>Settings content</div>,
          footer: <button>Save</button>,
          position: 'right',
          size: 'md',
          onClose,
        });
      });

      expect(result.current.isOpen).toBe(true);

      const drawer = result.current.drawers[0];
      expect(drawer?.options.title).toBe('Settings');
      expect(drawer?.options.position).toBe('right');
      expect(drawer?.options.size).toBe('md');

      act(() => {
        result.current.close(settingsId!);
      });

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Navigation Menu Scenario', () => {
    it('should implement navigation menu drawer flow', () => {
      const { result } = renderHook(() => useDrawer(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.open({
          content: <nav>Menu items</nav>,
          position: 'left',
          size: 'sm',
          closable: false,
          overlay: true,
          closeOnOverlayClick: true,
        });
      });

      const drawer = result.current.drawers[0];
      expect(drawer?.options.position).toBe('left');
      expect(drawer?.options.size).toBe('sm');
      expect(drawer?.options.closable).toBe(false);
      expect(drawer?.options.overlay).toBe(true);
    });
  });

  describe('Nested Drawers Scenario', () => {
    it('should support multiple nested drawers', () => {
      const { result } = renderHook(() => useDrawer(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.open({
          title: 'First Drawer',
          content: <div>First</div>,
          position: 'right',
          size: 'lg',
        });
      });

      expect(result.current.openDrawers).toHaveLength(1);

      act(() => {
        result.current.open({
          title: 'Second Drawer',
          content: <div>Second</div>,
          position: 'right',
          size: 'md',
        });
      });

      expect(result.current.openDrawers).toHaveLength(2);
      expect(result.current.drawers[0]?.options.title).toBe('First Drawer');
      expect(result.current.drawers[1]?.options.title).toBe('Second Drawer');
    });
  });
});
