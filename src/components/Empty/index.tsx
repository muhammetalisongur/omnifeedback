/**
 * Empty state component exports
 * Provides empty state display with preset types and compound components
 */

import { memo } from 'react';
import { Empty as EmptyBase, type IEmptyProps } from './Empty';

// Re-export types
export type { IEmptyProps, IEmptyAction, EmptySize } from './Empty';
export type { EmptyPresetType, IEmptyPreset } from './presets';
export { emptyPresets } from './presets';

/**
 * Props for preset components (omit type since it's fixed)
 */
type PresetProps = Omit<IEmptyProps, 'type'>;

/**
 * NoData preset component
 */
const NoData = memo(function NoData(props: PresetProps) {
  return <EmptyBase type="no-data" {...props} />;
});
NoData.displayName = 'Empty.NoData';

/**
 * NoResults preset component
 */
const NoResults = memo(function NoResults(props: PresetProps) {
  return <EmptyBase type="no-results" {...props} />;
});
NoResults.displayName = 'Empty.NoResults';

/**
 * NoPermission preset component
 */
const NoPermission = memo(function NoPermission(props: PresetProps) {
  return <EmptyBase type="no-permission" {...props} />;
});
NoPermission.displayName = 'Empty.NoPermission';

/**
 * Error preset component
 */
const Error = memo(function Error(props: PresetProps) {
  return <EmptyBase type="error" {...props} />;
});
Error.displayName = 'Empty.Error';

/**
 * Offline preset component
 */
const Offline = memo(function Offline(props: PresetProps) {
  return <EmptyBase type="offline" {...props} />;
});
Offline.displayName = 'Empty.Offline';

/**
 * NotFound (404) preset component
 */
const NotFound = memo(function NotFound(props: PresetProps) {
  return <EmptyBase type="404" {...props} />;
});
NotFound.displayName = 'Empty.NotFound';

/**
 * Forbidden (403) preset component
 */
const Forbidden = memo(function Forbidden(props: PresetProps) {
  return <EmptyBase type="403" {...props} />;
});
Forbidden.displayName = 'Empty.Forbidden';

/**
 * ServerError (500) preset component
 */
const ServerError = memo(function ServerError(props: PresetProps) {
  return <EmptyBase type="500" {...props} />;
});
ServerError.displayName = 'Empty.ServerError';

/**
 * Compound component interface
 */
interface IEmptyCompound {
  (props: IEmptyProps & { ref?: React.Ref<HTMLDivElement> }): React.ReactElement | null;
  displayName?: string;
  /** No data preset */
  NoData: typeof NoData;
  /** No results preset */
  NoResults: typeof NoResults;
  /** No permission preset */
  NoPermission: typeof NoPermission;
  /** Error preset */
  Error: typeof Error;
  /** Offline preset */
  Offline: typeof Offline;
  /** 404 Not Found preset */
  NotFound: typeof NotFound;
  /** 403 Forbidden preset */
  Forbidden: typeof Forbidden;
  /** 500 Server Error preset */
  ServerError: typeof ServerError;
}

/**
 * Create compound component
 */
const Empty = EmptyBase as unknown as IEmptyCompound;

// Attach preset subcomponents
Empty.NoData = NoData;
Empty.NoResults = NoResults;
Empty.NoPermission = NoPermission;
Empty.Error = Error;
Empty.Offline = Offline;
Empty.NotFound = NotFound;
Empty.Forbidden = Forbidden;
Empty.ServerError = ServerError;

export { Empty };
