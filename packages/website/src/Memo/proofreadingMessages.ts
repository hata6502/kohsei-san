import type { ProofreadingMessage } from "../lintWorker";

export interface LintMessage {
  index: ProofreadingMessage["index"];
  messages: ProofreadingMessage[];
}

export const getLintMessages = (messages: ProofreadingMessage[]) => {
  const lintMessages: LintMessage[] = [];

  [...messages]
    .sort((a, b) => a.index - b.index)
    .forEach((message) => {
      const duplicatedMessage = lintMessages.find(
        ({ index }) => index === message.index,
      );

      if (duplicatedMessage) {
        duplicatedMessage.messages.push(message);
      } else {
        lintMessages.push({
          index: message.index,
          messages: [message],
        });
      }
    });

  return lintMessages;
};

export const getMessageRange = ({
  message,
  text,
}: {
  message: ProofreadingMessage;
  text: string;
}) => {
  if (message.fix) {
    return message.fix.range;
  }

  const start = Math.min(message.index, text.length);
  const end = Math.min(start + 1, text.length);

  return [start, end] as const;
};

export const getMessageSnippet = ({
  lintMessage,
  text,
}: {
  lintMessage: LintMessage;
  text: string;
}) => {
  const [start, end] = getMessageRange({
    message: lintMessage.messages[0],
    text,
  });

  return {
    afterText: text.slice(end, Math.min(end + 5, text.length)),
    beforeText: text.slice(Math.max(start - 5, 0), start),
    targetText: text.slice(start, end) || "（なし）",
  };
};
