# Design: Sheet (Bottom Sheet) System

## Overview
Bottom sheet component that slides up from the bottom. Common in mobile interfaces for actions and menus.

## Goals
- Slide up from bottom
- Multiple snap points (partial/full)
- Drag to dismiss
- Action sheet variant
- Mobile-first design
- Work with all adapters

## Sheet API

```typescript
export interface IUseSheetReturn {
  open: (options: ISheetOptions) => string;
  showActions: (options: IActionSheetOptions) => Promise<string | null>;
  confirm: (options: ISheetConfirmOptions) => Promise<boolean>;
  close: (id: string) => void;
  closeAll: () => void;
  isOpen: boolean;
}
```

## Usage Examples

```typescript
const { sheet } = useFeedback();

// Content sheet with snap points
sheet.open({
  title: 'Filtreler',
  snapPoints: ['50%', '90%'],
  content: <FilterPanel />,
});

// Action sheet
const action = await sheet.showActions({
  title: 'Fotoğraf Seç',
  actions: [
    { key: 'camera', label: 'Kamera', icon: <CameraIcon /> },
    { key: 'gallery', label: 'Galeri', icon: <GalleryIcon /> },
  ],
});

if (action === 'camera') openCamera();

// Confirm sheet
const confirmed = await sheet.confirm({
  title: 'Çıkış yapmak istiyor musunuz?',
  confirmText: 'Çıkış Yap',
  destructive: true,
});
```

## Component Structure

- **Sheet**: Main container with drag handle, snap points
- **ActionSheetContent**: List of action buttons
- **SheetConfirmContent**: Confirm/cancel buttons

## Key Features

1. **Snap Points**: `['30%', '60%', '90%']` - Multiple height stops
2. **Drag to Dismiss**: Swipe down to close
3. **Action Sheet**: iOS-style action list
4. **Confirm Sheet**: Promise-based confirmation

## Implementation Checklist

- [ ] Create `src/hooks/useSheet.ts`
- [ ] Create `src/components/Sheet/Sheet.tsx`
- [ ] Create `src/components/Sheet/ActionSheetContent.tsx`
- [ ] Create `src/components/Sheet/SheetConfirmContent.tsx`
- [ ] Implement drag gesture handling
- [ ] Write unit tests
- [ ] Test on mobile devices
- [ ] Update IMPLEMENTATION.md

## Notes

- Mobile-first but works on desktop
- Use Drawer for desktop-first UIs
- Support touch and mouse events
- Remember iOS safe area padding
