/**
 * Banner component unit tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Banner } from './Banner';
import type { FeedbackStatus, IBannerAction } from '../../core/types';

describe('Banner', () => {
  const defaultProps = {
    message: 'Test banner message',
    status: 'visible' as FeedbackStatus,
    onRequestDismiss: vi.fn(),
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render message', () => {
      render(<Banner {...defaultProps} testId="banner" />);
      expect(screen.getByTestId('banner-message')).toHaveTextContent(
        'Test banner message'
      );
    });

    it('should render title when provided', () => {
      render(
        <Banner {...defaultProps} title="Important" testId="banner" />
      );
      expect(screen.getByTestId('banner-title')).toHaveTextContent('Important');
    });

    it('should not render title when not provided', () => {
      render(<Banner {...defaultProps} testId="banner" />);
      expect(screen.queryByTestId('banner-title')).not.toBeInTheDocument();
    });

    it('should have role="banner"', () => {
      render(<Banner {...defaultProps} testId="banner" />);
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('should have aria-live="polite"', () => {
      render(<Banner {...defaultProps} testId="banner" />);
      expect(screen.getByRole('banner')).toHaveAttribute(
        'aria-live',
        'polite'
      );
    });

    it('should render custom icon', () => {
      const customIcon = <span data-testid="custom-icon">Custom</span>;
      render(<Banner {...defaultProps} icon={customIcon} testId="banner" />);
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('should hide icon when hideIcon is true', () => {
      render(<Banner {...defaultProps} hideIcon={true} testId="banner" />);
      expect(screen.queryByTestId('banner-icon')).not.toBeInTheDocument();
    });

    it('should render default icon when not hidden', () => {
      render(<Banner {...defaultProps} testId="banner" />);
      expect(screen.getByTestId('banner-icon')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should apply default variant by default', () => {
      render(<Banner {...defaultProps} testId="banner" />);
      expect(screen.getByTestId('banner')).toHaveAttribute(
        'data-variant',
        'default'
      );
    });

    it('should apply info variant', () => {
      render(<Banner {...defaultProps} variant="info" testId="banner" />);
      expect(screen.getByTestId('banner')).toHaveAttribute(
        'data-variant',
        'info'
      );
      expect(screen.getByTestId('banner')).toHaveClass('bg-blue-50');
    });

    it('should apply success variant', () => {
      render(<Banner {...defaultProps} variant="success" testId="banner" />);
      expect(screen.getByTestId('banner')).toHaveAttribute(
        'data-variant',
        'success'
      );
      expect(screen.getByTestId('banner')).toHaveClass('bg-green-50');
    });

    it('should apply warning variant', () => {
      render(<Banner {...defaultProps} variant="warning" testId="banner" />);
      expect(screen.getByTestId('banner')).toHaveAttribute(
        'data-variant',
        'warning'
      );
      expect(screen.getByTestId('banner')).toHaveClass('bg-yellow-50');
    });

    it('should apply error variant', () => {
      render(<Banner {...defaultProps} variant="error" testId="banner" />);
      expect(screen.getByTestId('banner')).toHaveAttribute(
        'data-variant',
        'error'
      );
      expect(screen.getByTestId('banner')).toHaveClass('bg-red-50');
    });

    it('should apply announcement variant with gradient', () => {
      render(<Banner {...defaultProps} variant="announcement" testId="banner" />);
      expect(screen.getByTestId('banner')).toHaveAttribute(
        'data-variant',
        'announcement'
      );
      expect(screen.getByTestId('banner')).toHaveClass('bg-gradient-to-r');
    });
  });

  describe('Position', () => {
    it('should default to top position', () => {
      render(<Banner {...defaultProps} testId="banner" />);
      expect(screen.getByTestId('banner')).toHaveAttribute(
        'data-position',
        'top'
      );
      expect(screen.getByTestId('banner')).toHaveClass('top-0');
    });

    it('should apply bottom position', () => {
      render(<Banner {...defaultProps} position="bottom" testId="banner" />);
      expect(screen.getByTestId('banner')).toHaveAttribute(
        'data-position',
        'bottom'
      );
      expect(screen.getByTestId('banner')).toHaveClass('bottom-0');
    });

    it('should apply sticky class by default', () => {
      render(<Banner {...defaultProps} testId="banner" />);
      expect(screen.getByTestId('banner')).toHaveClass('sticky');
    });

    it('should not apply sticky class when sticky is false', () => {
      render(<Banner {...defaultProps} sticky={false} testId="banner" />);
      expect(screen.getByTestId('banner')).not.toHaveClass('sticky');
    });
  });

  describe('Dismiss Button', () => {
    it('should render dismiss button by default', () => {
      render(<Banner {...defaultProps} testId="banner" />);
      expect(screen.getByTestId('banner-dismiss')).toBeInTheDocument();
    });

    it('should not render dismiss button when dismissible is false', () => {
      render(<Banner {...defaultProps} dismissible={false} testId="banner" />);
      expect(screen.queryByTestId('banner-dismiss')).not.toBeInTheDocument();
    });

    it('should call onRequestDismiss when dismiss button clicked', () => {
      const onRequestDismiss = vi.fn();
      render(
        <Banner
          {...defaultProps}
          onRequestDismiss={onRequestDismiss}
          testId="banner"
        />
      );

      fireEvent.click(screen.getByTestId('banner-dismiss'));

      expect(onRequestDismiss).toHaveBeenCalledTimes(1);
    });

    it('should have accessible label on dismiss button', () => {
      render(<Banner {...defaultProps} testId="banner" />);
      expect(screen.getByTestId('banner-dismiss')).toHaveAttribute(
        'aria-label',
        'Dismiss banner'
      );
    });
  });

  describe('Actions', () => {
    const actions: IBannerAction[] = [
      { label: 'Accept', onClick: vi.fn(), variant: 'primary' },
      { label: 'Settings', onClick: vi.fn(), variant: 'secondary' },
      { label: 'Learn More', onClick: vi.fn() },
    ];

    it('should render action buttons', () => {
      render(<Banner {...defaultProps} actions={actions} testId="banner" />);

      expect(screen.getByTestId('banner-actions')).toBeInTheDocument();
      expect(screen.getByTestId('banner-action-0')).toHaveTextContent('Accept');
      expect(screen.getByTestId('banner-action-1')).toHaveTextContent('Settings');
      expect(screen.getByTestId('banner-action-2')).toHaveTextContent('Learn More');
    });

    it('should call onClick when action button clicked', () => {
      const onClick = vi.fn();
      const singleAction: IBannerAction[] = [
        { label: 'Click Me', onClick },
      ];
      render(<Banner {...defaultProps} actions={singleAction} testId="banner" />);

      fireEvent.click(screen.getByTestId('banner-action-0'));

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should not render actions container when no actions', () => {
      render(<Banner {...defaultProps} testId="banner" />);
      expect(screen.queryByTestId('banner-actions')).not.toBeInTheDocument();
    });

    it('should not render actions container when actions is empty array', () => {
      render(<Banner {...defaultProps} actions={[]} testId="banner" />);
      expect(screen.queryByTestId('banner-actions')).not.toBeInTheDocument();
    });
  });

  describe('Status Animation', () => {
    it('should have data-status attribute', () => {
      render(<Banner {...defaultProps} status="visible" testId="banner" />);
      expect(screen.getByTestId('banner')).toHaveAttribute(
        'data-status',
        'visible'
      );
    });

    it('should have entering status', () => {
      render(<Banner {...defaultProps} status="entering" testId="banner" />);
      expect(screen.getByTestId('banner')).toHaveAttribute(
        'data-status',
        'entering'
      );
    });

    it('should have exiting status', () => {
      render(<Banner {...defaultProps} status="exiting" testId="banner" />);
      expect(screen.getByTestId('banner')).toHaveAttribute(
        'data-status',
        'exiting'
      );
    });
  });

  describe('Layout Options', () => {
    it('should apply fullWidth class by default', () => {
      render(<Banner {...defaultProps} testId="banner" />);
      expect(screen.getByTestId('banner-content')).toHaveClass('w-full');
    });

    it('should apply max-width when fullWidth is false', () => {
      render(<Banner {...defaultProps} fullWidth={false} testId="banner" />);
      expect(screen.getByTestId('banner-content')).toHaveClass('max-w-7xl');
    });

    it('should center content by default', () => {
      render(<Banner {...defaultProps} testId="banner" />);
      expect(screen.getByTestId('banner-content')).toHaveClass('justify-center');
    });

    it('should not center content when centered is false', () => {
      render(<Banner {...defaultProps} centered={false} testId="banner" />);
      expect(screen.getByTestId('banner-content')).not.toHaveClass('justify-center');
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      render(
        <Banner {...defaultProps} className="custom-class" testId="banner" />
      );
      expect(screen.getByTestId('banner')).toHaveClass('custom-class');
    });

    it('should apply custom style', () => {
      render(
        <Banner
          {...defaultProps}
          style={{ margin: '10px' }}
          testId="banner"
        />
      );
      const banner = screen.getByTestId('banner');
      expect(banner.getAttribute('style')).toContain('margin');
    });
  });

  describe('Cookie Consent Scenario', () => {
    it('should render cookie consent banner correctly', () => {
      const acceptClick = vi.fn();
      const settingsClick = vi.fn();

      render(
        <Banner
          message="This site uses cookies to improve your experience."
          variant="info"
          position="bottom"
          actions={[
            { label: 'Accept All', onClick: acceptClick, variant: 'primary' },
            { label: 'Cookie Settings', onClick: settingsClick, variant: 'secondary' },
          ]}
          status="visible"
          onRequestDismiss={vi.fn()}
          testId="cookie-banner"
        />
      );

      expect(screen.getByTestId('cookie-banner')).toBeInTheDocument();
      expect(screen.getByTestId('cookie-banner-message')).toHaveTextContent(
        'This site uses cookies'
      );
      expect(screen.getByTestId('cookie-banner')).toHaveAttribute(
        'data-position',
        'bottom'
      );
      expect(screen.getByTestId('cookie-banner-action-0')).toHaveTextContent(
        'Accept All'
      );
      expect(screen.getByTestId('cookie-banner-action-1')).toHaveTextContent(
        'Cookie Settings'
      );

      // Test action clicks
      fireEvent.click(screen.getByTestId('cookie-banner-action-0'));
      expect(acceptClick).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByTestId('cookie-banner-action-1'));
      expect(settingsClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Maintenance Warning Scenario', () => {
    it('should render maintenance banner correctly', () => {
      render(
        <Banner
          title="Scheduled Maintenance"
          message="Our services will be unavailable on Sunday, 10 PM - 2 AM."
          variant="warning"
          position="top"
          dismissible={false}
          status="visible"
          onRequestDismiss={vi.fn()}
          testId="maintenance-banner"
        />
      );

      expect(screen.getByTestId('maintenance-banner')).toBeInTheDocument();
      expect(screen.getByTestId('maintenance-banner-title')).toHaveTextContent(
        'Scheduled Maintenance'
      );
      expect(screen.getByTestId('maintenance-banner-message')).toHaveTextContent(
        'Our services will be unavailable'
      );
      expect(screen.getByTestId('maintenance-banner')).toHaveAttribute(
        'data-variant',
        'warning'
      );
      expect(screen.queryByTestId('maintenance-banner-dismiss')).not.toBeInTheDocument();
    });
  });

  describe('Feature Announcement Scenario', () => {
    it('should render announcement banner correctly', () => {
      const learnMoreClick = vi.fn();

      render(
        <Banner
          message="New feature available! Dark mode is now supported."
          variant="announcement"
          position="top"
          actions={[
            { label: 'Learn More', onClick: learnMoreClick },
          ]}
          status="visible"
          onRequestDismiss={vi.fn()}
          testId="announcement-banner"
        />
      );

      expect(screen.getByTestId('announcement-banner')).toBeInTheDocument();
      expect(screen.getByTestId('announcement-banner')).toHaveAttribute(
        'data-variant',
        'announcement'
      );
      expect(screen.getByTestId('announcement-banner')).toHaveClass(
        'bg-gradient-to-r'
      );
      expect(screen.getByTestId('announcement-banner-action-0')).toHaveTextContent(
        'Learn More'
      );
    });
  });
});
