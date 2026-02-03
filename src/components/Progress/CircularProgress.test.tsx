/**
 * CircularProgress component unit tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CircularProgress } from './CircularProgress';

describe('CircularProgress', () => {
  describe('Rendering', () => {
    it('should render progress indicator', () => {
      render(<CircularProgress value={50} testId="progress" />);
      expect(screen.getByTestId('progress')).toBeInTheDocument();
    });

    it('should render SVG', () => {
      render(<CircularProgress value={50} testId="progress" />);
      expect(screen.getByTestId('progress-svg')).toBeInTheDocument();
    });

    it('should render track and fill circles', () => {
      render(<CircularProgress value={50} testId="progress" />);
      expect(screen.getByTestId('progress-track')).toBeInTheDocument();
      expect(screen.getByTestId('progress-fill')).toBeInTheDocument();
    });

    it('should have role="progressbar" on SVG', () => {
      render(<CircularProgress value={50} testId="progress" />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  describe('Value and Percentage', () => {
    it('should show percentage when showPercentage is true', () => {
      render(<CircularProgress value={75} showPercentage testId="progress" />);
      expect(screen.getByTestId('progress-percentage')).toHaveTextContent('75%');
    });

    it('should not show percentage when showPercentage is false', () => {
      render(<CircularProgress value={75} testId="progress" />);
      expect(screen.queryByTestId('progress-percentage')).not.toBeInTheDocument();
    });

    it('should calculate percentage based on max', () => {
      render(<CircularProgress value={25} max={50} showPercentage testId="progress" />);
      expect(screen.getByTestId('progress-percentage')).toHaveTextContent('50%');
    });

    it('should clamp percentage to 0-100', () => {
      render(<CircularProgress value={150} showPercentage testId="progress" />);
      expect(screen.getByTestId('progress-percentage')).toHaveTextContent('100%');
    });
  });

  describe('Label', () => {
    it('should render label when provided', () => {
      render(<CircularProgress value={50} label="Loading..." testId="progress" />);
      expect(screen.getByTestId('progress-label')).toHaveTextContent('Loading...');
    });

    it('should not render label when not provided', () => {
      render(<CircularProgress value={50} testId="progress" />);
      expect(screen.queryByTestId('progress-label')).not.toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should apply info variant by default', () => {
      render(<CircularProgress value={50} testId="progress" />);
      const fill = screen.getByTestId('progress-fill');
      expect(fill).toHaveClass('stroke-blue-500');
    });

    it('should apply success variant', () => {
      render(<CircularProgress value={50} variant="success" testId="progress" />);
      const fill = screen.getByTestId('progress-fill');
      expect(fill).toHaveClass('stroke-green-500');
    });

    it('should apply error variant', () => {
      render(<CircularProgress value={50} variant="error" testId="progress" />);
      const fill = screen.getByTestId('progress-fill');
      expect(fill).toHaveClass('stroke-red-500');
    });

    it('should apply warning variant', () => {
      render(<CircularProgress value={50} variant="warning" testId="progress" />);
      const fill = screen.getByTestId('progress-fill');
      expect(fill).toHaveClass('stroke-yellow-500');
    });
  });

  describe('Sizes', () => {
    it('should apply md size by default', () => {
      render(<CircularProgress value={50} testId="progress" />);
      const svg = screen.getByTestId('progress-svg');
      expect(svg).toHaveAttribute('width', '48');
      expect(svg).toHaveAttribute('height', '48');
    });

    it('should apply sm size', () => {
      render(<CircularProgress value={50} size="sm" testId="progress" />);
      const svg = screen.getByTestId('progress-svg');
      expect(svg).toHaveAttribute('width', '32');
      expect(svg).toHaveAttribute('height', '32');
    });

    it('should apply lg size', () => {
      render(<CircularProgress value={50} size="lg" testId="progress" />);
      const svg = screen.getByTestId('progress-svg');
      expect(svg).toHaveAttribute('width', '64');
      expect(svg).toHaveAttribute('height', '64');
    });
  });

  describe('Indeterminate Mode', () => {
    it('should apply spin animation in indeterminate mode', () => {
      render(<CircularProgress value={0} indeterminate testId="progress" />);
      const svg = screen.getByTestId('progress-svg');
      expect(svg).toHaveClass('animate-spin');
    });

    it('should set data-indeterminate attribute', () => {
      render(<CircularProgress value={0} indeterminate testId="progress" />);
      const fill = screen.getByTestId('progress-fill');
      expect(fill).toHaveAttribute('data-indeterminate', 'true');
    });

    it('should not show percentage in indeterminate mode', () => {
      render(<CircularProgress value={50} indeterminate showPercentage testId="progress" />);
      expect(screen.queryByTestId('progress-percentage')).not.toBeInTheDocument();
    });
  });

  describe('Custom Color', () => {
    it('should apply custom stroke color', () => {
      render(<CircularProgress value={50} color="#ff0000" testId="progress" />);
      const fill = screen.getByTestId('progress-fill');
      // Check for color in style (format may vary between test environments)
      const style = fill.getAttribute('style') ?? '';
      expect(style).toContain('stroke');
      expect(style.includes('#ff0000') || style.includes('rgb(255, 0, 0)')).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have aria-valuenow', () => {
      render(<CircularProgress value={50} testId="progress" />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50');
    });

    it('should have aria-valuemin and aria-valuemax', () => {
      render(<CircularProgress value={50} testId="progress" />);
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).toHaveAttribute('aria-valuemin', '0');
      expect(progressbar).toHaveAttribute('aria-valuemax', '100');
    });

    it('should use custom max for aria-valuemax', () => {
      render(<CircularProgress value={25} max={50} testId="progress" />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '50');
    });

    it('should have aria-label', () => {
      render(<CircularProgress value={50} label="Processing" testId="progress" />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label', 'Processing');
    });

    it('should not have aria-valuenow in indeterminate mode', () => {
      render(<CircularProgress value={50} indeterminate testId="progress" />);
      expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow');
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      render(<CircularProgress value={50} className="custom-class" testId="progress" />);
      expect(screen.getByTestId('progress')).toHaveClass('custom-class');
    });

    it('should apply custom style', () => {
      render(<CircularProgress value={50} style={{ margin: '10px' }} testId="progress" />);
      const progress = screen.getByTestId('progress');
      expect(progress.getAttribute('style')).toContain('margin');
    });
  });
});
