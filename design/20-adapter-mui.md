# Design: MUI (Material UI) Adapter

## Overview
Implement the MUI adapter using @mui/material components.

## Dependencies

```json
{
  "peerDependencies": {
    "@mui/material": "^5.0.0",
    "@emotion/react": "^11.0.0",
    "@emotion/styled": "^11.0.0"
  }
}
```

## Adapter Structure

```typescript
// src/adapters/mui/index.ts

import type { IFeedbackAdapter } from '../types';

export const muiAdapter: IFeedbackAdapter = {
  name: 'mui',
  version: '1.0.0',
  ToastComponent: MuiToast,
  ToastContainerComponent: MuiToastContainer,
  ModalComponent: MuiModal,
  LoadingComponent: MuiLoading,
  LoadingOverlayComponent: MuiLoadingOverlay,
  AlertComponent: MuiAlert,
  ProgressComponent: MuiProgress,
  ConfirmComponent: MuiConfirm,
};
```

## Components

### Toast - Uses MUI Alert inside custom container
### Modal - Uses MUI Dialog
### Loading - Uses MUI CircularProgress
### LoadingOverlay - Uses MUI Backdrop + CircularProgress
### Alert - Uses MUI Alert
### Progress - Uses MUI LinearProgress/CircularProgress
### Confirm - Uses MUI Dialog with confirm/cancel buttons

## Implementation Checklist

- [ ] Create all component files in `src/adapters/mui/`
- [ ] Create `src/adapters/mui/index.ts`
- [ ] Write integration tests
- [ ] Test with ThemeProvider
- [ ] Update IMPLEMENTATION.md

## Notes

- Requires @mui/material
- Uses MUI's built-in components
- Follows Material Design patterns
