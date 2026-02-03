/**
 * SkeletonTable - Table content skeleton placeholder
 * Displays a table skeleton with header and rows
 */

import { memo, useMemo } from 'react';
import { Skeleton } from './Skeleton';
import type { SkeletonAnimation } from '../../core/types';

/**
 * Props for SkeletonTable component
 */
export interface ISkeletonTableProps {
  /** Number of rows to display */
  rows?: number;
  /** Number of columns */
  columns?: number;
  /** Column widths (percentage or px values) */
  columnWidths?: (string | number)[];
  /** Height of each row */
  rowHeight?: number;
  /** Show header row */
  showHeader?: boolean;
  /** Animation type */
  animation?: SkeletonAnimation;
  /** Base color */
  baseColor?: string;
  /** Highlight color */
  highlightColor?: string;
  /** Additional CSS classes */
  className?: string;
  /** Test ID for testing */
  testId?: string;
}

/**
 * SkeletonTable component
 * Renders a table skeleton with configurable rows and columns
 *
 * @example
 * ```tsx
 * // Default table
 * <SkeletonTable />
 *
 * // Custom dimensions
 * <SkeletonTable rows={10} columns={5} />
 *
 * // With custom column widths
 * <SkeletonTable
 *   columns={4}
 *   columnWidths={['20%', '30%', '30%', '20%']}
 * />
 * ```
 */
export const SkeletonTable = memo(function SkeletonTable({
  rows = 5,
  columns = 4,
  columnWidths,
  rowHeight = 40,
  showHeader = true,
  animation = 'pulse',
  baseColor,
  highlightColor,
  className,
  testId,
}: ISkeletonTableProps) {
  /**
   * Get width for a specific column
   */
  const getColumnWidth = (index: number): string | number => {
    if (columnWidths && columnWidths[index] !== undefined) {
      return columnWidths[index];
    }
    return `${100 / columns}%`;
  };

  /**
   * Pre-generate random widths for cell content variation
   * Uses useMemo to keep widths stable across re-renders
   */
  const cellWidths = useMemo(() => {
    return Array.from({ length: rows }, () =>
      Array.from({ length: columns }, () => `${70 + Math.floor(Math.random() * 30)}%`)
    );
  }, [rows, columns]);

  /**
   * Build optional props for child components
   */
  const optionalProps = {
    ...(baseColor !== undefined && { baseColor }),
    ...(highlightColor !== undefined && { highlightColor }),
  };

  return (
    <div className={`w-full ${className ?? ''}`} data-testid={testId}>
      {/* Header row */}
      {showHeader && (
        <div
          className="flex gap-4 p-3 border-b bg-gray-50 dark:bg-gray-800"
          data-testid={testId ? `${testId}-header` : undefined}
        >
          {Array.from({ length: columns }, (_, colIndex) => (
            <div
              key={`header-${colIndex}`}
              style={{ width: getColumnWidth(colIndex) }}
            >
              <Skeleton
                height={16}
                animation={animation}
                {...optionalProps}
                {...(testId !== undefined && { testId: `${testId}-header-${colIndex}` })}
              />
            </div>
          ))}
        </div>
      )}

      {/* Data rows */}
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="flex gap-4 p-3 border-b last:border-b-0"
          style={{ minHeight: rowHeight }}
          data-testid={testId ? `${testId}-row-${rowIndex}` : undefined}
        >
          {Array.from({ length: columns }, (_, colIndex) => (
            <div
              key={`cell-${rowIndex}-${colIndex}`}
              style={{ width: getColumnWidth(colIndex) }}
              className="flex items-center"
            >
              <Skeleton
                height={16}
                width={cellWidths[rowIndex]?.[colIndex] ?? '80%'}
                animation={animation}
                {...optionalProps}
                {...(testId !== undefined && { testId: `${testId}-cell-${rowIndex}-${colIndex}` })}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
});

SkeletonTable.displayName = 'Skeleton.Table';
