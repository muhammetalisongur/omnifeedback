/**
 * Unique ID generator for feedback items
 * Generates collision-resistant IDs using timestamp, random string, and counter
 */

let counter = 0;

/**
 * Generate a unique ID for feedback items
 * Format: {prefix}_{timestamp}_{random}_{counter}
 *
 * @param prefix - ID prefix (default: 'fb')
 * @returns Unique string ID
 *
 * @example
 * ```ts
 * generateId('toast');  // "toast_lxyz123_a1b2c_1"
 * generateId();         // "fb_lxyz124_d3e4f_2"
 * ```
 */
export function generateId(prefix = 'fb'): string {
  counter += 1;
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `${prefix}_${timestamp}_${random}_${String(counter)}`;
}

/**
 * Reset the counter (for testing purposes only)
 * @internal
 */
export function resetIdCounter(): void {
  counter = 0;
}

/**
 * Get current counter value (for testing purposes only)
 * @internal
 */
export function getIdCounter(): number {
  return counter;
}
