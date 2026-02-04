/**
 * Spinner component unit tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  describe('Default Spinner', () => {
    it('should render default spinner type', () => {
      render(<Spinner testId="spinner" />);

      const wrapper = screen.getByTestId('spinner');
      expect(wrapper).toBeInTheDocument();

      const svg = wrapper.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('data-spinner', 'default');
    });

    it('should render default when type is "default"', () => {
      render(<Spinner type="default" testId="spinner" />);

      const wrapper = screen.getByTestId('spinner');
      const svg = wrapper.querySelector('[data-spinner="default"]');
      expect(svg).toBeInTheDocument();
    });

    it('should apply animate-spin class', () => {
      render(<Spinner type="default" testId="spinner" />);

      const svg = screen.getByTestId('spinner').querySelector('svg');
      expect(svg).toHaveClass('animate-spin');
    });
  });

  describe('Dots Spinner', () => {
    it('should render dots spinner', () => {
      render(<Spinner type="dots" testId="spinner" />);

      const wrapper = screen.getByTestId('spinner');
      const dots = wrapper.querySelector('[data-spinner="dots"]');
      expect(dots).toBeInTheDocument();
    });

    it('should render three dots', () => {
      render(<Spinner type="dots" testId="spinner" />);

      const wrapper = screen.getByTestId('spinner');
      const dots = wrapper.querySelectorAll('.rounded-full.bg-current');
      expect(dots).toHaveLength(3);
    });

    it('should apply animation delay to dots', () => {
      render(<Spinner type="dots" testId="spinner" />);

      const wrapper = screen.getByTestId('spinner');
      const dots = wrapper.querySelectorAll('.rounded-full.bg-current');

      expect(dots).toHaveLength(3);

      // Check animation delays using getAttribute since toHaveStyle doesn't work well with inline styles
      const dot0 = dots[0]!;
      const dot1 = dots[1]!;
      const dot2 = dots[2]!;

      expect(dot0.getAttribute('style')).toContain('animation-delay: 0s');
      expect(dot1.getAttribute('style')).toContain('animation-delay: 0.15s');
      expect(dot2.getAttribute('style')).toContain('animation-delay: 0.3s');
    });
  });

  describe('Bars Spinner', () => {
    it('should render bars spinner', () => {
      render(<Spinner type="bars" testId="spinner" />);

      const wrapper = screen.getByTestId('spinner');
      const bars = wrapper.querySelector('[data-spinner="bars"]');
      expect(bars).toBeInTheDocument();
    });

    it('should render four bars', () => {
      render(<Spinner type="bars" testId="spinner" />);

      const wrapper = screen.getByTestId('spinner');
      const bars = wrapper.querySelectorAll('.w-1.bg-current');
      expect(bars).toHaveLength(4);
    });
  });

  describe('Ring Spinner', () => {
    it('should render ring spinner', () => {
      render(<Spinner type="ring" testId="spinner" />);

      const wrapper = screen.getByTestId('spinner');
      const ring = wrapper.querySelector('[data-spinner="ring"]');
      expect(ring).toBeInTheDocument();
    });

    it('should have border classes for ring effect', () => {
      render(<Spinner type="ring" testId="spinner" />);

      const wrapper = screen.getByTestId('spinner');
      const ring = wrapper.querySelector('[data-spinner="ring"]');
      expect(ring).toHaveClass('border-4');
      expect(ring).toHaveClass('border-current');
      expect(ring).toHaveClass('border-t-transparent');
      expect(ring).toHaveClass('rounded-full');
    });
  });

  describe('Pulse Spinner', () => {
    it('should render pulse spinner', () => {
      render(<Spinner type="pulse" testId="spinner" />);

      const wrapper = screen.getByTestId('spinner');
      const pulse = wrapper.querySelector('[data-spinner="pulse"]');
      expect(pulse).toBeInTheDocument();
    });

    it('should have pulse animation class', () => {
      render(<Spinner type="pulse" testId="spinner" />);

      const wrapper = screen.getByTestId('spinner');
      const pulse = wrapper.querySelector('[data-spinner="pulse"]');
      expect(pulse).toHaveClass('animate-pulse');
      expect(pulse).toHaveClass('rounded-full');
    });
  });

  describe('Accessibility', () => {
    it('should have role="presentation"', () => {
      render(<Spinner testId="spinner" />);

      const wrapper = screen.getByTestId('spinner');
      expect(wrapper).toHaveAttribute('role', 'presentation');
    });

    it('should have aria-hidden="true"', () => {
      render(<Spinner testId="spinner" />);

      const wrapper = screen.getByTestId('spinner');
      expect(wrapper).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Custom className', () => {
    it('should apply custom className to spinner', () => {
      render(<Spinner type="default" className="w-8 h-8 text-blue-500" testId="spinner" />);

      const wrapper = screen.getByTestId('spinner');
      const svg = wrapper.querySelector('svg');
      expect(svg).toHaveClass('w-8');
      expect(svg).toHaveClass('h-8');
      expect(svg).toHaveClass('text-blue-500');
    });

    it('should apply className to dots spinner', () => {
      render(<Spinner type="dots" className="text-red-500" testId="spinner" />);

      const wrapper = screen.getByTestId('spinner');
      const dots = wrapper.querySelector('[data-spinner="dots"]');
      expect(dots).toHaveClass('text-red-500');
    });

    it('should apply className to ring spinner', () => {
      render(<Spinner type="ring" className="text-green-500" testId="spinner" />);

      const wrapper = screen.getByTestId('spinner');
      const ring = wrapper.querySelector('[data-spinner="ring"]');
      expect(ring).toHaveClass('text-green-500');
    });
  });

  describe('Test ID', () => {
    it('should apply testId to wrapper', () => {
      render(<Spinner testId="my-spinner" />);

      expect(screen.getByTestId('my-spinner')).toBeInTheDocument();
    });
  });
});
