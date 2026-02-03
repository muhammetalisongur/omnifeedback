/**
 * @vitest-environment jsdom
 */

/**
 * useFeedback combined hook unit tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { useFeedback } from './useFeedback';
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

describe('useFeedback', () => {
  beforeEach(() => {
    FeedbackManager.resetInstance();
    useFeedbackStore.getState().clear();
  });

  afterEach(() => {
    FeedbackManager.resetInstance();
    useFeedbackStore.getState().clear();
  });

  describe('Hook structure', () => {
    it('should return all feedback hooks', () => {
      const { result } = renderHook(() => useFeedback(), {
        wrapper: createWrapper(),
      });

      // Check all hooks are present
      expect(result.current).toHaveProperty('toast');
      expect(result.current).toHaveProperty('modal');
      expect(result.current).toHaveProperty('loading');
      expect(result.current).toHaveProperty('alert');
      expect(result.current).toHaveProperty('progress');
      expect(result.current).toHaveProperty('confirm');
      expect(result.current).toHaveProperty('banner');
      expect(result.current).toHaveProperty('drawer');
      expect(result.current).toHaveProperty('popconfirm');
      expect(result.current).toHaveProperty('skeleton');
      expect(result.current).toHaveProperty('result');
      expect(result.current).toHaveProperty('connection');
      expect(result.current).toHaveProperty('prompt');
      expect(result.current).toHaveProperty('sheet');
    });

    it('should have toast methods', () => {
      const { result } = renderHook(() => useFeedback(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.toast.show).toBe('function');
      expect(typeof result.current.toast.success).toBe('function');
      expect(typeof result.current.toast.error).toBe('function');
      expect(typeof result.current.toast.warning).toBe('function');
      expect(typeof result.current.toast.info).toBe('function');
      expect(typeof result.current.toast.dismiss).toBe('function');
      expect(typeof result.current.toast.dismissAll).toBe('function');
    });

    it('should have modal methods', () => {
      const { result } = renderHook(() => useFeedback(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.modal.open).toBe('function');
      expect(typeof result.current.modal.close).toBe('function');
      expect(typeof result.current.modal.closeAll).toBe('function');
    });

    it('should have loading methods', () => {
      const { result } = renderHook(() => useFeedback(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.loading.show).toBe('function');
      expect(typeof result.current.loading.hide).toBe('function');
      expect(typeof result.current.loading.hideAll).toBe('function');
    });

    it('should have confirm methods', () => {
      const { result } = renderHook(() => useFeedback(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.confirm.show).toBe('function');
      expect(typeof result.current.confirm.close).toBe('function');
    });

    it('should have banner methods', () => {
      const { result } = renderHook(() => useFeedback(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.banner.show).toBe('function');
      expect(typeof result.current.banner.hide).toBe('function');
      expect(typeof result.current.banner.hideAll).toBe('function');
    });

    it('should have drawer methods', () => {
      const { result } = renderHook(() => useFeedback(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.drawer.open).toBe('function');
      expect(typeof result.current.drawer.close).toBe('function');
      expect(typeof result.current.drawer.closeAll).toBe('function');
    });

    it('should have prompt methods', () => {
      const { result } = renderHook(() => useFeedback(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.prompt.show).toBe('function');
      expect(typeof result.current.prompt.text).toBe('function');
      expect(typeof result.current.prompt.textarea).toBe('function');
      expect(typeof result.current.prompt.email).toBe('function');
      expect(typeof result.current.prompt.number).toBe('function');
      expect(typeof result.current.prompt.password).toBe('function');
      expect(typeof result.current.prompt.close).toBe('function');
    });

    it('should have sheet methods', () => {
      const { result } = renderHook(() => useFeedback(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.sheet.open).toBe('function');
      expect(typeof result.current.sheet.showActions).toBe('function');
      expect(typeof result.current.sheet.confirm).toBe('function');
      expect(typeof result.current.sheet.close).toBe('function');
      expect(typeof result.current.sheet.closeAll).toBe('function');
    });

    it('should have connection properties', () => {
      const { result } = renderHook(() => useFeedback(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.connection.isOnline).toBe('boolean');
      expect(typeof result.current.connection.showOffline).toBe('function');
      expect(typeof result.current.connection.showOnline).toBe('function');
      expect(typeof result.current.connection.checkConnection).toBe('function');
      expect(typeof result.current.connection.queueAction).toBe('function');
    });

    it('should have result methods', () => {
      const { result } = renderHook(() => useFeedback(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.result.success).toBe('function');
      expect(typeof result.current.result.error).toBe('function');
      expect(typeof result.current.result.info).toBe('function');
      expect(typeof result.current.result.warning).toBe('function');
      expect(typeof result.current.result.show).toBe('function');
      expect(typeof result.current.result.hide).toBe('function');
      expect(typeof result.current.result.hideAll).toBe('function');
    });
  });

  describe('Error handling', () => {
    it('should throw if used outside FeedbackProvider', () => {
      expect(() => {
        renderHook(() => useFeedback());
      }).toThrow('useFeedbackContext must be used within a FeedbackProvider');
    });
  });

  describe('Options', () => {
    it('should accept connection options', () => {
      const { result } = renderHook(
        () =>
          useFeedback({
            connection: {
              offlineMessage: 'Custom offline message',
            },
          }),
        {
          wrapper: createWrapper(),
        }
      );

      expect(result.current.connection).toBeDefined();
      expect(typeof result.current.connection.isOnline).toBe('boolean');
    });
  });

  describe('Stability', () => {
    it('should maintain functionality across re-renders', () => {
      const { result, rerender } = renderHook(() => useFeedback(), {
        wrapper: createWrapper(),
      });

      // Verify all hooks are present after first render
      expect(result.current.toast).toBeDefined();
      expect(result.current.modal).toBeDefined();

      rerender();

      // Verify all hooks are still functional after re-render
      expect(result.current.toast).toBeDefined();
      expect(result.current.modal).toBeDefined();
      expect(typeof result.current.toast.success).toBe('function');
      expect(typeof result.current.modal.open).toBe('function');
    });
  });
});
