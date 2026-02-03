/**
 * @vitest-environment jsdom
 */

/**
 * Result component unit tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Result } from './Result';

describe('Result', () => {
  describe('Status Types', () => {
    it('should render success status', () => {
      render(<Result status="success" title="Success!" testId="result" />);

      const result = screen.getByTestId('result');
      expect(result).toBeInTheDocument();
      expect(result).toHaveAttribute('data-result-status', 'success');
    });

    it('should render error status', () => {
      render(<Result status="error" title="Error!" testId="result" />);

      const result = screen.getByTestId('result');
      expect(result).toHaveAttribute('data-result-status', 'error');
    });

    it('should render info status', () => {
      render(<Result status="info" title="Info" testId="result" />);

      const result = screen.getByTestId('result');
      expect(result).toHaveAttribute('data-result-status', 'info');
    });

    it('should render warning status', () => {
      render(<Result status="warning" title="Warning" testId="result" />);

      const result = screen.getByTestId('result');
      expect(result).toHaveAttribute('data-result-status', 'warning');
    });

    it('should render 404 status', () => {
      render(<Result status="404" title="Not Found" testId="result" />);

      const result = screen.getByTestId('result');
      expect(result).toHaveAttribute('data-result-status', '404');
    });

    it('should render 403 status', () => {
      render(<Result status="403" title="Forbidden" testId="result" />);

      const result = screen.getByTestId('result');
      expect(result).toHaveAttribute('data-result-status', '403');
    });

    it('should render 500 status', () => {
      render(<Result status="500" title="Server Error" testId="result" />);

      const result = screen.getByTestId('result');
      expect(result).toHaveAttribute('data-result-status', '500');
    });
  });

  describe('Content', () => {
    it('should render title', () => {
      render(<Result status="success" title="Test Title" testId="result" />);

      const title = screen.getByTestId('result-title');
      expect(title).toHaveTextContent('Test Title');
    });

    it('should render description', () => {
      render(
        <Result
          status="success"
          title="Title"
          description="Test description text"
          testId="result"
        />
      );

      const description = screen.getByTestId('result-description');
      expect(description).toHaveTextContent('Test description text');
    });

    it('should not render description when not provided', () => {
      render(<Result status="success" title="Title" testId="result" />);

      expect(screen.queryByTestId('result-description')).not.toBeInTheDocument();
    });

    it('should render custom icon', () => {
      render(
        <Result
          status="success"
          title="Title"
          icon={<span data-testid="custom-icon">Custom</span>}
          testId="result"
        />
      );

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('should render default icon when custom icon not provided', () => {
      render(<Result status="success" title="Title" testId="result" />);

      const iconContainer = screen.getByTestId('result-icon');
      expect(iconContainer).toBeInTheDocument();
      expect(iconContainer.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('Actions', () => {
    it('should render primary action button', () => {
      const onClick = vi.fn();
      render(
        <Result
          status="success"
          title="Title"
          primaryAction={{ label: 'Primary Button', onClick }}
          testId="result"
        />
      );

      const button = screen.getByRole('button', { name: 'Primary Button' });
      expect(button).toBeInTheDocument();

      fireEvent.click(button);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should render secondary action button', () => {
      const onClick = vi.fn();
      render(
        <Result
          status="success"
          title="Title"
          secondaryAction={{ label: 'Secondary Button', onClick }}
          testId="result"
        />
      );

      const button = screen.getByRole('button', { name: 'Secondary Button' });
      expect(button).toBeInTheDocument();

      fireEvent.click(button);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should render both primary and secondary actions', () => {
      render(
        <Result
          status="success"
          title="Title"
          primaryAction={{ label: 'Primary', onClick: () => {} }}
          secondaryAction={{ label: 'Secondary', onClick: () => {} }}
          testId="result"
        />
      );

      expect(screen.getByRole('button', { name: 'Primary' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Secondary' })).toBeInTheDocument();
    });

    it('should render extra actions as links', () => {
      const onClick1 = vi.fn();
      const onClick2 = vi.fn();
      render(
        <Result
          status="success"
          title="Title"
          extraActions={[
            { label: 'Link 1', onClick: onClick1 },
            { label: 'Link 2', onClick: onClick2 },
          ]}
          testId="result"
        />
      );

      const link1 = screen.getByRole('button', { name: 'Link 1' });
      const link2 = screen.getByRole('button', { name: 'Link 2' });

      expect(link1).toBeInTheDocument();
      expect(link2).toBeInTheDocument();

      fireEvent.click(link1);
      expect(onClick1).toHaveBeenCalledTimes(1);

      fireEvent.click(link2);
      expect(onClick2).toHaveBeenCalledTimes(1);
    });

    it('should render action with icon', () => {
      render(
        <Result
          status="success"
          title="Title"
          primaryAction={{
            label: 'With Icon',
            onClick: () => {},
            icon: <span data-testid="action-icon">+</span>,
          }}
          testId="result"
        />
      );

      expect(screen.getByTestId('action-icon')).toBeInTheDocument();
    });

    it('should disable action when disabled is true', () => {
      render(
        <Result
          status="success"
          title="Title"
          primaryAction={{
            label: 'Disabled Button',
            onClick: () => {},
            disabled: true,
          }}
          testId="result"
        />
      );

      const button = screen.getByRole('button', { name: 'Disabled Button' });
      expect(button).toBeDisabled();
    });

    it('should show loading state on action', () => {
      render(
        <Result
          status="success"
          title="Title"
          primaryAction={{
            label: 'Loading Button',
            onClick: () => {},
            loading: true,
          }}
          testId="result"
        />
      );

      const button = screen.getByRole('button', { name: 'Loading Button' });
      expect(button).toBeDisabled();
      // Loading spinner should be present
      expect(button.querySelector('svg.animate-spin')).toBeInTheDocument();
    });
  });

  describe('Extra Content', () => {
    it('should render extra content', () => {
      render(
        <Result
          status="success"
          title="Title"
          extra={<div data-testid="extra-content">Extra Content Here</div>}
          testId="result"
        />
      );

      expect(screen.getByTestId('extra-content')).toBeInTheDocument();
      expect(screen.getByTestId('extra-content')).toHaveTextContent('Extra Content Here');
    });
  });

  describe('Size Variants', () => {
    it('should apply small size styles', () => {
      render(<Result status="success" title="Title" size="sm" testId="result" />);

      const result = screen.getByTestId('result');
      expect(result).toHaveClass('py-8');
    });

    it('should apply medium size styles by default', () => {
      render(<Result status="success" title="Title" testId="result" />);

      const result = screen.getByTestId('result');
      expect(result).toHaveClass('py-12');
    });

    it('should apply large size styles', () => {
      render(<Result status="success" title="Title" size="lg" testId="result" />);

      const result = screen.getByTestId('result');
      expect(result).toHaveClass('py-16');
    });
  });

  describe('Accessibility', () => {
    it('should have role="status" for non-error statuses', () => {
      render(<Result status="success" title="Title" testId="result" />);

      const result = screen.getByTestId('result');
      expect(result).toHaveAttribute('role', 'status');
    });

    it('should have role="alert" for error status', () => {
      render(<Result status="error" title="Error" testId="result" />);

      const result = screen.getByTestId('result');
      expect(result).toHaveAttribute('role', 'alert');
    });

    it('should have role="alert" for 500 status', () => {
      render(<Result status="500" title="Server Error" testId="result" />);

      const result = screen.getByTestId('result');
      expect(result).toHaveAttribute('role', 'alert');
    });

    it('should have aria-live="polite"', () => {
      render(<Result status="success" title="Title" testId="result" />);

      const result = screen.getByTestId('result');
      expect(result).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      render(
        <Result
          status="success"
          title="Title"
          className="custom-class"
          testId="result"
        />
      );

      const result = screen.getByTestId('result');
      expect(result).toHaveClass('custom-class');
    });

    it('should apply custom style', () => {
      render(
        <Result
          status="success"
          title="Title"
          style={{ backgroundColor: 'red' }}
          testId="result"
        />
      );

      const result = screen.getByTestId('result') as HTMLElement;
      expect(result.style.backgroundColor).toBe('red');
    });
  });
});
