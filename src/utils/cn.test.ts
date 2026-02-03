/**
 * cn utility unit tests
 */

import { describe, it, expect } from 'vitest';
import { cn, classNames } from './cn';

/**
 * Helper to prevent TypeScript from optimizing away boolean checks
 * This forces the compiler to treat values as unknown at compile time
 */
function asBoolean(value: boolean): boolean {
  return value;
}

describe('cn', () => {
  describe('Basic functionality', () => {
    it('should merge string classes', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('should filter out falsy values', () => {
      expect(cn('foo', false, 'bar', null, undefined, 'baz')).toBe('foo bar baz');
    });

    it('should handle empty strings', () => {
      expect(cn('foo', '', 'bar')).toBe('foo bar');
    });

    it('should handle single class', () => {
      expect(cn('foo')).toBe('foo');
    });

    it('should return empty string for no valid classes', () => {
      expect(cn(false, null, undefined)).toBe('');
    });
  });

  describe('Conditional classes', () => {
    it('should handle boolean conditions', () => {
      const isActive = asBoolean(true);
      const isDisabled = asBoolean(false);

      expect(cn('base', isActive && 'active', isDisabled && 'disabled')).toBe(
        'base active'
      );
    });

    it('should handle ternary conditions', () => {
      const variant = 'success' as string;

      expect(
        cn('base', variant === 'success' ? 'text-green' : 'text-red')
      ).toBe('base text-green');
    });
  });

  describe('Array handling', () => {
    it('should flatten arrays', () => {
      expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz');
    });

    it('should flatten nested arrays', () => {
      expect(cn(['foo', ['bar', 'baz']], 'qux')).toBe('foo bar baz qux');
    });

    it('should filter falsy values in arrays', () => {
      expect(cn(['foo', false, 'bar'], null, ['baz', undefined])).toBe(
        'foo bar baz'
      );
    });

    it('should handle deeply nested arrays', () => {
      expect(cn([['a', ['b', ['c']]]])).toBe('a b c');
    });
  });

  describe('Edge cases', () => {
    it('should handle no arguments', () => {
      expect(cn()).toBe('');
    });

    it('should handle only false values', () => {
      expect(cn(false)).toBe('');
    });

    it('should handle empty array', () => {
      expect(cn([])).toBe('');
    });

    it('should handle array with only falsy values', () => {
      expect(cn([false, null, undefined])).toBe('');
    });
  });

  describe('Common Tailwind patterns', () => {
    it('should handle typical Tailwind class combinations', () => {
      const isLoading = asBoolean(true);
      const hasError = asBoolean(false);

      const result = cn(
        'flex items-center',
        'px-4 py-2',
        'rounded-lg',
        isLoading && 'opacity-50 cursor-wait',
        hasError && 'border-red-500'
      );

      expect(result).toBe(
        'flex items-center px-4 py-2 rounded-lg opacity-50 cursor-wait'
      );
    });

    it('should handle responsive classes', () => {
      expect(cn('text-sm', 'md:text-base', 'lg:text-lg')).toBe(
        'text-sm md:text-base lg:text-lg'
      );
    });

    it('should handle variant classes', () => {
      const variant = 'primary';

      const variants: Record<string, string> = {
        primary: 'bg-blue-500 text-white',
        secondary: 'bg-gray-200 text-gray-900',
      };

      expect(cn('btn', variants[variant])).toBe('btn bg-blue-500 text-white');
    });
  });
});

describe('classNames', () => {
  it('should be an alias for cn', () => {
    expect(classNames).toBe(cn);
  });

  it('should work identically to cn', () => {
    expect(classNames('foo', 'bar')).toBe('foo bar');
    expect(classNames('foo', false, 'bar')).toBe('foo bar');
    expect(classNames(['a', 'b'])).toBe('a b');
  });
});
