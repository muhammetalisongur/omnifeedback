# Design: Empty State System

## Overview
Implement an empty state component for displaying meaningful messages when there is no data to show. The Empty component is a purely presentational compound component (no hook needed) that provides 8 built-in presets with SVG icons, customizable titles, descriptions, action buttons, and size variants. It supports both direct usage and compound sub-components for common patterns.

## Goals
- Clear, actionable messaging for empty states
- 8 preset empty state types with default icons, titles, and descriptions
- Custom illustrations/icons support
- Single or multiple action buttons with variant styling
- Three size variants (sm, md, lg)
- Compound component pattern (`Empty.NoData`, `Empty.Error`, etc.)
- Dark mode support
- Work with all UI library adapters

## Preset Types

| Type | Icon | Default Title | Default Description | Use Case |
|------|------|---------------|---------------------|----------|
| `no-data` | Table/Grid SVG | No data yet | There is no data to display at the moment. | Lists, tables with no items |
| `no-results` | Search SVG | No results found | Try adjusting your search or filter criteria. | Search/filter with no matches |
| `no-permission` | Lock SVG | Access denied | You do not have permission to view this content. | Unauthorized access |
| `error` | Triangle Warning SVG | Something went wrong | An error occurred while loading this content. | Failed data loading |
| `offline` | WiFi-Off SVG | No connection | Please check your internet connection and try again. | No internet connection |
| `404` | Broken Link SVG | Page not found | The page you are looking for does not exist. | Page not found |
| `403` | Shield SVG | Access forbidden | You are not authorized to access this resource. | Forbidden access |
| `500` | Server SVG | Server error | Something went wrong on our end. Please try again later. | Server error |

## Component API

### IEmptyProps

```typescript
// src/components/Empty/Empty.tsx

export interface IEmptyProps {
  /** Preset type for default icon, title, description */
  type?: EmptyPresetType | 'custom';
  /** Custom title (overrides preset) */
  title?: string;
  /** Custom description (overrides preset) */
  description?: string;
  /** Custom icon (overrides preset) */
  icon?: ReactNode;
  /** Hide the icon entirely */
  hideIcon?: boolean;
  /** Action button(s) - single or array */
  action?: IEmptyAction | IEmptyAction[];
  /** Size variant */
  size?: EmptySize; // 'sm' | 'md' | 'lg'
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
  /** Custom children content */
  children?: ReactNode;
  /** Test ID for testing */
  testId?: string;
}
```

### IEmptyAction

```typescript
export interface IEmptyAction {
  /** Button label text */
  label: string;
  /** Click handler */
  onClick: () => void;
  /** Button style variant */
  variant?: 'primary' | 'secondary' | 'link';
  /** Optional icon before label */
  icon?: ReactNode;
}
```

### EmptyPresetType

```typescript
export type EmptyPresetType =
  | 'no-data'
  | 'no-results'
  | 'no-permission'
  | 'error'
  | 'offline'
  | '404'
  | '403'
  | '500';
```

### EmptySize

```typescript
export type EmptySize = 'sm' | 'md' | 'lg';
```

## Size Configurations

```typescript
const sizeConfig: Record<EmptySize, {
  padding: string;
  iconSize: string;
  titleSize: string;
  descSize: string;
}> = {
  sm: {
    padding: 'py-8',
    iconSize: 'w-12 h-12',
    titleSize: 'text-base',
    descSize: 'text-sm',
  },
  md: {
    padding: 'py-12',
    iconSize: 'w-16 h-16',
    titleSize: 'text-lg',
    descSize: 'text-base',
  },
  lg: {
    padding: 'py-16',
    iconSize: 'w-20 h-20',
    titleSize: 'text-xl',
    descSize: 'text-base',
  },
};
```

## Usage Examples

```typescript
import { Empty } from 'omnifeedback';

function DataTable({ items }) {
  if (items.length === 0) {
    return (
      <Empty
        type="no-data"
        title="No orders yet"
        description="Get started by placing your first order"
        action={{ label: 'Start Shopping', onClick: goToShop }}
      />
    );
  }

  return <Table data={items} />;
}

// Using preset compound components
function SearchResults({ results, query }) {
  if (results.length === 0) {
    return (
      <Empty.NoResults
        description={`No results for "${query}"`}
        action={{ label: 'Clear Search', onClick: clearSearch, variant: 'secondary' }}
      />
    );
  }

  return <ResultsList data={results} />;
}

// Multiple action buttons
function EmptyCollection() {
  return (
    <Empty
      type="no-data"
      title="Collection is empty"
      action={[
        { label: 'Add Manually', onClick: add, variant: 'primary' },
        { label: 'Import', onClick: importData, variant: 'secondary' },
      ]}
    />
  );
}

// Error state with retry
function ErrorView({ onRetry, onGoBack }) {
  return (
    <Empty.Error
      action={[
        { label: 'Retry', onClick: onRetry, variant: 'primary' },
        { label: 'Go Back', onClick: onGoBack, variant: 'secondary' },
      ]}
    />
  );
}

// Custom icon and content
function WelcomeEmpty() {
  return (
    <Empty
      type="custom"
      icon={<RocketIllustration />}
      title="Ready for Launch?"
      description="Create your first project to get started"
      action={{ label: 'Get Started', onClick: start }}
    />
  );
}

// Small size for inline containers
function SidebarEmpty() {
  return (
    <Empty.NoData
      size="sm"
      title="No bookmarks"
      action={{ label: 'Browse', onClick: browse, variant: 'link' }}
    />
  );
}

// With custom children
function CustomEmpty() {
  return (
    <Empty type="offline">
      <div className="mt-4 text-sm text-gray-400">
        Last synced: 5 minutes ago
      </div>
    </Empty>
  );
}

// Permission denied with request access
function PermissionEmpty() {
  return (
    <Empty.NoPermission
      action={{ label: 'Request Access', onClick: requestAccess }}
    />
  );
}

// HTTP error pages
function NotFoundPage() {
  return (
    <Empty.NotFound
      action={[
        { label: 'Go Home', onClick: goHome, variant: 'primary' },
        { label: 'Contact Support', onClick: contactSupport, variant: 'link' },
      ]}
    />
  );
}

function ForbiddenPage() {
  return <Empty.Forbidden />;
}

function ServerErrorPage() {
  return (
    <Empty.ServerError
      action={{ label: 'Try Again', onClick: retry }}
    />
  );
}
```

## Component Structure

### Empty Component (Core)

```typescript
// src/components/Empty/Empty.tsx

export const Empty = memo(
  forwardRef<HTMLDivElement, IEmptyProps>(function Empty(props, ref) {
    const {
      type = 'no-data',
      title,
      description,
      icon,
      hideIcon = false,
      action,
      size = 'md',
      className,
      style,
      children,
      testId,
    } = props;

    // Get preset configuration if not custom
    const preset = type !== 'custom' ? emptyPresets[type] : null;

    // Determine what to display (custom props override preset)
    const displayIcon = icon ?? preset?.icon;
    const displayTitle = title ?? preset?.title;
    const displayDescription = description ?? preset?.description;

    const sizes = sizeConfig[size];

    return (
      <div
        ref={ref}
        role="status"
        className={cn(
          'flex flex-col items-center justify-center text-center',
          sizes.padding,
          className
        )}
        style={style}
        data-testid={testId}
        data-empty-type={type}
      >
        {/* Icon */}
        {!hideIcon && displayIcon && (
          <div className={cn('text-gray-400 dark:text-gray-500 mb-4',
            sizes.iconSize, '[&>svg]:w-full [&>svg]:h-full')}>
            {displayIcon}
          </div>
        )}

        {/* Title */}
        {displayTitle && (
          <h3 className={cn('font-semibold text-gray-900 dark:text-gray-100 mb-2',
            sizes.titleSize)}>
            {displayTitle}
          </h3>
        )}

        {/* Description */}
        {displayDescription && (
          <p className={cn('text-gray-500 dark:text-gray-400 max-w-md', sizes.descSize)}>
            {displayDescription}
          </p>
        )}

        {/* Custom children */}
        {children}

        {/* Action buttons */}
        {action && <ActionButtons actions={action} size={size} />}
      </div>
    );
  })
);
```

### ActionButtons (Internal)

```typescript
// Internal component within Empty.tsx

function ActionButtons({ actions, size }: {
  actions: IEmptyAction | IEmptyAction[];
  size: EmptySize;
}): ReactElement {
  const actionList = Array.isArray(actions) ? actions : [actions];
  const isSmall = size === 'sm';

  return (
    <div className={cn('flex flex-wrap gap-3 justify-center', isSmall ? 'mt-4' : 'mt-6')}>
      {actionList.map((action, index) => {
        const variant = action.variant ?? 'primary';
        const isLink = variant === 'link';

        return (
          <button
            key={index}
            type="button"
            onClick={action.onClick}
            className={cn(
              'inline-flex items-center justify-center gap-2 font-medium transition-colors',
              isLink ? '' : 'px-4 py-2 rounded-md',
              isSmall && !isLink && 'text-sm px-3 py-1.5',
              buttonVariants[variant]
            )}
          >
            {action.icon && <span className="flex-shrink-0">{action.icon}</span>}
            {action.label}
          </button>
        );
      })}
    </div>
  );
}
```

### Button Variant Styles

```typescript
const buttonVariants: Record<NonNullable<IEmptyAction['variant']>, string> = {
  primary:
    'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  secondary:
    'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600',
  link:
    'text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400',
};
```

### Preset Configuration

```typescript
// src/components/Empty/presets.tsx

export interface IEmptyPreset {
  icon: ReactNode;
  title: string;
  description: string;
}

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
```

### Compound Component Pattern

```typescript
// src/components/Empty/index.tsx

type PresetProps = Omit<IEmptyProps, 'type'>;

// Individual preset components (each is memoized)
const NoData = memo(function NoData(props: PresetProps) {
  return <EmptyBase type="no-data" {...props} />;
});
NoData.displayName = 'Empty.NoData';

const NoResults = memo(function NoResults(props: PresetProps) {
  return <EmptyBase type="no-results" {...props} />;
});
NoResults.displayName = 'Empty.NoResults';

// ... and so on for all 8 presets

// Compound component interface
interface IEmptyCompound {
  (props: IEmptyProps & { ref?: React.Ref<HTMLDivElement> }): React.ReactElement | null;
  displayName?: string;
  NoData: typeof NoData;
  NoResults: typeof NoResults;
  NoPermission: typeof NoPermission;
  Error: typeof Error;
  Offline: typeof Offline;
  NotFound: typeof NotFound;
  Forbidden: typeof Forbidden;
  ServerError: typeof ServerError;
}

// Attach sub-components
const Empty = EmptyBase as unknown as IEmptyCompound;
Empty.NoData = NoData;
Empty.NoResults = NoResults;
Empty.NoPermission = NoPermission;
Empty.Error = Error;
Empty.Offline = Offline;
Empty.NotFound = NotFound;
Empty.Forbidden = Forbidden;
Empty.ServerError = ServerError;

export { Empty };
```

## Module Exports

```typescript
// src/components/Empty/index.tsx

// Component
export { Empty } from './index';

// Types
export type { IEmptyProps, IEmptyAction, EmptySize } from './Empty';
export type { EmptyPresetType, IEmptyPreset } from './presets';
export { emptyPresets } from './presets';
```

## Adapter Integration

The Empty component is primarily a **headless** component that uses Tailwind CSS classes directly. Unlike toast/modal/sheet, it does not have a dedicated adapter component in the `IFeedbackAdapter` interface because:

1. Empty states are **inline** components, not managed through the feedback store
2. They are rendered directly in the component tree, not via portals
3. Styling is handled by the component itself with Tailwind utility classes

However, adapter-based projects can override the Empty component by wrapping it or providing custom presets through the provider configuration.

## Accessibility Requirements

### ARIA Attributes

```typescript
// Root container
role="status"  // Indicates a live region for status information

// Icon SVGs
aria-hidden="true"  // All preset icons are decorative

// data attribute for type identification
data-empty-type={type}  // e.g., "no-data", "error", "404"
```

### Key Accessibility Notes

- `role="status"` makes the empty state a live region, so screen readers announce it
- All SVG icons include `aria-hidden="true"` since they are decorative
- Action buttons use standard `<button>` elements with visible labels
- Focus ring styles are included on all action button variants
- Color contrast meets WCAG AA requirements in both light and dark modes
- Title uses semantic `<h3>` heading for document structure

### Keyboard Support

| Key | Action |
|-----|--------|
| Tab | Navigate to action buttons |
| Enter/Space | Activate focused button |

## Testing Checklist

### Unit Tests

```typescript
describe('Empty', () => {
  describe('Default Rendering', () => {
    it('should render with default no-data type', () => {});
    it('should have role="status" for accessibility', () => {});
    it('should render default title from preset', () => {});
    it('should render default description from preset', () => {});
    it('should render default icon from preset', () => {});
  });

  describe('Custom Content', () => {
    it('should render custom title (overriding preset)', () => {});
    it('should render custom description (overriding preset)', () => {});
    it('should render custom icon (overriding preset)', () => {});
    it('should hide icon when hideIcon is true', () => {});
    it('should render children content', () => {});
  });

  describe('Preset Types', () => {
    it('should render no-data preset', () => {});
    it('should render no-results preset', () => {});
    it('should render no-permission preset', () => {});
    it('should render error preset', () => {});
    it('should render offline preset', () => {});
    it('should render 404 preset', () => {});
    it('should render 403 preset', () => {});
    it('should render 500 preset', () => {});
    it('should render custom type without preset defaults', () => {});
  });

  describe('Actions', () => {
    it('should render single action button', () => {});
    it('should render multiple action buttons', () => {});
    it('should render action with icon', () => {});
    it('should call onClick when button is clicked', () => {});
    it('should apply primary variant styles by default', () => {});
    it('should apply secondary variant styles', () => {});
    it('should apply link variant styles', () => {});
  });

  describe('Size Variants', () => {
    it('should apply small size styles (py-8)', () => {});
    it('should apply medium size styles by default (py-12)', () => {});
    it('should apply large size styles (py-16)', () => {});
  });

  describe('Compound Components', () => {
    it('should render Empty.NoData', () => {});
    it('should render Empty.NoResults', () => {});
    it('should render Empty.NoPermission', () => {});
    it('should render Empty.Error', () => {});
    it('should render Empty.Offline', () => {});
    it('should render Empty.NotFound', () => {});
    it('should render Empty.Forbidden', () => {});
    it('should render Empty.ServerError', () => {});
    it('should allow custom props on compound components', () => {});
  });

  describe('Custom Styling', () => {
    it('should apply custom className', () => {});
    it('should apply custom style', () => {});
  });
});
```

### Integration Tests

```typescript
describe('Empty Integration', () => {
  it('should render inline within parent component', () => {});
  it('should conditionally show based on data emptiness', () => {});
  it('should support dark mode styling', () => {});
  it('should work with all adapter themes', () => {});
});
```

## Implementation Checklist

- [x] Create `src/components/Empty/Empty.tsx`
- [x] Create `src/components/Empty/presets.tsx` with 8 SVG icon components
- [x] Create `src/components/Empty/index.tsx` with compound component pattern
- [x] Add default SVG icons for each preset type
- [x] Write unit tests (all passing)
- [x] Verify accessibility (`role="status"`, `aria-hidden` on icons)
- [x] Support dark mode via Tailwind `dark:` variants
- [ ] Test with all adapters
- [ ] Update IMPLEMENTATION.md

## Common Pitfalls

### 1. Missing Preset Override
- **Don't:** Assume custom `title` replaces the entire preset
- **Do:** Custom props (`title`, `description`, `icon`) override individual preset values; other preset values remain

### 2. Action Array vs Single
- **Don't:** Forget to handle both single action and array of actions
- **Do:** Normalize with `Array.isArray(actions) ? actions : [actions]`

### 3. Custom Type Without Content
- **Don't:** Use `type="custom"` without providing title/icon
- **Do:** When using `type="custom"`, always provide at least a `title` since no preset is loaded

### 4. Size Inconsistency
- **Don't:** Use large empty states in small containers
- **Do:** Use `size="sm"` for sidebars, cards, and inline contexts

### 5. Decorative Icons
- **Don't:** Forget `aria-hidden="true"` on decorative SVG icons
- **Do:** All preset icon components include `aria-hidden="true"` by default

## Notes

- Empty is **presentational only** (no hook, no store, no portal)
- Default type is `'no-data'` when no `type` prop is provided
- Custom props always override preset defaults (icon, title, description)
- All 8 preset icons are inline SVGs (no external dependencies)
- Supports `forwardRef` for parent component ref access
- Component is memoized for performance
- Dark mode is handled via Tailwind `dark:` class variants
- Children content renders between description and action buttons
