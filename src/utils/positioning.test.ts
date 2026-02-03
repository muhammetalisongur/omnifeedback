/**
 * Positioning utility unit tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  calculatePosition,
  getArrowStyles,
  getOppositePlacement,
  wouldOverflow,
} from './positioning';

describe('positioning utility', () => {
  // Mock viewport size
  const mockViewport = { width: 1024, height: 768 };

  beforeEach(() => {
    // Mock window dimensions
    vi.stubGlobal('innerWidth', mockViewport.width);
    vi.stubGlobal('innerHeight', mockViewport.height);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('calculatePosition', () => {
    // Helper to create mock elements
    const createMockElement = (rect: Partial<DOMRect>): HTMLElement => {
      const defaultRect: DOMRect = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      };

      return {
        getBoundingClientRect: () => ({ ...defaultRect, ...rect }),
      } as HTMLElement;
    };

    it('should calculate top placement correctly', () => {
      const target = createMockElement({
        top: 200,
        left: 100,
        right: 200,
        bottom: 240,
        width: 100,
        height: 40,
      });

      const popover = createMockElement({
        width: 200,
        height: 100,
      });

      const result = calculatePosition(target, popover, 'top', 8);

      expect(result.placement).toBe('top');
      // top = targetTop - popoverHeight - offset = 200 - 100 - 8 = 92
      expect(result.position.top).toBe(92);
      // left = targetLeft + (targetWidth - popoverWidth) / 2 = 100 + (100 - 200) / 2 = 50
      expect(result.position.left).toBe(50);
    });

    it('should calculate bottom placement correctly', () => {
      const target = createMockElement({
        top: 200,
        left: 100,
        right: 200,
        bottom: 240,
        width: 100,
        height: 40,
      });

      const popover = createMockElement({
        width: 200,
        height: 100,
      });

      const result = calculatePosition(target, popover, 'bottom', 8);

      expect(result.placement).toBe('bottom');
      // top = targetBottom + offset = 240 + 8 = 248
      expect(result.position.top).toBe(248);
    });

    it('should calculate left placement correctly', () => {
      const target = createMockElement({
        top: 200,
        left: 300,
        right: 400,
        bottom: 240,
        width: 100,
        height: 40,
      });

      const popover = createMockElement({
        width: 200,
        height: 100,
      });

      const result = calculatePosition(target, popover, 'left', 8);

      expect(result.placement).toBe('left');
      // left = targetLeft - popoverWidth - offset = 300 - 200 - 8 = 92
      expect(result.position.left).toBe(92);
    });

    it('should calculate right placement correctly', () => {
      const target = createMockElement({
        top: 200,
        left: 100,
        right: 200,
        bottom: 240,
        width: 100,
        height: 40,
      });

      const popover = createMockElement({
        width: 200,
        height: 100,
      });

      const result = calculatePosition(target, popover, 'right', 8);

      expect(result.placement).toBe('right');
      // left = targetRight + offset = 200 + 8 = 208
      expect(result.position.left).toBe(208);
    });

    it('should handle top-start placement', () => {
      const target = createMockElement({
        top: 200,
        left: 100,
        right: 200,
        bottom: 240,
        width: 100,
        height: 40,
      });

      const popover = createMockElement({
        width: 200,
        height: 100,
      });

      const result = calculatePosition(target, popover, 'top-start', 8);

      expect(result.placement).toBe('top-start');
      // left should align with target left
      expect(result.position.left).toBe(100);
    });

    it('should handle top-end placement', () => {
      const target = createMockElement({
        top: 200,
        left: 100,
        right: 200,
        bottom: 240,
        width: 100,
        height: 40,
      });

      const popover = createMockElement({
        width: 200,
        height: 100,
      });

      const result = calculatePosition(target, popover, 'top-end', 8);

      expect(result.placement).toBe('top-end');
      // left should align with target right - popover width
      expect(result.position.left).toBe(8); // Constrained to padding
    });

    it('should flip from top to bottom when insufficient space', () => {
      const target = createMockElement({
        top: 50, // Close to top edge
        left: 100,
        right: 200,
        bottom: 90,
        width: 100,
        height: 40,
      });

      const popover = createMockElement({
        width: 200,
        height: 100,
      });

      const result = calculatePosition(target, popover, 'top', 8);

      // Should flip to bottom because top would be negative
      expect(result.placement).toBe('bottom');
    });

    it('should flip from bottom to top when insufficient space', () => {
      const target = createMockElement({
        top: 650,
        left: 100,
        right: 200,
        bottom: 690,
        width: 100,
        height: 40,
      });

      const popover = createMockElement({
        width: 200,
        height: 100,
      });

      const result = calculatePosition(target, popover, 'bottom', 8);

      // Should flip to top because bottom would exceed viewport
      expect(result.placement).toBe('top');
    });

    it('should constrain position to viewport with padding', () => {
      const target = createMockElement({
        top: 200,
        left: 0, // At left edge
        right: 50,
        bottom: 240,
        width: 50,
        height: 40,
      });

      const popover = createMockElement({
        width: 200,
        height: 100,
      });

      const result = calculatePosition(target, popover, 'top', 8);

      // Left should be constrained to padding (8)
      expect(result.position.left).toBeGreaterThanOrEqual(8);
    });
  });

  describe('getArrowStyles', () => {
    it('should return correct styles for top placement', () => {
      const styles = getArrowStyles('top');

      expect(styles.className).toContain('bottom-0');
      expect(styles.className).toContain('left-1/2');
      expect(styles.style).toHaveProperty('bottom', -4);
    });

    it('should return correct styles for bottom placement', () => {
      const styles = getArrowStyles('bottom');

      expect(styles.className).toContain('top-0');
      expect(styles.className).toContain('left-1/2');
      expect(styles.style).toHaveProperty('top', -4);
    });

    it('should return correct styles for left placement', () => {
      const styles = getArrowStyles('left');

      expect(styles.className).toContain('right-0');
      expect(styles.className).toContain('top-1/2');
      expect(styles.style).toHaveProperty('right', -4);
    });

    it('should return correct styles for right placement', () => {
      const styles = getArrowStyles('right');

      expect(styles.className).toContain('left-0');
      expect(styles.className).toContain('top-1/2');
      expect(styles.style).toHaveProperty('left', -4);
    });

    it('should handle placement with suffix', () => {
      const styles = getArrowStyles('top-start');

      // Should use base placement styles
      expect(styles.className).toContain('bottom-0');
    });
  });

  describe('getOppositePlacement', () => {
    it('should return opposite for top', () => {
      expect(getOppositePlacement('top')).toBe('bottom');
    });

    it('should return opposite for bottom', () => {
      expect(getOppositePlacement('bottom')).toBe('top');
    });

    it('should return opposite for left', () => {
      expect(getOppositePlacement('left')).toBe('right');
    });

    it('should return opposite for right', () => {
      expect(getOppositePlacement('right')).toBe('left');
    });

    it('should preserve suffix when getting opposite', () => {
      expect(getOppositePlacement('top-start')).toBe('bottom-start');
      expect(getOppositePlacement('top-end')).toBe('bottom-end');
      expect(getOppositePlacement('left-start')).toBe('right-start');
    });
  });

  describe('wouldOverflow', () => {
    const createMockRect = (rect: Partial<DOMRect>): DOMRect => {
      const defaultRect: DOMRect = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      };
      return { ...defaultRect, ...rect } as DOMRect;
    };

    it('should detect top overflow', () => {
      const targetRect = createMockRect({ top: 50 });
      const popoverRect = createMockRect({ height: 100 });

      expect(wouldOverflow(targetRect, popoverRect, 'top', 8)).toBe(true);
    });

    it('should detect bottom overflow', () => {
      const targetRect = createMockRect({ bottom: 700 });
      const popoverRect = createMockRect({ height: 100 });

      expect(wouldOverflow(targetRect, popoverRect, 'bottom', 8)).toBe(true);
    });

    it('should detect left overflow', () => {
      const targetRect = createMockRect({ left: 50 });
      const popoverRect = createMockRect({ width: 200 });

      expect(wouldOverflow(targetRect, popoverRect, 'left', 8)).toBe(true);
    });

    it('should detect right overflow', () => {
      const targetRect = createMockRect({ right: 900 });
      const popoverRect = createMockRect({ width: 200 });

      expect(wouldOverflow(targetRect, popoverRect, 'right', 8)).toBe(true);
    });

    it('should return false when no overflow', () => {
      const targetRect = createMockRect({
        top: 200,
        bottom: 240,
        left: 400,
        right: 500,
      });
      const popoverRect = createMockRect({ width: 200, height: 100 });

      expect(wouldOverflow(targetRect, popoverRect, 'top', 8)).toBe(false);
      expect(wouldOverflow(targetRect, popoverRect, 'bottom', 8)).toBe(false);
      expect(wouldOverflow(targetRect, popoverRect, 'left', 8)).toBe(false);
      expect(wouldOverflow(targetRect, popoverRect, 'right', 8)).toBe(false);
    });
  });
});
