import 'core-js';
import 'regenerator-runtime/runtime';

import React from 'react';
import { ThemeProvider } from 'styled-components';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { jaJP } from '@material-ui/core/locale';
import {
  createMuiTheme,
  StylesProvider,
  Theme,
  ThemeProvider as MuiThemeProvider,
} from '@material-ui/core/styles';
import * as BrowserFS from 'browserfs';
import * as Sentry from '@sentry/browser';
import App from './App';
import initializeDict from './dict';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    beforeSend: (event) => {
      if (event.exception) {
        Sentry.showReportDialog({ eventId: event.event_id });
      }

      return event;
    },
    dsn: 'https://c98bf237258047cb89f0b618d16bbf53@sentry.io/3239618',
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('service-worker.js'));
  }
}

declare global {
  interface Window {
    kuromojin?: {
      dicPath?: string;
    };
    ['sudachi-synonyms-dictionary']?: string;
  }
}

window.kuromojin = {
  dicPath: 'dict',
};

window['sudachi-synonyms-dictionary'] = '/dict/sudachi-synonyms-dictionary.json';

BrowserFS.install(window);
BrowserFS.configure(
  {
    fs: 'LocalStorage',
  },
  (exception) => {
    if (exception) {
      throw exception;
    }
  }
);

initializeDict();

const theme = createMuiTheme(
  {
    palette: {
      primary: {
        main: '#f15d69',
      },
      secondary: {
        main: '#00a39b',
      },
    },
    typography: {
      fontFamily:
        '"Noto Sans CJK JP", "ヒラギノ角ゴシック Pro", "Hiragino Kaku Gothic Pro", "游ゴシック Medium", "Yu Gothic Medium", "Roboto", "Helvetica", "Arial", sans-serif',
    },
  },
  jaJP
);

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
