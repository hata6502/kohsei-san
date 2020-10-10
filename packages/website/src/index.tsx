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

declare global {
  interface Window {
    kuromojin?: {
      dicPath?: string;
    };
    ['sudachi-synonyms-dictionary']?: string;
  }
}

declare module 'styled-components' {
  // eslint-disable-next-line
  export interface DefaultTheme extends Theme { }
}

const main = () => {
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

  try {
    const localStorageTest = 'localStorageTest';

    localStorage.setItem(localStorageTest, localStorageTest);
    localStorage.removeItem(localStorageTest);
  } catch (exception) {
    const unavailable =
      !(exception instanceof DOMException) ||
      (exception.code !== 22 &&
        exception.code !== 1014 &&
        exception.name !== 'QuotaExceededError' &&
        exception.name !== 'NS_ERROR_DOM_QUOTA_REACHED') ||
      !localStorage ||
      localStorage.length === 0;

    if (unavailable) {
      ReactDOM.render(
        <>
          校正さんを使用するには、localStorage を有効にしてください。
          <address>
            <a href="https://twitter.com/hata6502" rel="noreferrer" target="_blank">
              Twitter
            </a>
            <br />
            <a
              href="https://github.com/hata6502/kohsei-san/blob/master/README.md"
              rel="noreferrer"
              target="_blank"
            >
              このアプリについて
            </a>
          </address>
        </>,
        document.querySelector('.app')
      );

      return;
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
};

main();
