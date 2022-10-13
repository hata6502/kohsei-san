import 'core-js';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import { StylesProvider } from '@material-ui/core/styles';
import * as Sentry from '@sentry/browser';
import App from './App';
import { ThemeProvider } from './ThemeProvider';
import { injectByTextQuote } from './text-quote-injection';

const injectionConfigs = [
  {
    textQuoteSelector: {
      exact: '小説の一般的な作法',
      prefix: 'ショナルモードメモごとに校正設定を追加してカスタマイズできます。',
      suffix: '\n          \n        技術文書JTF日本語標準',
    },
    href: 'https://github.com/io-monad/textlint-rule-general-novel-style-ja',
  },
  {
    textQuoteSelector: {
      exact: '技術文書',
    },
    href: 'https://github.com/textlint-ja/textlint-rule-preset-ja-technical-writing',
  },
  {
    textQuoteSelector: {
      exact: 'JTF日本語標準スタイルガイド(翻訳用）',
    },
    href: 'https://www.jtf.jp/tips/styleguide',
  },
  {
    textQuoteSelector: {
      exact: '弱い表現の禁止',
    },
    href: 'https://github.com/textlint-ja/textlint-rule-ja-no-weak-phrase',
  },
  {
    textQuoteSelector: {
      exact: '単語の出現回数の上限',
    },
    href: 'https://github.com/KeitaMoromizato/textlint-rule-max-appearence-count-of-words',
  },
  {
    textQuoteSelector: {
      exact: '句点の統一',
    },
    href: 'https://github.com/textlint-ja/textlint-rule-ja-no-mixed-period',
  },
  {
    textQuoteSelector: {
      exact: 'フィラーの禁止',
    },
    href: 'https://github.com/textlint-ja/textlint-rule-no-filler',
  },
  {
    textQuoteSelector: {
      exact: 'スペースの統一',
    },
    href: 'https://github.com/textlint-ja/textlint-rule-preset-ja-spacing',
  },
  {
    textQuoteSelector: {
      exact: '教育漢字のみ許可',
    },
    href: 'https://github.com/textlint-ja/textlint-rule-ja-kyoiku-kanji',
  },
];

const renderFatalError = ({ message }: { message: React.ReactNode }) =>
  ReactDOM.render(
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

  injectByTextQuote(
    injectionConfigs.map(({ textQuoteSelector, href }) => ({
      textQuoteSelector,
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
      cleanUp: (linkElement) => {
        if (!(linkElement instanceof HTMLAnchorElement)) {
          throw new Error('invalid linkElement');
        }

        linkElement.remove();
      },
    }))
  );
};

main();
