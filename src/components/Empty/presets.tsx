/**
 * Empty state presets configuration
 * Provides default icons, titles and descriptions for common empty states
 */

import type { ReactNode } from 'react';

/**
 * Empty state preset type
 */
export type EmptyPresetType =
  | 'no-data'
  | 'no-results'
  | 'no-permission'
  | 'error'
  | 'offline'
  | '404'
  | '403'
  | '500';

/**
 * Preset configuration interface
 */
export interface IEmptyPreset {
  /** Default icon */
  icon: ReactNode;
  /** Default title */
  title: string;
  /** Default description */
  description: string;
}

/**
 * SVG icon component for no-data preset
 */
const NoDataIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="64"
    height="64"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="9" y1="21" x2="9" y2="9" />
  </svg>
);

/**
 * SVG icon component for no-results preset
 */
const NoResultsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="64"
    height="64"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </svg>
);

/**
 * SVG icon component for no-permission preset
 */
const NoPermissionIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="64"
    height="64"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

/**
 * SVG icon component for error preset
 */
const ErrorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="64"
    height="64"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

/**
 * SVG icon component for offline preset
 */
const OfflineIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="64"
    height="64"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="1" y1="1" x2="23" y2="23" />
    <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
    <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
    <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
    <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <line x1="12" y1="20" x2="12.01" y2="20" />
  </svg>
);

/**
 * SVG icon component for 404 preset
 */
const NotFoundIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="64"
    height="64"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

/**
 * SVG icon component for 403 preset
 */
const ForbiddenIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="64"
    height="64"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <line x1="9" y1="9" x2="15" y2="15" />
    <line x1="15" y1="9" x2="9" y2="15" />
  </svg>
);

/**
 * SVG icon component for 500 preset
 */
const ServerErrorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="64"
    height="64"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
    <line x1="6" y1="6" x2="6.01" y2="6" />
    <line x1="6" y1="18" x2="6.01" y2="18" />
    <path d="M12 14v4" />
    <path d="M12 6v4" />
  </svg>
);

/**
 * Empty state presets configuration
 */
export const emptyPresets: Record<EmptyPresetType, IEmptyPreset> = {
  'no-data': {
    icon: <NoDataIcon />,
    title: 'No data yet',
    description: 'There is no data to display at the moment.',
  },
  'no-results': {
    icon: <NoResultsIcon />,
    title: 'No results found',
    description: 'Try adjusting your search or filter criteria.',
  },
  'no-permission': {
    icon: <NoPermissionIcon />,
    title: 'Access denied',
    description: 'You do not have permission to view this content.',
  },
  error: {
    icon: <ErrorIcon />,
    title: 'Something went wrong',
    description: 'An error occurred while loading this content.',
  },
  offline: {
    icon: <OfflineIcon />,
    title: 'No connection',
    description: 'Please check your internet connection and try again.',
  },
  '404': {
    icon: <NotFoundIcon />,
    title: 'Page not found',
    description: 'The page you are looking for does not exist.',
  },
  '403': {
    icon: <ForbiddenIcon />,
    title: 'Access forbidden',
    description: 'You are not authorized to access this resource.',
  },
  '500': {
    icon: <ServerErrorIcon />,
    title: 'Server error',
    description: 'Something went wrong on our end. Please try again later.',
  },
};
