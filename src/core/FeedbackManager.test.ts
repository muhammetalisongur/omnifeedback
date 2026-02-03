/**
 * FeedbackManager unit tests
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { FeedbackManager } from './FeedbackManager';
import { useFeedbackStore } from './FeedbackStore';
import type { IToastOptions, IModalOptions } from './types';

describe('FeedbackManager', () => {
  beforeEach(() => {
    // Reset singleton and timers before each test
    FeedbackManager.resetInstance();
    vi.useFakeTimers();
  });

  afterEach(() => {
    FeedbackManager.resetInstance();
    vi.useRealTimers();
  });

  describe('Singleton pattern', () => {
    it('should return same instance on multiple calls', () => {
      const instance1 = FeedbackManager.getInstance();
      const instance2 = FeedbackManager.getInstance();

      expect(instance1).toBe(instance2);
    });

    it('should create new instance after reset', () => {
      const instance1 = FeedbackManager.getInstance();
      FeedbackManager.resetInstance();
      const instance2 = FeedbackManager.getInstance();

      expect(instance1).not.toBe(instance2);
    });

    it('should report hasInstance correctly', () => {
      expect(FeedbackManager.hasInstance()).toBe(false);

      FeedbackManager.getInstance();
      expect(FeedbackManager.hasInstance()).toBe(true);

      FeedbackManager.resetInstance();
      expect(FeedbackManager.hasInstance()).toBe(false);
    });
  });

  describe('add()', () => {
    it('should add toast item and return id', () => {
      const manager = FeedbackManager.getInstance();
      const options: IToastOptions = { message: 'Test toast' };

      const id = manager.add('toast', options);

      expect(id).toBeTruthy();
      expect(id.startsWith('toast_')).toBe(true);
    });

    it('should use provided id if given', () => {
      const manager = FeedbackManager.getInstance();
      const options: IToastOptions = { id: 'custom-id', message: 'Test toast' };

      const id = manager.add('toast', options);

      expect(id).toBe('custom-id');
    });

    it('should add item to store', () => {
      const manager = FeedbackManager.getInstance();
      const options: IToastOptions = { message: 'Test toast' };

      const id = manager.add('toast', options);

      expect(useFeedbackStore.getState().get(id)).toBeDefined();
    });

    it('should set initial status to pending then entering', () => {
      const manager = FeedbackManager.getInstance();
      const options: IToastOptions = { message: 'Test toast' };

      const id = manager.add('toast', options);

      // After immediate status change to entering
      const item = useFeedbackStore.getState().get(id);
      expect(item?.status).toBe('entering');
    });

    it('should change status to visible after enter animation', () => {
      const manager = FeedbackManager.getInstance();
      const config = manager.getConfig();
      const options: IToastOptions = { message: 'Test toast' };

      const id = manager.add('toast', options);

      // Advance timers past enter animation
      vi.advanceTimersByTime(config.enterAnimationDuration);

      const item = useFeedbackStore.getState().get(id);
      expect(item?.status).toBe('visible');
    });

    it('should emit feedback:added event', () => {
      const manager = FeedbackManager.getInstance();
      const handler = vi.fn();
      manager.on('feedback:added', handler);

      manager.add('toast', { message: 'Test' });

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'toast',
          status: 'pending',
        })
      );
    });
  });

  describe('Auto-dismiss', () => {
    it('should auto-dismiss toast after duration', () => {
      const manager = FeedbackManager.getInstance();
      const config = manager.getConfig();
      const options: IToastOptions = { message: 'Test toast', duration: 3000 };

      const id = manager.add('toast', options);

      // Advance past enter animation + duration + exit animation
      vi.advanceTimersByTime(config.enterAnimationDuration + 3000);

      const item = useFeedbackStore.getState().get(id);
      expect(item?.status).toBe('exiting');
    });

    it('should not auto-dismiss toast with duration 0', () => {
      const manager = FeedbackManager.getInstance();
      const config = manager.getConfig();
      const options: IToastOptions = { message: 'Test toast', duration: 0 };

      const id = manager.add('toast', options);

      // Advance way past default duration
      vi.advanceTimersByTime(config.enterAnimationDuration + 10000);

      const item = useFeedbackStore.getState().get(id);
      expect(item?.status).toBe('visible');
    });

    it('should use default duration when not specified', () => {
      const manager = FeedbackManager.getInstance();
      const config = manager.getConfig();
      const options: IToastOptions = { message: 'Test toast' };

      const id = manager.add('toast', options);

      // Advance past enter animation + default duration
      vi.advanceTimersByTime(config.enterAnimationDuration + config.defaultDuration);

      const item = useFeedbackStore.getState().get(id);
      expect(item?.status).toBe('exiting');
    });
  });

  describe('remove()', () => {
    it('should start exit animation', () => {
      const manager = FeedbackManager.getInstance();
      const config = manager.getConfig();
      const id = manager.add('toast', { message: 'Test' });

      // Wait for visible status
      vi.advanceTimersByTime(config.enterAnimationDuration);

      manager.remove(id);

      const item = useFeedbackStore.getState().get(id);
      expect(item?.status).toBe('exiting');
    });

    it('should remove from store after exit animation', () => {
      const manager = FeedbackManager.getInstance();
      const config = manager.getConfig();
      const id = manager.add('toast', { message: 'Test' });

      vi.advanceTimersByTime(config.enterAnimationDuration);
      manager.remove(id);
      vi.advanceTimersByTime(config.exitAnimationDuration);

      expect(useFeedbackStore.getState().get(id)).toBeUndefined();
    });

    it('should emit feedback:removed event after animation', () => {
      const manager = FeedbackManager.getInstance();
      const config = manager.getConfig();
      const handler = vi.fn();
      manager.on('feedback:removed', handler);

      const id = manager.add('toast', { message: 'Test' });
      vi.advanceTimersByTime(config.enterAnimationDuration);
      manager.remove(id);
      vi.advanceTimersByTime(config.exitAnimationDuration);

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should not remove already exiting item', () => {
      const manager = FeedbackManager.getInstance();
      const config = manager.getConfig();
      const handler = vi.fn();
      manager.on('feedback:statusChanged', handler);

      const id = manager.add('toast', { message: 'Test' });
      vi.advanceTimersByTime(config.enterAnimationDuration);

      manager.remove(id);
      const callsAfterFirstRemove = handler.mock.calls.length;

      manager.remove(id); // Should be no-op

      expect(handler.mock.calls.length).toBe(callsAfterFirstRemove);
    });
  });

  describe('removeAll()', () => {
    it('should remove all items', () => {
      const manager = FeedbackManager.getInstance();
      const config = manager.getConfig();

      manager.add('toast', { message: 'Toast 1' });
      manager.add('toast', { message: 'Toast 2' });
      manager.add('modal', { content: 'Modal' } as IModalOptions);

      vi.advanceTimersByTime(config.enterAnimationDuration);
      manager.removeAll();
      vi.advanceTimersByTime(config.exitAnimationDuration);

      expect(useFeedbackStore.getState().getAll()).toHaveLength(0);
    });

    it('should remove only items of specified type', () => {
      const manager = FeedbackManager.getInstance();
      const config = manager.getConfig();

      manager.add('toast', { message: 'Toast 1' });
      manager.add('toast', { message: 'Toast 2' });
      const modalId = manager.add('modal', { content: 'Modal' } as IModalOptions);

      vi.advanceTimersByTime(config.enterAnimationDuration);
      manager.removeAll('toast');
      vi.advanceTimersByTime(config.exitAnimationDuration);

      expect(useFeedbackStore.getState().getByType('toast')).toHaveLength(0);
      expect(useFeedbackStore.getState().get(modalId)).toBeDefined();
    });

    it('should emit feedback:cleared event', () => {
      const manager = FeedbackManager.getInstance();
      const handler = vi.fn();
      manager.on('feedback:cleared', handler);

      manager.add('toast', { message: 'Test' });
      manager.removeAll();

      expect(handler).toHaveBeenCalledWith({ type: undefined });
    });
  });

  describe('update()', () => {
    it('should update item options', () => {
      const manager = FeedbackManager.getInstance();
      const id = manager.add('toast', { message: 'Original' });

      manager.update(id, { message: 'Updated' });

      const item = useFeedbackStore.getState().get(id);
      expect((item?.options as IToastOptions).message).toBe('Updated');
    });

    it('should emit feedback:updated event', () => {
      const manager = FeedbackManager.getInstance();
      const handler = vi.fn();
      manager.on('feedback:updated', handler);

      const id = manager.add('toast', { message: 'Original' });
      manager.update(id, { message: 'Updated' });

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({ id })
      );
    });

    it('should not throw for non-existent item', () => {
      const manager = FeedbackManager.getInstance();

      expect(() => {
        manager.update('non-existent', { message: 'Test' });
      }).not.toThrow();
    });
  });

  describe('updateStatus()', () => {
    it('should update item status', () => {
      const manager = FeedbackManager.getInstance();
      const id = manager.add('toast', { message: 'Test' });

      manager.updateStatus(id, 'visible');

      const item = useFeedbackStore.getState().get(id);
      expect(item?.status).toBe('visible');
    });

    it('should emit feedback:statusChanged event', () => {
      const manager = FeedbackManager.getInstance();
      const handler = vi.fn();
      manager.on('feedback:statusChanged', handler);

      const id = manager.add('toast', { message: 'Test' });
      // Clear calls from add()
      handler.mockClear();

      manager.updateStatus(id, 'visible');

      expect(handler).toHaveBeenCalledWith({
        id,
        from: 'entering',
        to: 'visible',
      });
    });
  });

  describe('get() / getAll() / getByType()', () => {
    it('should return item by id', () => {
      const manager = FeedbackManager.getInstance();
      const id = manager.add('toast', { message: 'Test' });

      const item = manager.get(id);

      expect(item?.id).toBe(id);
    });

    it('should return undefined for non-existent id', () => {
      const manager = FeedbackManager.getInstance();
      expect(manager.get('non-existent')).toBeUndefined();
    });

    it('should return all items', () => {
      const manager = FeedbackManager.getInstance();
      manager.add('toast', { message: 'Toast 1' });
      manager.add('toast', { message: 'Toast 2' });

      expect(manager.getAll()).toHaveLength(2);
    });

    it('should return items by type', () => {
      const manager = FeedbackManager.getInstance();
      manager.add('toast', { message: 'Toast' });
      manager.add('modal', { content: 'Modal' } as IModalOptions);

      const toasts = manager.getByType('toast');
      expect(toasts).toHaveLength(1);
      expect(toasts[0]?.type).toBe('toast');
    });
  });

  describe('Max visible enforcement', () => {
    it('should remove oldest items when exceeding max visible', () => {
      const manager = FeedbackManager.getInstance({ maxVisible: { toast: 3 } });

      const id1 = manager.add('toast', { message: 'Toast 1' });
      manager.add('toast', { message: 'Toast 2' });
      manager.add('toast', { message: 'Toast 3' });
      const id4 = manager.add('toast', { message: 'Toast 4' });

      // First toast should be exiting immediately after adding 4th toast
      // (enforceMaxVisible calls remove() which sets status to 'exiting')
      const item1 = useFeedbackStore.getState().get(id1);
      expect(item1?.status).toBe('exiting');

      // Fourth toast should be entering initially
      const item4 = useFeedbackStore.getState().get(id4);
      expect(item4?.status).toBe('entering');
    });
  });

  describe('Event subscription', () => {
    it('should allow unsubscribing from events', () => {
      const manager = FeedbackManager.getInstance();
      const handler = vi.fn();

      const unsubscribe = manager.on('feedback:added', handler);
      manager.add('toast', { message: 'First' });
      expect(handler).toHaveBeenCalledTimes(1);

      unsubscribe();
      manager.add('toast', { message: 'Second' });
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should support once() for one-time subscription', () => {
      const manager = FeedbackManager.getInstance();
      const handler = vi.fn();

      manager.once('feedback:added', handler);
      manager.add('toast', { message: 'First' });
      manager.add('toast', { message: 'Second' });

      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('Configuration', () => {
    it('should return configuration', () => {
      const manager = FeedbackManager.getInstance();
      const config = manager.getConfig();

      expect(config.defaultDuration).toBeDefined();
      expect(config.maxVisible).toBeDefined();
    });

    it('should allow configuration updates', () => {
      const manager = FeedbackManager.getInstance();
      manager.updateConfig({ defaultDuration: 10000 });

      expect(manager.getConfig().defaultDuration).toBe(10000);
    });
  });

  describe('destroy()', () => {
    it('should clear all timers', () => {
      const manager = FeedbackManager.getInstance();
      manager.add('toast', { message: 'Test', duration: 5000 });

      manager.destroy();

      // No timers should fire
      vi.advanceTimersByTime(10000);

      // Store should be cleared
      expect(useFeedbackStore.getState().getAll()).toHaveLength(0);
    });

    it('should remove all event listeners', () => {
      const manager = FeedbackManager.getInstance();
      const handler = vi.fn();
      manager.on('feedback:added', handler);

      manager.destroy();

      // Re-create instance and add item
      const newManager = FeedbackManager.getInstance();
      newManager.add('toast', { message: 'Test' });

      // Old handler should not be called
      expect(handler).not.toHaveBeenCalled();
    });
  });
});
