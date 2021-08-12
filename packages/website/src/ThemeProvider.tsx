import React, { memo, useMemo } from 'react';
import type { FunctionComponent } from 'react';
import {
  CssBaseline,
  ThemeProvider as MuiThemeProvider,
  createTheme,
  useMediaQuery,
} from '@material-ui/core';
import type { Theme } from '@material-ui/core';
import { jaJP } from '@material-ui/core/locale';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

declare module 'styled-components' {
  // eslint-disable-next-line
  export interface DefaultTheme extends Theme { }
}

const ThemeProvider: FunctionComponent = memo(({ children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () =>
      createTheme(
        {
          palette: {
            type: prefersDarkMode ? 'dark' : 'light',
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
      <StyledThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </StyledThemeProvider>
    </MuiThemeProvider>
  );
});

export { ThemeProvider };
