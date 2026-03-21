import { lint } from "core";
import type { LintOption } from "core";
import type { ProofreadingResult } from "./useMemo";

declare global {
  interface Window {
    kuromojin?: {
      dicPath?: string;
    };
  }
}

self.kuromojin = {
  dicPath: String(new URL("/dict/", location.href)),
};

interface LintWorkerLintMessage {
  lintOption: LintOption;
  text: string;
}

interface LintWorkerResultMessage {
  result: ProofreadingResult;
  text: string;
}

addEventListener(
  "message",
  async (event: MessageEvent<LintWorkerLintMessage>) => {
    const text = event.data.text;
    const result = await lint({ lintOption: event.data.lintOption, text });

    const message: LintWorkerResultMessage = {
      result,
      text,
    };

    postMessage(message);
  },
);

lint({ lintOption: {}, text: "初回校正時でもキャッシュにヒットさせるため。" });

export type { LintWorkerLintMessage, LintWorkerResultMessage };
