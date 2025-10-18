import Clarity from "@microsoft/clarity";
import React from 'react';
import { createRoot } from 'react-dom/client';
import { StylesProvider } from '@mui/styles';
import App from './App';
import { ThemeProvider, Theme, StyledEngineProvider } from './ThemeProvider';


declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


const appElement = document.querySelector('.app');

if (!appElement) {
  throw new Error('App container ".app" not found');
}

const root = createRoot(appElement);

const renderFatalError = ({ message }: { message: React.ReactNode }) =>
  root.render(
    <>
      {message}
      <br />

      <a
        href="https://helpfeel.com/hata6502/?q=%E6%96%87%E7%AB%A0%E6%A0%A1%E6%AD%A3"
        rel="noreferrer"
        target="_blank"
      >
        ヘルプ
      </a>
    </>
  );

const main = () => {
  Clarity.init("sgagyas3lh");

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('service-worker.js'));
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

  root.render(
    <StylesProvider injectFirst>
      <StyledEngineProvider injectFirst>
        <ThemeProvider>
          <App lintWorker={lintWorker} />
        </ThemeProvider>
      </StyledEngineProvider>
    </StylesProvider>
  );
};

main();
