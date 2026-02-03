/**
 * Class name utility for conditional CSS class merging
 * Lightweight alternative to clsx/classnames with Tailwind merge support
 */

type ClassValue = string | boolean | null | undefined | ClassValue[];

/**
 * Flatten nested arrays recursively
 */
function flattenClasses(classes: ClassValue[]): string[] {
  const result: string[] = [];

  for (const item of classes) {
    if (Array.isArray(item)) {
      result.push(...flattenClasses(item));
    } else if (typeof item === 'string' && item.length > 0) {
      result.push(item);
    }
  }

  return result;
}

/**
 * Merge class names conditionally
 * Filters out falsy values and flattens arrays
 *
 * @param classes - Class values to merge
 * @returns Merged class string
 *
 * @example
 * ```ts
 * cn('base', isActive && 'active', isDisabled && 'disabled');
 * // => "base active" (if isActive is true, isDisabled is false)
 *
 * cn(['flex', 'items-center'], isLarge && 'text-lg');
 * // => "flex items-center text-lg" (if isLarge is true)
 * ```
 */
export function cn(...classes: ClassValue[]): string {
  return flattenClasses(classes).join(' ');
}

/**
 * Alias for cn function
 * @deprecated Use cn instead
 */
export const classNames = cn;
