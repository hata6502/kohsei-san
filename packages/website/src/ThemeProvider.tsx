import React, { memo, useMemo } from 'react';
import type { PropsWithChildren } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import { jaJP } from '@mui/material/locale';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

declare module 'styled-components' {
  // Share the MUI theme with styled-components consumers.
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends Theme {}
}

type StyledThemeProviderProps = PropsWithChildren<{ theme: Theme }>;

const StyledThemeProviderComponent =
  StyledThemeProvider as unknown as React.ComponentType<StyledThemeProviderProps>;

const ThemeProvider = memo(({ children }: PropsWithChildren) => {
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
      <StyledThemeProviderComponent theme={theme}>
        <CssBaseline />
        {children}
      </StyledThemeProviderComponent>
    </MuiThemeProvider>
  );
});

export { ThemeProvider };
