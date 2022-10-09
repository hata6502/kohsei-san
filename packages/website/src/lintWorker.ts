import 'core-js';
import 'regenerator-runtime/runtime';

import type { TextlintResult } from '@textlint/kernel';
import { lint } from 'core';
import type { LintOption } from 'core';

declare global {
  interface Window {
    kuromojin?: {
      dicPath?: string;
    };
  }
}

// eslint-disable-next-line no-restricted-globals
self.kuromojin = {
  dicPath: 'https://kohsei-san.hata6502.com/dict/',
};

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
