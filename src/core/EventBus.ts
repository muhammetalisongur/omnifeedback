/**
 * Generic Event Bus implementation
 * Provides type-safe pub/sub event system for loose coupling
 */

/**
 * Event handler function type
 */
type EventHandler<T = unknown> = (payload: T) => void;

/**
 * Generic EventBus class for type-safe event handling
 *
 * @typeParam Events - Record mapping event names to payload types
 *
 * @example
 * ```ts
 * interface MyEvents {
 *   'user:login': { userId: string };
 *   'user:logout': undefined;
 * }
 *
 * const bus = new EventBus<MyEvents>();
 * bus.on('user:login', (payload) => console.log(payload.userId));
 * bus.emit('user:login', { userId: '123' });
 * ```
 */
export class EventBus<Events extends object> {
  private handlers = new Map<keyof Events, Set<EventHandler>>();

  /**
   * Subscribe to an event
   *
   * @param event - Event name to subscribe to
   * @param handler - Handler function to call when event is emitted
   * @returns Unsubscribe function
   */
  on<E extends keyof Events>(
    event: E,
    handler: EventHandler<Events[E]>
  ): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }

    const eventHandlers = this.handlers.get(event);
    if (eventHandlers) {
      eventHandlers.add(handler as EventHandler);
    }

    // Return unsubscribe function
    return () => {
      this.off(event, handler);
    };
  }

  /**
   * Subscribe to an event (fires only once)
   *
   * @param event - Event name to subscribe to
   * @param handler - Handler function to call when event is emitted
   * @returns Unsubscribe function
   */
  once<E extends keyof Events>(
    event: E,
    handler: EventHandler<Events[E]>
  ): () => void {
    const wrapper: EventHandler<Events[E]> = (payload: Events[E]) => {
      this.off(event, wrapper);
      handler(payload);
    };

    return this.on(event, wrapper);
  }

  /**
   * Unsubscribe from an event
   *
   * @param event - Event name to unsubscribe from
   * @param handler - Handler function to remove
   */
  off<E extends keyof Events>(
    event: E,
    handler: EventHandler<Events[E]>
  ): void {
    const eventHandlers = this.handlers.get(event);
    if (eventHandlers) {
      eventHandlers.delete(handler as EventHandler);

      // Clean up empty sets
      if (eventHandlers.size === 0) {
        this.handlers.delete(event);
      }
    }
  }

  /**
   * Emit an event to all subscribers
   *
   * @param event - Event name to emit
   * @param payload - Event payload
   */
  emit<E extends keyof Events>(event: E, payload: Events[E]): void {
    const eventHandlers = this.handlers.get(event);
    if (eventHandlers) {
      eventHandlers.forEach((handler) => {
        try {
          handler(payload);
        } catch (error) {
          // Log error but don't break other handlers
          console.error(
            `[EventBus] Error in handler for "${String(event)}":`,
            error
          );
        }
      });
    }
  }

  /**
   * Remove all listeners for all events
   */
  removeAllListeners(): void {
    this.handlers.clear();
  }

  /**
   * Remove all listeners for a specific event
   *
   * @param event - Event name to clear listeners for
   */
  removeListeners<E extends keyof Events>(event: E): void {
    this.handlers.delete(event);
  }

  /**
   * Get the number of listeners for an event
   *
   * @param event - Event name
   * @returns Number of listeners
   */
  listenerCount<E extends keyof Events>(event: E): number {
    return this.handlers.get(event)?.size ?? 0;
  }

  /**
   * Check if an event has any listeners
   *
   * @param event - Event name
   * @returns True if event has listeners
   */
  hasListeners<E extends keyof Events>(event: E): boolean {
    return this.listenerCount(event) > 0;
  }

  /**
   * Get all registered event names
   *
   * @returns Array of event names
   */
  getEventNames(): (keyof Events)[] {
    return Array.from(this.handlers.keys());
  }
}
