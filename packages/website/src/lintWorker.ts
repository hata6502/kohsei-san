import 'core-js';
import 'regenerator-runtime/runtime';

import type { TextlintResult } from '@textlint/kernel';
import { lint } from 'common/lint';
import type { LintOption } from 'common/lint';

declare global {
  interface Window {
    kuromojin?: {
      dicPath?: string;
    };
    'sudachi-synonyms-dictionary'?: string;
  }
}

// eslint-disable-next-line no-restricted-globals
self.kuromojin = {
  dicPath: 'dict',
};

// eslint-disable-next-line no-restricted-globals
self['sudachi-synonyms-dictionary'] = '/dict/sudachi-synonyms-dictionary.json';

interface LintWorkerLintMessage {
  lintOption: LintOption;
  text: string;
}

interface LintWorkerResultMessage {
  result: TextlintResult;
  text: string;
}

// eslint-disable-next-line no-restricted-globals
addEventListener('message', async (event: MessageEvent<LintWorkerLintMessage>) => {
  const text = event.data.text;

  const message: LintWorkerResultMessage = {
    result: await lint({ lintOption: event.data.lintOption, text }),
    text,
  };

  postMessage(message);
});

lint({ lintOption: {}, text: '初回校正時でもキャッシュにヒットさせるため。' });

export type { LintWorkerLintMessage, LintWorkerResultMessage };
