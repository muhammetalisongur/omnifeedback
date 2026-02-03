/**
 * Drawer component unit tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Drawer } from './Drawer';
import type { FeedbackStatus } from '../../core/types';

describe('Drawer', () => {
  const defaultProps = {
    content: <div>Drawer content</div>,
    status: 'visible' as FeedbackStatus,
    onRequestClose: vi.fn(),
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
    it('should render content', () => {
      render(<Drawer {...defaultProps} testId="drawer" />);
      expect(screen.getByTestId('drawer-content')).toHaveTextContent(
        'Drawer content'
      );
    });

    it('should render title when provided', () => {
      render(
        <Drawer {...defaultProps} title="Settings" testId="drawer" />
      );
      expect(screen.getByTestId('drawer-title-text')).toHaveTextContent(
        'Settings'
      );
    });

    it('should not render title when not provided', () => {
      render(<Drawer {...defaultProps} closable={false} testId="drawer" />);
      expect(screen.queryByTestId('drawer-title-text')).not.toBeInTheDocument();
    });

    it('should have role="dialog"', () => {
      render(<Drawer {...defaultProps} testId="drawer" />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should have aria-modal="true"', () => {
      render(<Drawer {...defaultProps} testId="drawer" />);
      expect(screen.getByRole('dialog')).toHaveAttribute(
        'aria-modal',
        'true'
      );
    });

    it('should render footer when provided', () => {
      render(
        <Drawer
          {...defaultProps}
          footer={<button>Save</button>}
          testId="drawer"
        />
      );
      expect(screen.getByTestId('drawer-footer')).toBeInTheDocument();
      expect(screen.getByText('Save')).toBeInTheDocument();
    });

    it('should not render footer when not provided', () => {
      render(<Drawer {...defaultProps} testId="drawer" />);
      expect(screen.queryByTestId('drawer-footer')).not.toBeInTheDocument();
    });
  });

  describe('Positions', () => {
    it('should default to right position', () => {
      render(<Drawer {...defaultProps} testId="drawer" />);
      expect(screen.getByTestId('drawer')).toHaveAttribute(
        'data-position',
        'right'
      );
    });

    it('should apply left position', () => {
      render(<Drawer {...defaultProps} position="left" testId="drawer" />);
      expect(screen.getByTestId('drawer')).toHaveAttribute(
        'data-position',
        'left'
      );
      expect(screen.getByTestId('drawer-panel')).toHaveClass('left-0');
    });

    it('should apply right position', () => {
      render(<Drawer {...defaultProps} position="right" testId="drawer" />);
      expect(screen.getByTestId('drawer')).toHaveAttribute(
        'data-position',
        'right'
      );
      expect(screen.getByTestId('drawer-panel')).toHaveClass('right-0');
    });

    it('should apply top position', () => {
      render(<Drawer {...defaultProps} position="top" testId="drawer" />);
      expect(screen.getByTestId('drawer')).toHaveAttribute(
        'data-position',
        'top'
      );
      expect(screen.getByTestId('drawer-panel')).toHaveClass('top-0');
    });

    it('should apply bottom position', () => {
      render(<Drawer {...defaultProps} position="bottom" testId="drawer" />);
      expect(screen.getByTestId('drawer')).toHaveAttribute(
        'data-position',
        'bottom'
      );
      expect(screen.getByTestId('drawer-panel')).toHaveClass('bottom-0');
    });
  });

  describe('Sizes', () => {
    it('should default to md size', () => {
      render(<Drawer {...defaultProps} testId="drawer" />);
      expect(screen.getByTestId('drawer')).toHaveAttribute(
        'data-size',
        'md'
      );
    });

    it('should apply sm size for horizontal drawer', () => {
      render(<Drawer {...defaultProps} size="sm" position="right" testId="drawer" />);
      expect(screen.getByTestId('drawer-panel')).toHaveClass('w-[280px]');
    });

    it('should apply md size for horizontal drawer', () => {
      render(<Drawer {...defaultProps} size="md" position="right" testId="drawer" />);
      expect(screen.getByTestId('drawer-panel')).toHaveClass('w-[400px]');
    });

    it('should apply lg size for horizontal drawer', () => {
      render(<Drawer {...defaultProps} size="lg" position="right" testId="drawer" />);
      expect(screen.getByTestId('drawer-panel')).toHaveClass('w-[600px]');
    });

    it('should apply xl size for horizontal drawer', () => {
      render(<Drawer {...defaultProps} size="xl" position="right" testId="drawer" />);
      expect(screen.getByTestId('drawer-panel')).toHaveClass('w-[800px]');
    });

    it('should apply full size for horizontal drawer', () => {
      render(<Drawer {...defaultProps} size="full" position="right" testId="drawer" />);
      expect(screen.getByTestId('drawer-panel')).toHaveClass('w-full');
    });

    it('should apply sm size for vertical drawer', () => {
      render(<Drawer {...defaultProps} size="sm" position="bottom" testId="drawer" />);
      expect(screen.getByTestId('drawer-panel')).toHaveClass('h-[200px]');
    });

    it('should apply md size for vertical drawer', () => {
      render(<Drawer {...defaultProps} size="md" position="bottom" testId="drawer" />);
      expect(screen.getByTestId('drawer-panel')).toHaveClass('h-[300px]');
    });

    it('should apply lg size for vertical drawer', () => {
      render(<Drawer {...defaultProps} size="lg" position="bottom" testId="drawer" />);
      expect(screen.getByTestId('drawer-panel')).toHaveClass('h-[400px]');
    });

    it('should apply xl size for vertical drawer', () => {
      render(<Drawer {...defaultProps} size="xl" position="bottom" testId="drawer" />);
      expect(screen.getByTestId('drawer-panel')).toHaveClass('h-[500px]');
    });

    it('should apply full size for vertical drawer', () => {
      render(<Drawer {...defaultProps} size="full" position="bottom" testId="drawer" />);
      expect(screen.getByTestId('drawer-panel')).toHaveClass('h-full');
    });

    it('should apply custom size', () => {
      render(
        <Drawer
          {...defaultProps}
          customSize="500px"
          position="right"
          testId="drawer"
        />
      );
      const panel = screen.getByTestId('drawer-panel');
      expect(panel.getAttribute('style')).toContain('width: 500px');
    });

    it('should apply custom size as number', () => {
      render(
        <Drawer
          {...defaultProps}
          customSize={600}
          position="right"
          testId="drawer"
        />
      );
      const panel = screen.getByTestId('drawer-panel');
      expect(panel.getAttribute('style')).toContain('width: 600px');
    });
  });

  describe('Close Button', () => {
    it('should render close button by default', () => {
      render(<Drawer {...defaultProps} testId="drawer" />);
      expect(screen.getByTestId('drawer-close')).toBeInTheDocument();
    });

    it('should not render close button when closable is false', () => {
      render(<Drawer {...defaultProps} closable={false} testId="drawer" />);
      expect(screen.queryByTestId('drawer-close')).not.toBeInTheDocument();
    });

    it('should call onRequestClose when close button clicked', () => {
      const onRequestClose = vi.fn();
      render(
        <Drawer
          {...defaultProps}
          onRequestClose={onRequestClose}
          testId="drawer"
        />
      );

      fireEvent.click(screen.getByTestId('drawer-close'));

      expect(onRequestClose).toHaveBeenCalledTimes(1);
    });

    it('should have accessible label on close button', () => {
      render(<Drawer {...defaultProps} testId="drawer" />);
      expect(screen.getByTestId('drawer-close')).toHaveAttribute(
        'aria-label',
        'Close drawer'
      );
    });
  });

  describe('Overlay', () => {
    it('should render overlay by default', () => {
      render(<Drawer {...defaultProps} testId="drawer" />);
      expect(screen.getByTestId('drawer-overlay')).toBeInTheDocument();
    });

    it('should not render overlay when overlay is false', () => {
      render(<Drawer {...defaultProps} overlay={false} testId="drawer" />);
      expect(screen.queryByTestId('drawer-overlay')).not.toBeInTheDocument();
    });

    it('should call onRequestClose when overlay clicked', () => {
      const onRequestClose = vi.fn();
      render(
        <Drawer
          {...defaultProps}
          onRequestClose={onRequestClose}
          testId="drawer"
        />
      );

      fireEvent.click(screen.getByTestId('drawer-overlay'));

      expect(onRequestClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onRequestClose when closeOnOverlayClick is false', () => {
      const onRequestClose = vi.fn();
      render(
        <Drawer
          {...defaultProps}
          onRequestClose={onRequestClose}
          closeOnOverlayClick={false}
          testId="drawer"
        />
      );

      fireEvent.click(screen.getByTestId('drawer-overlay'));

      expect(onRequestClose).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Support', () => {
    it('should call onRequestClose when ESC key pressed', () => {
      const onRequestClose = vi.fn();
      render(
        <Drawer
          {...defaultProps}
          onRequestClose={onRequestClose}
          testId="drawer"
        />
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onRequestClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onRequestClose when ESC pressed with closeOnEscape false', () => {
      const onRequestClose = vi.fn();
      render(
        <Drawer
          {...defaultProps}
          onRequestClose={onRequestClose}
          closeOnEscape={false}
          testId="drawer"
        />
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onRequestClose).not.toHaveBeenCalled();
    });
  });

  describe('Status Animation', () => {
    it('should have data-status attribute', () => {
      render(<Drawer {...defaultProps} status="visible" testId="drawer" />);
      expect(screen.getByTestId('drawer')).toHaveAttribute(
        'data-status',
        'visible'
      );
    });

    it('should have entering status', () => {
      render(<Drawer {...defaultProps} status="entering" testId="drawer" />);
      expect(screen.getByTestId('drawer')).toHaveAttribute(
        'data-status',
        'entering'
      );
    });

    it('should have exiting status', () => {
      render(<Drawer {...defaultProps} status="exiting" testId="drawer" />);
      expect(screen.getByTestId('drawer')).toHaveAttribute(
        'data-status',
        'exiting'
      );
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      render(
        <Drawer {...defaultProps} className="custom-class" testId="drawer" />
      );
      expect(screen.getByTestId('drawer-panel')).toHaveClass('custom-class');
    });

    it('should apply custom style', () => {
      render(
        <Drawer
          {...defaultProps}
          style={{ margin: '10px' }}
          testId="drawer"
        />
      );
      const drawer = screen.getByTestId('drawer');
      expect(drawer.getAttribute('style')).toContain('margin');
    });
  });

  describe('Settings Panel Scenario', () => {
    it('should render settings drawer correctly', () => {
      const onSave = vi.fn();
      const onClose = vi.fn();

      render(
        <Drawer
          title="Settings"
          content={
            <div>
              <label>Theme</label>
              <select>
                <option>Light</option>
                <option>Dark</option>
              </select>
            </div>
          }
          footer={
            <div>
              <button onClick={onClose}>Cancel</button>
              <button onClick={onSave}>Save</button>
            </div>
          }
          position="right"
          size="md"
          status="visible"
          onRequestClose={onClose}
          testId="settings-drawer"
        />
      );

      expect(screen.getByTestId('settings-drawer')).toBeInTheDocument();
      expect(screen.getByTestId('settings-drawer-title-text')).toHaveTextContent(
        'Settings'
      );
      expect(screen.getByText('Theme')).toBeInTheDocument();
      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
  });

  describe('Navigation Menu Scenario', () => {
    it('should render navigation menu drawer correctly', () => {
      render(
        <Drawer
          content={
            <nav>
              <a href="/home">Home</a>
              <a href="/about">About</a>
              <a href="/contact">Contact</a>
            </nav>
          }
          position="left"
          size="sm"
          closable={false}
          status="visible"
          onRequestClose={vi.fn()}
          testId="nav-drawer"
        />
      );

      expect(screen.getByTestId('nav-drawer')).toBeInTheDocument();
      expect(screen.getByTestId('nav-drawer')).toHaveAttribute(
        'data-position',
        'left'
      );
      expect(screen.queryByTestId('nav-drawer-close')).not.toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
    });
  });

  describe('Bottom Sheet Scenario', () => {
    it('should render bottom sheet drawer correctly', () => {
      render(
        <Drawer
          content={
            <div>
              <button>Take Photo</button>
              <button>Choose from Gallery</button>
              <button>Upload File</button>
            </div>
          }
          position="bottom"
          size="sm"
          status="visible"
          onRequestClose={vi.fn()}
          testId="bottom-drawer"
        />
      );

      expect(screen.getByTestId('bottom-drawer')).toBeInTheDocument();
      expect(screen.getByTestId('bottom-drawer')).toHaveAttribute(
        'data-position',
        'bottom'
      );
      expect(screen.getByTestId('bottom-drawer-panel')).toHaveClass('h-[200px]');
      expect(screen.getByText('Take Photo')).toBeInTheDocument();
    });
  });

  describe('Full Screen Scenario', () => {
    it('should render full screen drawer correctly', () => {
      render(
        <Drawer
          title="Detail View"
          content={<div>Full screen content</div>}
          position="right"
          size="full"
          status="visible"
          onRequestClose={vi.fn()}
          testId="full-drawer"
        />
      );

      expect(screen.getByTestId('full-drawer')).toBeInTheDocument();
      expect(screen.getByTestId('full-drawer-panel')).toHaveClass('w-full');
      expect(screen.getByText('Full screen content')).toBeInTheDocument();
    });
  });
});
