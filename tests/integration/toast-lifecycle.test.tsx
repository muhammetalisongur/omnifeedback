/**
 * Integration tests: Toast Lifecycle
 *
 * Validates the complete toast lifecycle through
 * Manager -> Store -> EventBus flow.
 * Tests status transitions, auto-dismiss, maxVisible limits,
 * dismissAll behavior, and EventBus event emissions.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FeedbackManager } from '@core/FeedbackManager';
import { useFeedbackStore } from '@core/FeedbackStore';
import type { IToastOptions, FeedbackStatus } from '@core/types';

describe('Integration: Toast Lifecycle', () => {
  let manager: FeedbackManager;

  beforeEach(() => {
    FeedbackManager.resetInstance();
    useFeedbackStore.getState().clear();
    vi.useFakeTimers();
    manager = FeedbackManager.getInstance();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    FeedbackManager.resetInstance();
    useFeedbackStore.getState().clear();
  });

  // ==================== MANAGER -> STORE SYNC ====================

  describe('Adding toast via manager updates store', () => {
    it('should add a toast to the store when manager.add() is called', () => {
      const id = manager.add('toast', { message: 'Store sync test' });

      const store = useFeedbackStore.getState();
      const item = store.get(id);

      expect(item).toBeDefined();
      expect(item?.id).toBe(id);
      expect(item?.type).toBe('toast');
      expect((item?.options as IToastOptions).message).toBe('Store sync test');
    });

    it('should reflect createdAt and updatedAt timestamps', () => {
      const beforeAdd = Date.now();
      const id = manager.add('toast', { message: 'Timestamp test' });

      const item = useFeedbackStore.getState().get(id);
      expect(item?.createdAt).toBeGreaterThanOrEqual(beforeAdd);
      expect(item?.updatedAt).toBeGreaterThanOrEqual(beforeAdd);
    });

    it('should be retrievable via manager.get() after adding', () => {
      const id = manager.add('toast', { message: 'Retrieve test' });

      const item = manager.get(id);
      expect(item).toBeDefined();
      expect(item?.id).toBe(id);
    });

    it('should be retrievable via manager.getByType() after adding', () => {
      manager.add('toast', { message: 'Type filter test' });

      const toasts = manager.getByType('toast');
      expect(toasts).toHaveLength(1);
      expect(toasts[0]?.type).toBe('toast');
    });
  });

  // ==================== STATUS LIFECYCLE ====================

  describe('Toast transitions through status lifecycle', () => {
    it('should start with entering status after add (pending is transient)', () => {
      const id = manager.add('toast', { message: 'Lifecycle test' });

      // After add(), scheduleStatusChange with delay 0 runs immediately
      // changing status from pending to entering synchronously
      const item = useFeedbackStore.getState().get(id);
      expect(item?.status).toBe('entering');
    });

    it('should transition from entering to visible after enterAnimationDuration', () => {
      const config = manager.getConfig();
      const id = manager.add('toast', { message: 'Enter animation test' });

      // Verify entering status
      expect(useFeedbackStore.getState().get(id)?.status).toBe('entering');

      // Advance past enter animation duration
      vi.advanceTimersByTime(config.enterAnimationDuration);

      // Should now be visible
      expect(useFeedbackStore.getState().get(id)?.status).toBe('visible');
    });

    it('should transition to exiting after duration elapses', () => {
      const config = manager.getConfig();
      const duration = 3000;
      const id = manager.add('toast', { message: 'Exit test', duration });

      // Advance past enter animation + toast duration
      vi.advanceTimersByTime(config.enterAnimationDuration + duration);

      const item = useFeedbackStore.getState().get(id);
      expect(item?.status).toBe('exiting');
    });

    it('should transition to removed and be cleaned from store after exit animation', () => {
      const config = manager.getConfig();
      const duration = 3000;
      const id = manager.add('toast', { message: 'Full lifecycle test', duration });

      // Advance through entire lifecycle:
      // enter animation + duration (triggers remove) + exit animation
      vi.advanceTimersByTime(
        config.enterAnimationDuration + duration + config.exitAnimationDuration
      );

      // Item should be removed from store entirely
      const item = useFeedbackStore.getState().get(id);
      expect(item).toBeUndefined();
    });

    it('should track full lifecycle: pending -> entering -> visible -> exiting -> removed', () => {
      const config = manager.getConfig();
      const duration = 2000;
      const statusChanges: Array<{ from: FeedbackStatus; to: FeedbackStatus }> = [];

      manager.on('feedback:statusChanged', (payload) => {
        statusChanges.push({ from: payload.from, to: payload.to });
      });

      manager.add('toast', { message: 'Full tracking', duration });

      // At this point: pending -> entering happened synchronously
      expect(statusChanges).toContainEqual({ from: 'pending', to: 'entering' });

      // Advance to visible
      vi.advanceTimersByTime(config.enterAnimationDuration);
      expect(statusChanges).toContainEqual({ from: 'entering', to: 'visible' });

      // Advance to trigger auto-dismiss (exiting)
      vi.advanceTimersByTime(duration);
      expect(statusChanges).toContainEqual({ from: 'visible', to: 'exiting' });

      // Advance past exit animation (removed)
      vi.advanceTimersByTime(config.exitAnimationDuration);
      expect(statusChanges).toContainEqual({ from: 'exiting', to: 'removed' });

      // Verify the complete chain
      const statuses = statusChanges.map((s) => s.to);
      expect(statuses).toContain('entering');
      expect(statuses).toContain('visible');
      expect(statuses).toContain('exiting');
      expect(statuses).toContain('removed');
    });
  });

  // ==================== AUTO-DISMISS ====================

  describe('Auto-dismiss works after configured duration', () => {
    it('should auto-dismiss with default duration', () => {
      const config = manager.getConfig();
      const id = manager.add('toast', { message: 'Default duration test' });

      // Advance past enter animation + default duration
      vi.advanceTimersByTime(config.enterAnimationDuration + config.defaultDuration);

      const item = useFeedbackStore.getState().get(id);
      expect(item?.status).toBe('exiting');
    });

    it('should auto-dismiss with custom duration', () => {
      const config = manager.getConfig();
      const customDuration = 1500;
      const id = manager.add('toast', { message: 'Custom duration', duration: customDuration });

      // Not yet exiting before custom duration
      vi.advanceTimersByTime(config.enterAnimationDuration + customDuration - 100);
      expect(useFeedbackStore.getState().get(id)?.status).toBe('visible');

      // Should be exiting after custom duration
      vi.advanceTimersByTime(200);
      expect(useFeedbackStore.getState().get(id)?.status).toBe('exiting');
    });

    it('should NOT auto-dismiss when duration is 0 (infinite)', () => {
      const config = manager.getConfig();
      const id = manager.add('toast', { message: 'Infinite toast', duration: 0 });

      // Advance well beyond any default duration
      vi.advanceTimersByTime(config.enterAnimationDuration + 60000);

      const item = useFeedbackStore.getState().get(id);
      expect(item?.status).toBe('visible');
    });

    it('should auto-dismiss alerts as well', () => {
      const config = manager.getConfig();
      const duration = 2000;
      const id = manager.add('alert', { message: 'Alert auto-dismiss', duration });

      vi.advanceTimersByTime(config.enterAnimationDuration + duration);

      const item = useFeedbackStore.getState().get(id);
      expect(item?.status).toBe('exiting');
    });
  });

  // ==================== MAX VISIBLE LIMIT ====================

  describe('Multiple toasts respect maxVisible limit', () => {
    it('should enforce maxVisible by removing oldest toast', () => {
      // Create manager with maxVisible of 3 for toasts
      FeedbackManager.resetInstance();
      manager = FeedbackManager.getInstance({ maxVisible: { toast: 3 } });

      const id1 = manager.add('toast', { message: 'Toast 1' });
      const id2 = manager.add('toast', { message: 'Toast 2' });
      const id3 = manager.add('toast', { message: 'Toast 3' });

      // All three should be in store
      expect(useFeedbackStore.getState().get(id1)).toBeDefined();
      expect(useFeedbackStore.getState().get(id2)).toBeDefined();
      expect(useFeedbackStore.getState().get(id3)).toBeDefined();

      // Adding a 4th toast should trigger removal of the oldest
      const id4 = manager.add('toast', { message: 'Toast 4' });

      // First toast should be exiting (enforceMaxVisible)
      const item1 = useFeedbackStore.getState().get(id1);
      expect(item1?.status).toBe('exiting');

      // Fourth toast should exist
      const item4 = useFeedbackStore.getState().get(id4);
      expect(item4).toBeDefined();
      expect(item4?.status).toBe('entering');
    });

    it('should allow different maxVisible per feedback type', () => {
      FeedbackManager.resetInstance();
      manager = FeedbackManager.getInstance({
        maxVisible: { toast: 2, loading: 1 },
      });

      // Add 3 toasts - only 2 should remain active
      manager.add('toast', { message: 'Toast A' });
      manager.add('toast', { message: 'Toast B' });
      const toast3Id = manager.add('toast', { message: 'Toast C' });

      const activeToasts = useFeedbackStore
        .getState()
        .getByType('toast')
        .filter((t) => t.status !== 'exiting' && t.status !== 'removed');

      expect(activeToasts.length).toBeLessThanOrEqual(2);
      expect(useFeedbackStore.getState().get(toast3Id)).toBeDefined();
    });
  });

  // ==================== DISMISS ALL ====================

  describe('Toast dismissAll removes all toasts', () => {
    it('should set all toasts to exiting status', () => {
      const config = manager.getConfig();

      manager.add('toast', { message: 'Toast 1' });
      manager.add('toast', { message: 'Toast 2' });
      manager.add('toast', { message: 'Toast 3' });

      // Wait for visible status
      vi.advanceTimersByTime(config.enterAnimationDuration);

      manager.removeAll('toast');

      const toasts = useFeedbackStore.getState().getByType('toast');
      expect(toasts.every((t) => t.status === 'exiting')).toBe(true);
    });

    it('should remove all toasts from store after exit animation', () => {
      const config = manager.getConfig();

      manager.add('toast', { message: 'Toast A' });
      manager.add('toast', { message: 'Toast B' });

      vi.advanceTimersByTime(config.enterAnimationDuration);
      manager.removeAll('toast');
      vi.advanceTimersByTime(config.exitAnimationDuration);

      const toasts = useFeedbackStore.getState().getByType('toast');
      expect(toasts).toHaveLength(0);
    });

    it('should not affect other feedback types when dismissing toasts', () => {
      const config = manager.getConfig();

      manager.add('toast', { message: 'Toast to dismiss' });
      const loadingId = manager.add('loading', { message: 'Loading to keep' });

      vi.advanceTimersByTime(config.enterAnimationDuration);
      manager.removeAll('toast');
      vi.advanceTimersByTime(config.exitAnimationDuration);

      // Toast should be gone
      expect(useFeedbackStore.getState().getByType('toast')).toHaveLength(0);

      // Loading should still be there
      expect(useFeedbackStore.getState().get(loadingId)).toBeDefined();
    });
  });

  // ==================== EVENTBUS EMISSIONS ====================

  describe('EventBus emits correct events during lifecycle', () => {
    it('should emit feedback:added when toast is created', () => {
      const addedHandler = vi.fn();
      manager.on('feedback:added', addedHandler);

      manager.add('toast', { message: 'Event test' });

      expect(addedHandler).toHaveBeenCalledTimes(1);
      expect(addedHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'toast',
          status: 'pending',
        })
      );
    });

    it('should emit feedback:statusChanged for each transition', () => {
      const config = manager.getConfig();
      const statusHandler = vi.fn();
      manager.on('feedback:statusChanged', statusHandler);

      const id = manager.add('toast', { message: 'Status event test', duration: 1000 });

      // pending -> entering (synchronous, delay 0)
      expect(statusHandler).toHaveBeenCalledWith(
        expect.objectContaining({ id, from: 'pending', to: 'entering' })
      );

      // entering -> visible
      vi.advanceTimersByTime(config.enterAnimationDuration);
      expect(statusHandler).toHaveBeenCalledWith(
        expect.objectContaining({ id, from: 'entering', to: 'visible' })
      );

      // visible -> exiting (auto-dismiss)
      vi.advanceTimersByTime(1000);
      expect(statusHandler).toHaveBeenCalledWith(
        expect.objectContaining({ id, from: 'visible', to: 'exiting' })
      );

      // exiting -> removed
      vi.advanceTimersByTime(config.exitAnimationDuration);
      expect(statusHandler).toHaveBeenCalledWith(
        expect.objectContaining({ id, from: 'exiting', to: 'removed' })
      );
    });

    it('should emit feedback:removed after full removal', () => {
      const config = manager.getConfig();
      const removedHandler = vi.fn();
      manager.on('feedback:removed', removedHandler);

      const id = manager.add('toast', { message: 'Removal event test' });

      vi.advanceTimersByTime(config.enterAnimationDuration);
      manager.remove(id);
      vi.advanceTimersByTime(config.exitAnimationDuration);

      expect(removedHandler).toHaveBeenCalledTimes(1);
      expect(removedHandler).toHaveBeenCalledWith(
        expect.objectContaining({ id, type: 'toast' })
      );
    });

    it('should emit feedback:cleared when removeAll is called', () => {
      const clearedHandler = vi.fn();
      manager.on('feedback:cleared', clearedHandler);

      manager.add('toast', { message: 'Clear event test' });
      manager.removeAll('toast');

      expect(clearedHandler).toHaveBeenCalledWith({ type: 'toast' });
    });

    it('should emit feedback:updated when toast is updated', () => {
      const updatedHandler = vi.fn();
      manager.on('feedback:updated', updatedHandler);

      const id = manager.add('toast', { message: 'Original message' });
      manager.update(id, { message: 'Updated message' });

      expect(updatedHandler).toHaveBeenCalledTimes(1);
      expect(updatedHandler).toHaveBeenCalledWith(
        expect.objectContaining({ id })
      );
    });

    it('should allow unsubscribing from events', () => {
      const handler = vi.fn();
      const unsubscribe = manager.on('feedback:added', handler);

      manager.add('toast', { message: 'First' });
      expect(handler).toHaveBeenCalledTimes(1);

      unsubscribe();
      manager.add('toast', { message: 'Second' });
      expect(handler).toHaveBeenCalledTimes(1); // Should NOT increase
    });
  });
});
