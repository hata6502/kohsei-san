import 'core-js';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import CssBaseline from '@material-ui/core/CssBaseline';
import { jaJP } from '@material-ui/core/locale';
import {
  createMuiTheme,
  StylesProvider,
  Theme,
  ThemeProvider as MuiThemeProvider,
} from '@material-ui/core/styles';
import * as Sentry from '@sentry/browser';
import App from './App';

declare module 'styled-components' {
  // eslint-disable-next-line
  export interface DefaultTheme extends Theme {}
}

const renderFatalError = ({ message }: { message: React.ReactNode }) =>
  ReactDOM.render(
    <>
      {message}
      <br />

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

  if (!window.Worker) {
    renderFatalError({ message: '校正さんを使用するには、Web Worker を有効にしてください。' });

    return;
  }

  const lintWorker = new Worker('lintWorker.js');

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
      renderFatalError({ message: '校正さんを使用するには、localStorage を有効にしてください。' });

      return;
    }
  }

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
        fontWeightMedium: 600,
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
            <App lintWorker={lintWorker} />
          </ThemeProvider>
        </MuiThemeProvider>
      </StylesProvider>
    </>,
    document.querySelector('.app')
  );
};

main();
