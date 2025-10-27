import React, { memo, useMemo } from "react";
import type { PropsWithChildren } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import { jaJP } from "@mui/material/locale";

const ThemeProvider = memo(({ children }: PropsWithChildren) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(
    () =>
      createTheme(
        {
          palette: {
            mode: prefersDarkMode ? "dark" : "light",
            background: {
              default: "#fafafa",
            },
            primary: {
              main: "#00857E",
            },
            secondary: {
              main: "#E71324",
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
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
});

export { ThemeProvider };
