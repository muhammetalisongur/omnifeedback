/**
 * useFocusTrap hook unit tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type React from 'react';
import { useRef, type ReactNode } from 'react';
import { useFocusTrap } from './useFocusTrap';

/**
 * Test component that uses useFocusTrap
 */
function FocusTrapContainer({
  enabled = true,
  initialFocus,
  children,
}: {
  enabled?: boolean;
  initialFocus?: string;
  children: ReactNode;
}): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  useFocusTrap(containerRef, { enabled, initialFocus });

  return (
    <div ref={containerRef} data-testid="container">
      {children}
    </div>
  );
}

describe('useFocusTrap', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Initial Focus', () => {
    it('should focus first focusable element on mount', () => {
      render(
        <FocusTrapContainer>
          <button data-testid="first">First</button>
          <button data-testid="second">Second</button>
        </FocusTrapContainer>
      );

      // Advance through requestAnimationFrame
      vi.advanceTimersByTime(16);

      expect(screen.getByTestId('first')).toHaveFocus();
    });

    it('should focus element matching initialFocus selector', () => {
      render(
        <FocusTrapContainer initialFocus="[data-autofocus]">
          <button data-testid="first">First</button>
          <button data-testid="second" data-autofocus>
            Second
          </button>
        </FocusTrapContainer>
      );

      vi.advanceTimersByTime(16);

      expect(screen.getByTestId('second')).toHaveFocus();
    });

    it('should prefer initialFocus selector over first element', () => {
      // Note: React's autoFocus doesn't add [autofocus] attribute to DOM
      // Use initialFocus prop instead for programmatic initial focus
      render(
        <FocusTrapContainer initialFocus="[data-custom-focus]">
          <button data-testid="first">First</button>
          <button data-testid="second" data-custom-focus>
            Second
          </button>
        </FocusTrapContainer>
      );

      vi.advanceTimersByTime(16);

      expect(screen.getByTestId('second')).toHaveFocus();
    });

    it('should focus container if no focusable elements', () => {
      render(
        <FocusTrapContainer>
          <span>No focusable elements</span>
        </FocusTrapContainer>
      );

      vi.advanceTimersByTime(16);

      expect(screen.getByTestId('container')).toHaveFocus();
      expect(screen.getByTestId('container')).toHaveAttribute('tabindex', '-1');
    });
  });

  describe('Tab Navigation', () => {
    it('should trap focus on Tab from last element to first', () => {
      render(
        <FocusTrapContainer>
          <button data-testid="first">First</button>
          <button data-testid="second">Second</button>
          <button data-testid="third">Third</button>
        </FocusTrapContainer>
      );

      vi.advanceTimersByTime(16);

      // Focus last element
      screen.getByTestId('third').focus();

      // Press Tab
      fireEvent.keyDown(screen.getByTestId('container'), {
        key: 'Tab',
        shiftKey: false,
      });

      expect(screen.getByTestId('first')).toHaveFocus();
    });

    it('should trap focus on Shift+Tab from first element to last', () => {
      render(
        <FocusTrapContainer>
          <button data-testid="first">First</button>
          <button data-testid="second">Second</button>
          <button data-testid="third">Third</button>
        </FocusTrapContainer>
      );

      vi.advanceTimersByTime(16);

      // Focus first element
      screen.getByTestId('first').focus();

      // Press Shift+Tab
      fireEvent.keyDown(screen.getByTestId('container'), {
        key: 'Tab',
        shiftKey: true,
      });

      expect(screen.getByTestId('third')).toHaveFocus();
    });

    it('should not trap focus when disabled', () => {
      const { rerender } = render(
        <FocusTrapContainer enabled={false}>
          <button data-testid="first">First</button>
          <button data-testid="second">Second</button>
        </FocusTrapContainer>
      );

      vi.advanceTimersByTime(16);

      // Focus should not be automatically set
      expect(screen.getByTestId('first')).not.toHaveFocus();

      // Re-enable
      rerender(
        <FocusTrapContainer enabled>
          <button data-testid="first">First</button>
          <button data-testid="second">Second</button>
        </FocusTrapContainer>
      );

      vi.advanceTimersByTime(16);

      expect(screen.getByTestId('first')).toHaveFocus();
    });
  });

  describe('Focusable Elements', () => {
    it('should focus first focusable among various element types', () => {
      render(
        <FocusTrapContainer>
          <a href="#" data-testid="link">
            Link
          </a>
          <button data-testid="button">Button</button>
          <input data-testid="input" />
          <select data-testid="select">
            <option>Option</option>
          </select>
          <textarea data-testid="textarea" />
        </FocusTrapContainer>
      );

      vi.advanceTimersByTime(16);

      // First focusable (link) should have focus
      expect(screen.getByTestId('link')).toHaveFocus();
    });

    it('should wrap focus from last to first element on Tab', () => {
      render(
        <FocusTrapContainer>
          <button data-testid="first">First</button>
          <button data-testid="last">Last</button>
        </FocusTrapContainer>
      );

      vi.advanceTimersByTime(16);

      // Manually focus the last element
      screen.getByTestId('last').focus();
      expect(screen.getByTestId('last')).toHaveFocus();

      // Tab from last should wrap to first
      fireEvent.keyDown(screen.getByTestId('container'), { key: 'Tab' });

      expect(screen.getByTestId('first')).toHaveFocus();
    });

    it('should not include disabled elements in focusable list', () => {
      render(
        <FocusTrapContainer>
          <button data-testid="first">First</button>
          <button data-testid="disabled" disabled>
            Disabled
          </button>
          <button data-testid="last">Last</button>
        </FocusTrapContainer>
      );

      vi.advanceTimersByTime(16);

      // Focus first element
      expect(screen.getByTestId('first')).toHaveFocus();

      // Focus last and try Shift+Tab - should go to first (skipping disabled)
      screen.getByTestId('first').focus();

      // Shift+Tab should wrap to last (not disabled)
      fireEvent.keyDown(screen.getByTestId('container'), { key: 'Tab', shiftKey: true });

      expect(screen.getByTestId('last')).toHaveFocus();
    });
  });

  describe('Return Focus', () => {
    it('should return focus to previously focused element on unmount', () => {
      const outsideButton = document.createElement('button');
      outsideButton.setAttribute('data-testid', 'outside');
      document.body.appendChild(outsideButton);
      outsideButton.focus();

      const { unmount } = render(
        <FocusTrapContainer>
          <button data-testid="inside">Inside</button>
        </FocusTrapContainer>
      );

      vi.advanceTimersByTime(16);

      // Focus moved inside
      expect(screen.getByTestId('inside')).toHaveFocus();

      // Unmount
      unmount();

      // Focus should return to outside button
      expect(outsideButton).toHaveFocus();

      // Cleanup
      document.body.removeChild(outsideButton);
    });
  });
});
