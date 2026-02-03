/**
 * Loading component unit tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Loading } from './Loading';
import type { FeedbackStatus } from '../../core/types';

describe('Loading', () => {
  const defaultProps = {
    status: 'visible' as FeedbackStatus,
  };

  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<Loading {...defaultProps} testId="loading" />);

      expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('should render spinner', () => {
      const { container } = render(<Loading {...defaultProps} />);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should render message when provided', () => {
      render(<Loading {...defaultProps} message="Loading data..." />);

      expect(screen.getByText('Loading data...')).toBeInTheDocument();
    });

    it('should not render message when not provided', () => {
      render(<Loading {...defaultProps} testId="loading" />);

      const loading = screen.getByTestId('loading');
      const spans = loading.querySelectorAll('span:not(.sr-only)');
      // Should only have sr-only span
      expect(spans).toHaveLength(0);
    });
  });

  describe('Size Variants', () => {
    it('should apply sm size', () => {
      const { container } = render(<Loading {...defaultProps} size="sm" />);

      const spinnerWrapper = container.querySelector('[role="presentation"]');
      const spinner = spinnerWrapper?.querySelector('svg, div');
      expect(spinner).toHaveClass('w-4');
      expect(spinner).toHaveClass('h-4');
    });

    it('should apply md size by default', () => {
      const { container } = render(<Loading {...defaultProps} />);

      const spinnerWrapper = container.querySelector('[role="presentation"]');
      const spinner = spinnerWrapper?.querySelector('svg, div');
      expect(spinner).toHaveClass('w-8');
      expect(spinner).toHaveClass('h-8');
    });

    it('should apply lg size', () => {
      const { container } = render(<Loading {...defaultProps} size="lg" />);

      const spinnerWrapper = container.querySelector('[role="presentation"]');
      const spinner = spinnerWrapper?.querySelector('svg, div');
      expect(spinner).toHaveClass('w-12');
      expect(spinner).toHaveClass('h-12');
    });
  });

  describe('Color Variants', () => {
    it('should apply primary variant by default', () => {
      const { container } = render(<Loading {...defaultProps} />);

      const spinnerWrapper = container.querySelector('[role="presentation"]');
      const spinner = spinnerWrapper?.querySelector('svg, div');
      expect(spinner).toHaveClass('text-blue-600');
    });

    it('should apply secondary variant', () => {
      const { container } = render(<Loading {...defaultProps} variant="secondary" />);

      const spinnerWrapper = container.querySelector('[role="presentation"]');
      const spinner = spinnerWrapper?.querySelector('svg, div');
      expect(spinner).toHaveClass('text-gray-600');
    });

    it('should apply white variant', () => {
      const { container } = render(<Loading {...defaultProps} variant="white" />);

      const spinnerWrapper = container.querySelector('[role="presentation"]');
      const spinner = spinnerWrapper?.querySelector('svg, div');
      expect(spinner).toHaveClass('text-white');
    });
  });

  describe('Spinner Types', () => {
    it('should render default spinner type', () => {
      const { container } = render(<Loading {...defaultProps} />);

      const svg = container.querySelector('[data-spinner="default"]');
      expect(svg).toBeInTheDocument();
    });

    it('should render dots spinner type', () => {
      const { container } = render(<Loading {...defaultProps} spinner="dots" />);

      const dots = container.querySelector('[data-spinner="dots"]');
      expect(dots).toBeInTheDocument();
    });

    it('should render bars spinner type', () => {
      const { container } = render(<Loading {...defaultProps} spinner="bars" />);

      const bars = container.querySelector('[data-spinner="bars"]');
      expect(bars).toBeInTheDocument();
    });

    it('should render ring spinner type', () => {
      const { container } = render(<Loading {...defaultProps} spinner="ring" />);

      const ring = container.querySelector('[data-spinner="ring"]');
      expect(ring).toBeInTheDocument();
    });

    it('should render pulse spinner type', () => {
      const { container } = render(<Loading {...defaultProps} spinner="pulse" />);

      const pulse = container.querySelector('[data-spinner="pulse"]');
      expect(pulse).toBeInTheDocument();
    });
  });

  describe('Status Animation', () => {
    it('should be visible when status is "visible"', () => {
      render(<Loading status="visible" testId="loading" />);

      const loading = screen.getByTestId('loading');
      expect(loading).toHaveClass('opacity-100');
      expect(loading).not.toHaveClass('opacity-0');
    });

    it('should be visible when status is "entering"', () => {
      render(<Loading status="entering" testId="loading" />);

      const loading = screen.getByTestId('loading');
      expect(loading).toHaveClass('opacity-100');
    });

    it('should be hidden when status is "exiting"', () => {
      render(<Loading status="exiting" testId="loading" />);

      const loading = screen.getByTestId('loading');
      expect(loading).toHaveClass('opacity-0');
    });

    it('should be hidden when status is "pending"', () => {
      render(<Loading status="pending" testId="loading" />);

      const loading = screen.getByTestId('loading');
      expect(loading).toHaveClass('opacity-0');
    });

    it('should have data-status attribute', () => {
      render(<Loading status="visible" testId="loading" />);

      const loading = screen.getByTestId('loading');
      expect(loading).toHaveAttribute('data-status', 'visible');
    });
  });

  describe('Accessibility', () => {
    it('should have role="status"', () => {
      render(<Loading {...defaultProps} testId="loading" />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should have aria-live="polite"', () => {
      render(<Loading {...defaultProps} testId="loading" />);

      const loading = screen.getByTestId('loading');
      expect(loading).toHaveAttribute('aria-live', 'polite');
    });

    it('should have aria-busy="true"', () => {
      render(<Loading {...defaultProps} testId="loading" />);

      const loading = screen.getByTestId('loading');
      expect(loading).toHaveAttribute('aria-busy', 'true');
    });

    it('should have screen reader text', () => {
      render(<Loading {...defaultProps} />);

      const srText = screen.getByText('Loading');
      expect(srText).toBeInTheDocument();
      expect(srText).toHaveClass('sr-only');
    });

    it('should include message in screen reader text', () => {
      render(<Loading {...defaultProps} message="Processing..." />);

      const srText = screen.getByText('Loading: Processing...');
      expect(srText).toBeInTheDocument();
      expect(srText).toHaveClass('sr-only');
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      render(<Loading {...defaultProps} className="custom-class" testId="loading" />);

      const loading = screen.getByTestId('loading');
      expect(loading).toHaveClass('custom-class');
    });

    it('should apply custom style', () => {
      render(
        <Loading
          {...defaultProps}
          style={{ backgroundColor: 'red' }}
          testId="loading"
        />
      );

      const loading = screen.getByTestId('loading');
      // Use getAttribute for style check due to happy-dom limitations with toHaveStyle
      expect(loading.getAttribute('style')).toContain('background-color');
    });
  });

  describe('Test ID', () => {
    it('should apply testId', () => {
      render(<Loading {...defaultProps} testId="my-loading" />);

      expect(screen.getByTestId('my-loading')).toBeInTheDocument();
    });
  });
});
