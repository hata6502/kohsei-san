import 'core-js';
import 'regenerator-runtime/runtime';

import type { TextlintResult } from '@textlint/kernel';
import lint from 'common/lint';

declare global {
  interface Window {
    kuromojin?: {
      dicPath?: string;
    };
    ['sudachi-synonyms-dictionary']?: string;
  }
}

// eslint-disable-next-line no-restricted-globals
self.kuromojin = {
  dicPath: 'dict',
};

// eslint-disable-next-line no-restricted-globals
self['sudachi-synonyms-dictionary'] = '/dict/sudachi-synonyms-dictionary.json';

interface LintWorkerMessage {
  result: TextlintResult;
  text: string;
}

// eslint-disable-next-line no-restricted-globals
addEventListener('message', async (event: MessageEvent<string>) => {
  const text = event.data;

  const message: LintWorkerMessage = {
    result: await lint(text),
    text,
  };

  postMessage(message);
});

lint('初回校正時でもキャッシュにヒットさせるため。');

export type { LintWorkerMessage };
