import type { TextlintMessage, TextlintRuleSeverityLevel } from "@textlint/kernel";
import { lint } from "core";
import type { LintOption } from "core";

export type ProofreadingMessageFix = Pick<
  NonNullable<TextlintMessage["fix"]>,
  "range" | "text"
>;

export interface ProofreadingMessage
  extends Pick<TextlintMessage, "index" | "message" | "ruleId" | "severity"> {
  fix?: ProofreadingMessageFix;
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

const getTextlintRuleSeverityLevel = ({
  severity,
}: {
  severity: number;
}): TextlintRuleSeverityLevel => {
  switch (severity) {
    case 0:
    case 1:
    case 2:
    case 3:
      return severity;

    default:
      throw new Error(`Unknown severity: ${severity}`);
  }
};

const toProofreadingMessage = ({
  message,
}: {
  message: Awaited<ReturnType<typeof lint>>["messages"][number];
}): ProofreadingMessage => ({
  index: message.index,
  message: message.message,
  ruleId: message.ruleId,
  ...(message.fix && { fix: message.fix }),
  severity: getTextlintRuleSeverityLevel({ severity: message.severity }),
});

const toProofreadingResult = ({
  result,
}: {
  result: Awaited<ReturnType<typeof lint>>;
}): ProofreadingResult => ({
  messages: result.messages.map((message) =>
    toProofreadingMessage({ message }),
  ),
});

addEventListener(
  "message",
  async (event: MessageEvent<LintWorkerLintMessage>) => {
    const text = event.data.text;
    const result = await lint({ lintOption: event.data.lintOption, text });

    const message: LintWorkerResultMessage = {
      result: toProofreadingResult({ result }),
      text,
    };

    postMessage(message);
  },
);

lint({ lintOption: {}, text: "初回校正時でもキャッシュにヒットさせるため。" });
