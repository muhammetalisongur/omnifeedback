/**
 * EventBus unit tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventBus } from './EventBus';

interface TestEvents {
  'test:simple': string;
  'test:object': { id: number; name: string };
  'test:void': undefined;
}

describe('EventBus', () => {
  let eventBus: EventBus<TestEvents>;

  beforeEach(() => {
    eventBus = new EventBus<TestEvents>();
  });

  describe('on()', () => {
    it('should subscribe to an event', () => {
      const handler = vi.fn();
      eventBus.on('test:simple', handler);

      eventBus.emit('test:simple', 'hello');

      expect(handler).toHaveBeenCalledWith('hello');
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should allow multiple handlers for same event', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      eventBus.on('test:simple', handler1);
      eventBus.on('test:simple', handler2);

      eventBus.emit('test:simple', 'test');

      expect(handler1).toHaveBeenCalledWith('test');
      expect(handler2).toHaveBeenCalledWith('test');
    });

    it('should return unsubscribe function', () => {
      const handler = vi.fn();
      const unsubscribe = eventBus.on('test:simple', handler);

      eventBus.emit('test:simple', 'first');
      unsubscribe();
      eventBus.emit('test:simple', 'second');

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith('first');
    });
  });

  describe('once()', () => {
    it('should fire only once', () => {
      const handler = vi.fn();
      eventBus.once('test:simple', handler);

      eventBus.emit('test:simple', 'first');
      eventBus.emit('test:simple', 'second');

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith('first');
    });

    it('should return unsubscribe function that works before emit', () => {
      const handler = vi.fn();
      const unsubscribe = eventBus.once('test:simple', handler);

      unsubscribe();
      eventBus.emit('test:simple', 'test');

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('off()', () => {
    it('should unsubscribe from an event', () => {
      const handler = vi.fn();
      eventBus.on('test:simple', handler);

      eventBus.off('test:simple', handler);
      eventBus.emit('test:simple', 'test');

      expect(handler).not.toHaveBeenCalled();
    });

    it('should only remove specific handler', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      eventBus.on('test:simple', handler1);
      eventBus.on('test:simple', handler2);
      eventBus.off('test:simple', handler1);

      eventBus.emit('test:simple', 'test');

      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).toHaveBeenCalledWith('test');
    });

    it('should handle non-existent handler gracefully', () => {
      const handler = vi.fn();
      expect(() => eventBus.off('test:simple', handler)).not.toThrow();
    });
  });

  describe('emit()', () => {
    it('should emit object payloads', () => {
      const handler = vi.fn();
      eventBus.on('test:object', handler);

      eventBus.emit('test:object', { id: 1, name: 'test' });

      expect(handler).toHaveBeenCalledWith({ id: 1, name: 'test' });
    });

    it('should not throw when no handlers exist', () => {
      expect(() => eventBus.emit('test:simple', 'test')).not.toThrow();
    });

    it('should catch handler errors and continue', () => {
      const errorHandler = vi.fn(() => {
        throw new Error('Handler error');
      });
      const normalHandler = vi.fn();
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(vi.fn());

      eventBus.on('test:simple', errorHandler);
      eventBus.on('test:simple', normalHandler);

      eventBus.emit('test:simple', 'test');

      expect(errorHandler).toHaveBeenCalled();
      expect(normalHandler).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('removeAllListeners()', () => {
    it('should remove all listeners for all events', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      eventBus.on('test:simple', handler1);
      eventBus.on('test:object', handler2);

      eventBus.removeAllListeners();

      eventBus.emit('test:simple', 'test');
      eventBus.emit('test:object', { id: 1, name: 'test' });

      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).not.toHaveBeenCalled();
    });
  });

  describe('removeListeners()', () => {
    it('should remove all listeners for specific event', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      const handler3 = vi.fn();

      eventBus.on('test:simple', handler1);
      eventBus.on('test:simple', handler2);
      eventBus.on('test:object', handler3);

      eventBus.removeListeners('test:simple');

      eventBus.emit('test:simple', 'test');
      eventBus.emit('test:object', { id: 1, name: 'test' });

      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).not.toHaveBeenCalled();
      expect(handler3).toHaveBeenCalled();
    });
  });

  describe('listenerCount()', () => {
    it('should return correct listener count', () => {
      expect(eventBus.listenerCount('test:simple')).toBe(0);

      const handler1 = vi.fn();
      const handler2 = vi.fn();

      eventBus.on('test:simple', handler1);
      expect(eventBus.listenerCount('test:simple')).toBe(1);

      eventBus.on('test:simple', handler2);
      expect(eventBus.listenerCount('test:simple')).toBe(2);

      eventBus.off('test:simple', handler1);
      expect(eventBus.listenerCount('test:simple')).toBe(1);
    });
  });

  describe('hasListeners()', () => {
    it('should return true when listeners exist', () => {
      expect(eventBus.hasListeners('test:simple')).toBe(false);

      eventBus.on('test:simple', vi.fn());
      expect(eventBus.hasListeners('test:simple')).toBe(true);
    });
  });

  describe('getEventNames()', () => {
    it('should return all registered event names', () => {
      eventBus.on('test:simple', vi.fn());
      eventBus.on('test:object', vi.fn());

      const names = eventBus.getEventNames();

      expect(names).toContain('test:simple');
      expect(names).toContain('test:object');
      expect(names).toHaveLength(2);
    });

    it('should return empty array when no events registered', () => {
      expect(eventBus.getEventNames()).toEqual([]);
    });
  });
});
