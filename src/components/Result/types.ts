/**
 * Result component type definitions
 * Defines interfaces for Result page component
 */

import type { ReactNode, CSSProperties } from 'react';

/**
 * Result status types
 * - success: Operation completed successfully
 * - error: Operation failed
 * - info: Informational message
 * - warning: Warning or caution state
 * - 404: Page not found
 * - 403: Access forbidden
 * - 500: Server error
 */
export type ResultStatus = 'success' | 'error' | 'info' | 'warning' | '404' | '403' | '500';

/**
 * Result size variants
 */
export type ResultSize = 'sm' | 'md' | 'lg';

/**
 * Action button configuration
 */
export interface IResultAction {
  /** Button label text */
  label: string;
  /** Click handler */
  onClick: () => void;
  /** Loading state - shows spinner and disables button */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Icon to display before label */
  icon?: ReactNode;
}

/**
 * Props for the Result component
 */
export interface IResultProps {
  /** Result status determines icon and styling */
  status: ResultStatus;
  /** Main title text */
  title: string;
  /** Description or subtitle text */
  description?: string;
  /** Custom icon (overrides default status icon) */
  icon?: ReactNode;
  /** Primary action button */
  primaryAction?: IResultAction;
  /** Secondary action button */
  secondaryAction?: IResultAction;
  /** Additional action buttons (rendered as links) */
  extraActions?: IResultAction[];
  /** Extra content rendered below actions */
  extra?: ReactNode;
  /** Size variant */
  size?: ResultSize;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
  /** Test ID for testing */
  testId?: string;
}

/**
 * Status configuration for styling and icons
 */
export interface IResultStatusConfig {
  /** Icon background color class */
  iconBg: string;
  /** Icon color class */
  iconColor: string;
}
