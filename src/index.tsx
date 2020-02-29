import React from 'react';
import { ThemeProvider } from 'styled-components';
import ReactDOM from 'react-dom';
import pink from '@material-ui/core/colors/pink';
import purple from '@material-ui/core/colors/purple';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  createMuiTheme,
  StylesProvider,
  Theme,
  ThemeProvider as MuiThemeProvider
} from '@material-ui/core/styles';
import App from './App';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('service-worker.js'));
}

declare global {
  interface Window {
    kuromojin?: {
      dicPath?: string;
    };
  }
}

window.kuromojin = {
  dicPath: 'dict'
};

const theme = createMuiTheme({
  palette: {
    primary: pink,
    secondary: purple
  }
});

declare module 'styled-components' {
  // eslint-disable-next-line
  export interface DefaultTheme extends Theme { }
}

ReactDOM.render(
  <>
    <CssBaseline />

    <StylesProvider injectFirst>
      <MuiThemeProvider theme={theme}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </MuiThemeProvider>
    </StylesProvider>
  </>,
  document.querySelector('.app')
);
