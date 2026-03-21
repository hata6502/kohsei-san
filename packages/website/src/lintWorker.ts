import type { TextlintMessage } from "@textlint/kernel";
import { lint } from "core";
import type { LintOption } from "core";

export type ProofreadingMessageFix = Pick<
  NonNullable<TextlintMessage["fix"]>,
  "range" | "text"
>;

export interface ProofreadingMessage
  extends Pick<TextlintMessage, "index" | "message" | "ruleId"> {
  fix?: ProofreadingMessageFix;
  severity: number;
}

export interface ProofreadingResult {
  messages: ProofreadingMessage[];
}

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

export interface LintWorkerLintMessage {
  lintOption: LintOption;
  text: string;
}

export interface LintWorkerResultMessage {
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
