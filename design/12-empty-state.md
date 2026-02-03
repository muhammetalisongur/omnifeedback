# Design: Empty State System

## Overview
Implement an empty state component for displaying meaningful messages when there's no data to show.

## Goals
- Clear messaging for empty states
- Preset empty state types
- Custom illustrations/icons
- Action buttons to guide users
- Multiple size variants
- Work with all UI library adapters

## Preset Types

| Type | Icon | Default Title | Use Case |
|------|------|---------------|----------|
| `no-data` | 📭 | Henüz veri yok | Lists, tables with no items |
| `no-results` | 🔍 | Sonuç bulunamadı | Search/filter with no matches |
| `no-permission` | 🔒 | Erişim engellendi | Unauthorized access |
| `error` | ⚠️ | Bir hata oluştu | Failed data loading |
| `offline` | 📡 | Bağlantı yok | No internet connection |
| `404` | 🔗 | Sayfa bulunamadı | Page not found |
| `403` | 🛡️ | Erişim engellendi | Forbidden |
| `500` | 💥 | Sunucu hatası | Server error |

## Component API

```typescript
export interface IEmptyProps {
  type?: 'no-data' | 'no-results' | 'no-permission' | 'error' | 'offline' | '404' | '403' | '500' | 'custom';
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  hideIcon?: boolean;
  action?: IEmptyAction | IEmptyAction[];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

export interface IEmptyAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'link';
  icon?: React.ReactNode;
}
```

## Usage Examples

```typescript
import { Empty } from 'omnifeedback';

// Basic usage
<Empty
  type="no-data"
  title="Henüz sipariş yok"
  description="İlk siparişinizi vererek başlayın"
  action={{ label: 'Alışverişe Başla', onClick: goToShop }}
/>

// Preset components
<Empty.NoData />
<Empty.NoResults description={`"${query}" için sonuç yok`} />
<Empty.NoPermission action={{ label: 'Yetki Talep Et', onClick: request }} />
<Empty.Error action={{ label: 'Yeniden Dene', onClick: retry }} />
<Empty.Offline />
<Empty.NotFound />

// Multiple actions
<Empty
  type="no-data"
  title="Koleksiyon boş"
  action={[
    { label: 'Manuel Ekle', onClick: add, variant: 'primary' },
    { label: 'İçe Aktar', onClick: importData, variant: 'secondary' },
  ]}
/>

// Custom empty state
<Empty
  icon={<CustomIllustration />}
  title="Uzaya Hazır mısın?"
  description="İlk projenizi oluşturun"
  action={{ label: 'Başla', onClick: start }}
/>
```

## Component Structure

```typescript
// src/components/Empty/Empty.tsx

export const Empty = memo(
  forwardRef<HTMLDivElement, IEmptyProps>(function Empty(props, ref) {
    const { type, title, description, icon, hideIcon, action, size = 'md' } = props;

    const preset = type !== 'custom' ? emptyPresets[type] : null;
    const displayTitle = title ?? preset?.title;
    const displayDesc = description ?? preset?.description;
    const displayIcon = icon ?? preset?.icon;

    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        {!hideIcon && displayIcon && (
          <div className="text-gray-400 mb-4">{displayIcon}</div>
        )}
        {displayTitle && (
          <h3 className="font-semibold text-gray-900 mb-2">{displayTitle}</h3>
        )}
        {displayDesc && (
          <p className="text-gray-500 max-w-md mb-6">{displayDesc}</p>
        )}
        {action && <ActionButtons actions={action} />}
      </div>
    );
  })
);

// Preset subcomponents
Empty.NoData = (props) => <Empty type="no-data" {...props} />;
Empty.NoResults = (props) => <Empty type="no-results" {...props} />;
Empty.NoPermission = (props) => <Empty type="no-permission" {...props} />;
Empty.Error = (props) => <Empty type="error" {...props} />;
Empty.Offline = (props) => <Empty type="offline" {...props} />;
Empty.NotFound = (props) => <Empty type="404" {...props} />;
Empty.Forbidden = (props) => <Empty type="403" {...props} />;
Empty.ServerError = (props) => <Empty type="500" {...props} />;
```

## Implementation Checklist

- [ ] Create `src/components/Empty/Empty.tsx`
- [ ] Create `src/components/Empty/presets.ts`
- [ ] Create `src/components/Empty/index.ts`
- [ ] Add default icons for each preset
- [ ] Write unit tests
- [ ] Verify accessibility (role="status")
- [ ] Test with all adapters
- [ ] Update IMPLEMENTATION.md

## Notes

- Empty is presentational only (no hook needed)
- Always provide actionable guidance
- Keep messages concise
- Support dark mode
