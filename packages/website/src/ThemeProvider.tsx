import React, { memo, useMemo } from 'react';
import type { FunctionComponent, ReactNode } from 'react';
import { CssBaseline, useMediaQuery } from '@mui/material';
import {
  ThemeProvider as MuiThemeProvider,
  StyledEngineProvider,
  createTheme,
} from '@mui/material/styles';
import { ThemeProvider as StylesThemeProvider } from '@mui/styles';
import type { Theme } from '@mui/material/styles';
import { jaJP } from '@mui/material/locale';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}

const StyledComponentsThemeProvider =
  StyledThemeProvider as unknown as React.ComponentType<{
    children?: ReactNode;
    theme: Theme;
  }>;

const ThemeProvider: FunctionComponent<{ children?: ReactNode }> = memo(
  ({ children }) => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const theme = useMemo(
      () =>
        createTheme(
          {
            palette: {
              mode: prefersDarkMode ? 'dark' : 'light',
              primary: {
                main: '#00a39b',
              },
              secondary: {
                main: '#f15d69',
              },
            },
            typography: {
              fontFamily:
                '"Noto Sans CJK JP", "ヒラギノ角ゴシック Pro", "Hiragino Kaku Gothic Pro", "游ゴシック Medium", "Yu Gothic Medium", "Roboto", "Helvetica", "Arial", sans-serif',
            },
          },
          jaJP
        ),
      [prefersDarkMode]
    );

    return (
      <MuiThemeProvider theme={theme}>
        <StylesThemeProvider theme={theme}>
          <StyledComponentsThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </StyledComponentsThemeProvider>
        </StylesThemeProvider>
      </MuiThemeProvider>
    );
  }
);

export { ThemeProvider };
export type { Theme };
export { StyledEngineProvider };
