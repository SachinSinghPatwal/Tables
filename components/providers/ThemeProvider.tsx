'use client';

import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { useAppSelector } from '@/lib/hooks/redux';
import { useEffect } from 'react';

interface MUIThemeProviderProps {
  children: React.ReactNode;
}

export function MUIThemeProvider({ children }: MUIThemeProviderProps) {
  const themeMode = useAppSelector((state) => state.dataTable.theme);

  // Apply theme class to document body for global styling
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;
    
    // Remove existing theme classes
    body.classList.remove('light-theme', 'dark-theme');
    html.classList.remove('light', 'dark');
    
    // Add current theme classes
    body.classList.add(`${themeMode}-theme`);
    html.classList.add(themeMode);
    
    // Set data attribute for CSS targeting
    html.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  const theme = createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: themeMode === 'dark' ? '#90caf9' : '#1976d2',
      },
      secondary: {
        main: themeMode === 'dark' ? '#f48fb1' : '#dc004e',
      },
      background: {
        default: themeMode === 'dark' ? '#121212' : '#ffffff',
        paper: themeMode === 'dark' ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: themeMode === 'dark' ? '#ffffff' : '#000000',
        secondary: themeMode === 'dark' ? '#b3b3b3' : '#666666',
      },
    },
    components: {
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: 600,
            backgroundColor: themeMode === 'dark' ? '#2a2a2a' : '#f5f5f5',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: 'background-color 0.3s ease, color 0.3s ease',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}