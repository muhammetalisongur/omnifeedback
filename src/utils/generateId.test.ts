/**
 * generateId utility unit tests
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { generateId, resetIdCounter, getIdCounter } from './generateId';

describe('generateId', () => {
  beforeEach(() => {
    resetIdCounter();
  });

  it('should generate unique IDs', () => {
    const id1 = generateId();
    const id2 = generateId();
    const id3 = generateId();

    expect(id1).not.toBe(id2);
    expect(id2).not.toBe(id3);
    expect(id1).not.toBe(id3);
  });

  it('should use default prefix "fb"', () => {
    const id = generateId();
    expect(id.startsWith('fb_')).toBe(true);
  });

  it('should use custom prefix', () => {
    const id = generateId('toast');
    expect(id.startsWith('toast_')).toBe(true);
  });

  it('should include incrementing counter', () => {
    const id1 = generateId();
    const id2 = generateId();
    const id3 = generateId();

    // Counter should be at end of ID
    expect(id1.endsWith('_1')).toBe(true);
    expect(id2.endsWith('_2')).toBe(true);
    expect(id3.endsWith('_3')).toBe(true);
  });

  it('should have expected format: prefix_timestamp_random_counter', () => {
    const id = generateId('test');
    const parts = id.split('_');

    expect(parts.length).toBe(4);
    expect(parts[0]).toBe('test');
    // parts[1] is timestamp in base36
    // parts[2] is random string
    expect(parts[3]).toBe('1');
  });

  it('should generate IDs quickly without collision', () => {
    const ids = new Set<string>();
    const count = 1000;

    for (let i = 0; i < count; i++) {
      ids.add(generateId());
    }

    expect(ids.size).toBe(count);
  });
});

describe('resetIdCounter', () => {
  beforeEach(() => {
    resetIdCounter();
  });

  it('should reset counter to 0', () => {
    generateId();
    generateId();
    expect(getIdCounter()).toBe(2);

    resetIdCounter();
    expect(getIdCounter()).toBe(0);
  });
});

describe('getIdCounter', () => {
  beforeEach(() => {
    resetIdCounter();
  });

  it('should return current counter value', () => {
    expect(getIdCounter()).toBe(0);

    generateId();
    expect(getIdCounter()).toBe(1);

    generateId();
    generateId();
    expect(getIdCounter()).toBe(3);
  });
});
