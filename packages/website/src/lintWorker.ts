
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

self.kuromojin = {
  dicPath: String(new URL('/dict/', location.href)),
};

interface LintWorkerLintMessage {
  lintOption: LintOption;
  text: string;
}

interface LintWorkerResultMessage {
  result: TextlintResult;
  text: string;
}

addEventListener('message', async (event: MessageEvent<LintWorkerLintMessage>) => {
  const text = event.data.text;

  const message: LintWorkerResultMessage = {
    // @ts-expect-error 型が定義されていない。
    result: await lint({ lintOption: event.data.lintOption, text }),
    text,
  };

  postMessage(message);
});

lint({ lintOption: {}, text: '初回校正時でもキャッシュにヒットさせるため。' });

export type { LintWorkerLintMessage, LintWorkerResultMessage };
