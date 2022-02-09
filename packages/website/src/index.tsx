import 'core-js';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import { StylesProvider } from '@material-ui/core/styles';
import * as Sentry from '@sentry/browser';
import App from './App';
import { ThemeProvider } from './ThemeProvider';
import { injectByTextFragments } from './text-fragment-injection.min';

const injectionConfigs = [
  {
    textFragments: [
      '%E5%B0%8F%E8%AA%AC%E3%81%AE%E4%B8%80%E8%88%AC%E7%9A%84%E3%81%AA%E4%BD%9C%E6%B3%95',
    ],
    href: 'https://github.com/io-monad/textlint-rule-general-novel-style-ja',
  },
  {
    textFragments: ['%E6%8A%80%E8%A1%93%E6%96%87%E6%9B%B8'],
    href: 'https://github.com/textlint-ja/textlint-rule-preset-ja-technical-writing',
  },
  {
    textFragments: [
      'JTF%E6%97%A5%E6%9C%AC%E8%AA%9E%E6%A8%99%E6%BA%96%E3%82%B9%E3%82%BF%E3%82%A4%E3%83%AB%E3%82%AC%E3%82%A4%E3%83%89(%E7%BF%BB%E8%A8%B3%E7%94%A8%EF%BC%89',
    ],
    href: 'https://www.jtf.jp/tips/styleguide',
  },
  {
    textFragments: ['%E8%A1%A8%E7%8F%BE%E3%81%AE%E7%A6%81%E6%AD%A2'],
    href: 'https://github.com/textlint-ja/textlint-rule-ja-no-weak-phrase',
  },
  {
    textFragments: [
      '%E5%8D%98%E8%AA%9E%E3%81%AE%E5%87%BA%E7%8F%BE%E5%9B%9E%E6%95%B0%E3%81%AE%E4%B8%8A%E9%99%90',
    ],
    href: 'https://github.com/KeitaMoromizato/textlint-rule-max-appearence-count-of-words',
  },
  {
    textFragments: ['%E5%8F%A5%E7%82%B9%E3%81%AE%E7%B5%B1%E4%B8%80'],
    href: 'https://github.com/textlint-ja/textlint-rule-ja-no-mixed-period',
  },
  {
    textFragments: ['%E3%83%95%E3%82%A3%E3%83%A9%E3%83%BC%E3%81%AE%E7%A6%81%E6%AD%A2'],
    href: 'https://github.com/textlint-ja/textlint-rule-no-filler',
  },
  {
    textFragments: ['%E3%82%B9%E3%83%9A%E3%83%BC%E3%82%B9%E3%81%AE%E7%B5%B1%E4%B8%80'],
    href: 'https://github.com/textlint-ja/textlint-rule-preset-ja-spacing',
  },
  {
    textFragments: ['%E6%95%99%E8%82%B2%E6%BC%A2%E5%AD%97%E3%81%AE%E3%81%BF%E8%A8%B1%E5%8F%AF'],
    href: 'https://github.com/textlint-ja/textlint-rule-ja-kyoiku-kanji',
  },
];

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

  injectByTextFragments(
    injectionConfigs.map(({ textFragments, href }) => ({
      textFragments,
      inject: (range: Range) => {
        const linkElement = document.createElement('a');

        linkElement.href = href;
        linkElement.rel = 'noopener';
        linkElement.target = '_blank';
        linkElement.style.textDecoration = 'none';

        linkElement.innerHTML = `
          <img
           src="8737dd05a68d04d808dfdb81c6783be1.png"
           style="opacity: 0.5; vertical-align: text-bottom; width: 18px; "
          />
        `;

        range.collapse();
        range.insertNode(linkElement);

        return linkElement;
      },
      cleanUp: (linkElement: HTMLAnchorElement) => linkElement.remove(),
    }))
  );
};

main();
