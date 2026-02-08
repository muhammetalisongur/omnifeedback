import React, { useEffect, useMemo, useState } from 'react';
import { FeedbackProvider } from 'omnifeedback';
import { MantineProvider } from '@mantine/core';
import { ChakraProvider } from '@chakra-ui/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ConfigProvider, theme as antdTheme } from 'antd';
import type { AdapterName } from '../App';
import { usePlaygroundStore } from '../stores/playground-store';

// Import Mantine styles
import '@mantine/core/styles.css';

interface AdapterProviderProps {
  adapter: AdapterName;
  children: React.ReactNode;
}

export function AdapterProvider({ adapter, children }: AdapterProviderProps): React.ReactElement {
  // Get toast config from store
  const { toastConfig } = usePlaygroundStore();

  // Track dark mode reactively via MutationObserver on <html> class attribute
  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  // MUI theme — recomputed when dark mode changes
  const muiThemeObj = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDark ? 'dark' : 'light',
        },
      }),
    [isDark]
  );

  // Note: Adapter selection is currently visual only.
  // The FeedbackProvider uses the default (headless) rendering.
  // Full adapter switching will be implemented in a future version.
  const content = (
    <FeedbackProvider
      toastStacked={toastConfig.stacked}
      toastMaxVisible={toastConfig.maxVisible}
    >
      {children}
    </FeedbackProvider>
  );

  switch (adapter) {
    case 'mantine':
      return (
        <MantineProvider>
          {content}
        </MantineProvider>
      );

    case 'chakra':
      return (
        <ChakraProvider resetCSS={false} cssVarsRoot="#chakra-scope">
          <div id="chakra-scope">
            {content}
          </div>
        </ChakraProvider>
      );

    case 'mui':
      return (
        <ThemeProvider theme={muiThemeObj}>
          {content}
        </ThemeProvider>
      );

    case 'antd':
      return (
        <ConfigProvider
          theme={{
            algorithm: isDark
              ? antdTheme.darkAlgorithm
              : antdTheme.defaultAlgorithm,
          }}
        >
          {content}
        </ConfigProvider>
      );

    default:
      return content;
  }
}
