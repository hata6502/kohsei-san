import React, { memo } from "react";
import type { PropsWithChildren } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import { jaJP } from "@mui/material/locale";

const ThemeProvider = memo(({ children }: PropsWithChildren) => {
  return (
    <MuiThemeProvider
      theme={createTheme(
        {
          palette: {
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
        jaJP,
      )}
    >
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
});

export { ThemeProvider };
