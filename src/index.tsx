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
import * as BrowserFS from 'browserfs';
import fs from 'fs';
import * as Sentry from '@sentry/browser';
import App from './App';
import kanjiOpen from './prh/kanji-open.yml';
import spoken from './prh/spoken.yml';
import typo from './prh/typo.yml';
import webPlusDb from './prh/web+db.yml';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({ dsn: 'https://c98bf237258047cb89f0b618d16bbf53@sentry.io/3239618' });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('service-worker.js'));
  }
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

BrowserFS.install(window);
BrowserFS.configure(
  {
    fs: 'LocalStorage'
  },
  exception => {
    if (exception) {
      throw exception;
    }
  }
);

fs.writeFileSync('kanji-open.yml', kanjiOpen);
fs.writeFileSync('spoken.yml', spoken);
fs.writeFileSync('typo.yml', typo);
fs.writeFileSync('web+db.yml', webPlusDb);

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
