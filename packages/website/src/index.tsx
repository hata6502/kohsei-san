import 'core-js';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import { StylesProvider } from '@material-ui/core/styles';
import * as Sentry from '@sentry/browser';
import App from './App';
import { ThemeProvider } from './ThemeProvider';

const renderFatalError = ({ message }: { message: React.ReactNode }) =>
  ReactDOM.render(
    <>
      {message}
      <br />

      <a
        href="https://helpfeel.com/hata6502/?kinds=%E6%A0%A1%E6%AD%A3%E3%81%95%E3%82%93"
        rel="noreferrer"
        target="_blank"
      >
        ヘルプ
      </a>
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

  ReactDOM.render(
    <StylesProvider injectFirst>
      <ThemeProvider>
        <App lintWorker={lintWorker} />
      </ThemeProvider>
    </StylesProvider>,
    document.querySelector('.app')
  );
};

main();
