/**
 * Alert component unit tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Alert } from './Alert';
import type { FeedbackStatus, IAlertAction } from '../../core/types';

describe('Alert', () => {
  const defaultProps = {
    message: 'Test message',
    status: 'visible' as FeedbackStatus,
    onRequestDismiss: vi.fn(),
  };

  describe('Rendering', () => {
    it('should render message', () => {
      render(<Alert {...defaultProps} testId="alert" />);
      expect(screen.getByTestId('alert-message')).toHaveTextContent('Test message');
    });

    it('should render title when provided', () => {
      render(<Alert {...defaultProps} title="Test Title" testId="alert" />);
      expect(screen.getByTestId('alert-title')).toHaveTextContent('Test Title');
    });

    it('should not render title when not provided', () => {
      render(<Alert {...defaultProps} testId="alert" />);
      expect(screen.queryByTestId('alert-title')).not.toBeInTheDocument();
    });

    it('should have role="alert"', () => {
      render(<Alert {...defaultProps} testId="alert" />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should apply default variant styles', () => {
      render(<Alert {...defaultProps} variant="default" testId="alert" />);
      const alert = screen.getByTestId('alert');
      expect(alert).toHaveAttribute('data-variant', 'default');
    });

    it('should apply success variant', () => {
      render(<Alert {...defaultProps} variant="success" testId="alert" />);
      const alert = screen.getByTestId('alert');
      expect(alert).toHaveAttribute('data-variant', 'success');
      expect(alert).toHaveClass('bg-green-50');
    });

    it('should apply error variant', () => {
      render(<Alert {...defaultProps} variant="error" testId="alert" />);
      const alert = screen.getByTestId('alert');
      expect(alert).toHaveAttribute('data-variant', 'error');
      expect(alert).toHaveClass('bg-red-50');
    });

    it('should apply warning variant', () => {
      render(<Alert {...defaultProps} variant="warning" testId="alert" />);
      const alert = screen.getByTestId('alert');
      expect(alert).toHaveAttribute('data-variant', 'warning');
      expect(alert).toHaveClass('bg-yellow-50');
    });

    it('should apply info variant', () => {
      render(<Alert {...defaultProps} variant="info" testId="alert" />);
      const alert = screen.getByTestId('alert');
      expect(alert).toHaveAttribute('data-variant', 'info');
      expect(alert).toHaveClass('bg-blue-50');
    });
  });

  describe('Icons', () => {
    it('should render default icon for variant', () => {
      render(<Alert {...defaultProps} variant="success" testId="alert" />);
      expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
    });

    it('should hide icon when hideIcon is true', () => {
      render(<Alert {...defaultProps} hideIcon testId="alert" />);
      expect(screen.queryByTestId('alert-icon')).not.toBeInTheDocument();
    });

    it('should render custom icon', () => {
      const customIcon = <span data-testid="custom-icon">Custom</span>;
      render(<Alert {...defaultProps} icon={customIcon} testId="alert" />);
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });
  });

  describe('Dismiss Button', () => {
    it('should show dismiss button when dismissible is true', () => {
      render(<Alert {...defaultProps} dismissible testId="alert" />);
      expect(screen.getByTestId('alert-dismiss')).toBeInTheDocument();
    });

    it('should hide dismiss button when dismissible is false', () => {
      render(<Alert {...defaultProps} dismissible={false} testId="alert" />);
      expect(screen.queryByTestId('alert-dismiss')).not.toBeInTheDocument();
    });

    it('should call onRequestDismiss when dismiss clicked', () => {
      const onRequestDismiss = vi.fn();
      render(
        <Alert
          {...defaultProps}
          onRequestDismiss={onRequestDismiss}
          dismissible
          testId="alert"
        />
      );

      fireEvent.click(screen.getByTestId('alert-dismiss'));
      expect(onRequestDismiss).toHaveBeenCalledTimes(1);
    });

    it('should have aria-label on dismiss button', () => {
      render(<Alert {...defaultProps} dismissible testId="alert" />);
      expect(screen.getByTestId('alert-dismiss')).toHaveAttribute('aria-label', 'Dismiss');
    });
  });

  describe('Actions', () => {
    it('should render action buttons', () => {
      const actions: IAlertAction[] = [
        { label: 'Cancel', onClick: vi.fn() },
        { label: 'Confirm', onClick: vi.fn(), variant: 'primary' },
      ];
      render(<Alert {...defaultProps} actions={actions} testId="alert" />);

      expect(screen.getByTestId('alert-actions')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Confirm')).toBeInTheDocument();
    });

    it('should call action onClick when clicked', () => {
      const onClick = vi.fn();
      const actions: IAlertAction[] = [{ label: 'Click Me', onClick }];
      render(<Alert {...defaultProps} actions={actions} testId="alert" />);

      fireEvent.click(screen.getByText('Click Me'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should apply primary variant style to action', () => {
      const actions: IAlertAction[] = [
        { label: 'Primary', onClick: vi.fn(), variant: 'primary' },
      ];
      render(<Alert {...defaultProps} actions={actions} testId="alert" />);

      const button = screen.getByTestId('alert-action-0');
      expect(button).toHaveClass('bg-current/10');
    });

    it('should apply secondary variant style to action', () => {
      const actions: IAlertAction[] = [
        { label: 'Secondary', onClick: vi.fn(), variant: 'secondary' },
      ];
      render(<Alert {...defaultProps} actions={actions} testId="alert" />);

      const button = screen.getByTestId('alert-action-0');
      expect(button).toHaveClass('border');
    });

    it('should apply link variant style to action', () => {
      const actions: IAlertAction[] = [
        { label: 'Link', onClick: vi.fn(), variant: 'link' },
      ];
      render(<Alert {...defaultProps} actions={actions} testId="alert" />);

      const button = screen.getByTestId('alert-action-0');
      expect(button).toHaveClass('underline');
    });
  });

  describe('Styling', () => {
    it('should apply bordered style by default', () => {
      render(<Alert {...defaultProps} testId="alert" />);
      expect(screen.getByTestId('alert')).toHaveClass('border');
    });

    it('should not apply border when bordered is false', () => {
      render(<Alert {...defaultProps} bordered={false} testId="alert" />);
      expect(screen.getByTestId('alert')).not.toHaveClass('border');
    });

    it('should apply filled style when filled is true', () => {
      render(<Alert {...defaultProps} filled variant="success" testId="alert" />);
      expect(screen.getByTestId('alert')).toHaveClass('bg-green-100');
    });

    it('should apply custom className', () => {
      render(<Alert {...defaultProps} className="custom-class" testId="alert" />);
      expect(screen.getByTestId('alert')).toHaveClass('custom-class');
    });

    it('should apply custom style', () => {
      render(
        <Alert {...defaultProps} style={{ margin: '10px' }} testId="alert" />
      );
      const alert = screen.getByTestId('alert');
      expect(alert.getAttribute('style')).toContain('margin');
    });
  });

  describe('Status Animation', () => {
    it('should be visible when status is visible', () => {
      render(<Alert {...defaultProps} status="visible" testId="alert" />);
      const alert = screen.getByTestId('alert');
      expect(alert).toHaveAttribute('data-status', 'visible');
    });

    it('should have entering status', () => {
      render(<Alert {...defaultProps} status="entering" testId="alert" />);
      expect(screen.getByTestId('alert')).toHaveAttribute('data-status', 'entering');
    });

    it('should have exiting status', () => {
      render(<Alert {...defaultProps} status="exiting" testId="alert" />);
      expect(screen.getByTestId('alert')).toHaveAttribute('data-status', 'exiting');
    });
  });
});
