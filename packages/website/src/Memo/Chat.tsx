import React from "react";
import type { Dispatch, FunctionComponent } from "react";
import { ChatKit, useChatKit } from "@openai/chatkit-react";
import type { ChatKitOptions } from "@openai/chatkit-react";
import { z } from "zod";

import type { ProofreadingMessage } from "../lintWorker";
import type { Memo, MemosAction } from "../useMemo";

const toolCallSchema = z.union([
  z.object({
    name: z.literal("get_memo"),
    params: z.object({}),
  }),
  z.object({
    name: z.literal("set_ai_lint_messages"),
    params: z.object({
      messages: z.array(
        z.object({
          line: z.number().min(1).describe("1-based line number"),
          column: z.number().min(1).describe("1-based column number"),
          text: z
            .string()
            .describe("Text at the line/column position, for validation"),
          message: z.string(),
          fix: z
            .object({
              text: z.string().describe("Replacement text for text"),
            })
            .nullable(),
        }),
      ),
    }),
  }),
]);
// ブラウザの console から printToolSchema() で JSON Schema を出力できる
// @ts-expect-error
window.printToolSchema = () =>
  console.log(JSON.stringify(z.toJSONSchema(toolCallSchema), null, 2));

export const Chat: FunctionComponent<{
  memo: Memo;
  dispatchMemos: Dispatch<MemosAction>;
}> = ({ memo, dispatchMemos }) => {
  const handleClientTool: NonNullable<ChatKitOptions["onClientTool"]> = (
    toolCall,
  ) => {
    try {
      console.log("onClientTool", toolCall);

      const { name, params } = toolCallSchema.parse(toolCall);
      switch (name) {
        case "get_memo": {
          return { result: memo.result, text: memo.text };
        }

        case "set_ai_lint_messages": {
          const errors: string[] = [];

          const aiMessages: ProofreadingMessage[] = params.messages.flatMap(
            (message) => {
              const lines = memo.text.split("\n");
              const lineText = lines.at(message.line - 1);
              if (lineText === undefined) {
                errors.push(
                  `line ${message.line}: line out of range (1-${lines.length})`,
                );
                return [];
              }

              const graphemes = [...new Intl.Segmenter().segment(lineText)].map(
                ({ segment }) => segment,
              );
              if (message.column > graphemes.length + 1) {
                errors.push(
                  `line ${message.line}, column ${message.column}: column out of range (1-${graphemes.length + 1})`,
                );
                return [];
              }

              const index =
                lines
                  .slice(0, message.line - 1)
                  .reduce((sum, line) => sum + line.length + 1, 0) +
                graphemes.slice(0, message.column - 1).join("").length;

              const actual = memo.text.slice(
                index,
                index + message.text.length,
              );

              if (actual !== message.text) {
                errors.push(
                  `line ${message.line}, column ${message.column}: expected "${message.text}" but found "${actual}"`,
                );
                return [];
              }

              return [
                {
                  ruleId: "ai",
                  message: message.message,
                  index,
                  severity: 0,
                  ...(message.fix && {
                    fix: {
                      range: [index, index + message.text.length],
                      text: message.fix.text,
                    },
                  }),
                },
              ];
            },
          );

          if (errors.length > 0) {
            throw new Error(
              `
                    Validation failed.
                    Please retry set_ai_lint_messages with correct 1-based line and column values.

                    ${errors.join("\n")}

                    Full text for reference:
${memo.text}
                  `,
            );
          }

          dispatchMemos((prevMemos) =>
            prevMemos.map((prevMemo) => {
              if (prevMemo.id !== memo.id || !prevMemo.result) {
                return prevMemo;
              }

              return {
                ...prevMemo,
                result: {
                  ...prevMemo.result,
                  messages: [
                    ...prevMemo.result.messages.filter(
                      (message) => message.ruleId !== "ai",
                    ),
                    ...aiMessages,
                  ],
                },
              };
            }),
          );

          return {};
        }

        default: {
          throw new Error(`Unknown tool: ${name satisfies never}`);
        }
      }
    } catch (exception) {
      console.error(exception);

      return { exception: String(exception) };
    }
  };

  const { control } = useChatKit({
    api: {
      getClientSecret: async () => {
        await new Promise<void>((resolve) =>
          grecaptcha.enterprise.ready(resolve),
        );
        const recaptchaToken = await grecaptcha.enterprise.execute(
          "6LeYs_YrAAAAAEUU58gmxMlJR0y9_qYB7YQ0FyIF",
          { action: "GET_CLIENT_SECRET" },
        );

        const response = await fetch(
          "https://chatkit-session-788918986145.us-central1.run.app/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              recaptchaToken,
              userID: memo.id,
            }),
          },
        );
        if (!response.ok) {
          throw new Error(
            `Failed to create session: ${response.status} ${response.statusText}`,
          );
        }
        const { clientSecret } = await response.json();

        return clientSecret;
      },
    },
    composer: {
      attachments: { enabled: true },
      placeholder: "校正さんに相談する",
    },
    startScreen: {
      prompts: [
        {
          label: "見直し箇所を解説して",
          prompt: "見直し箇所を解説して",
        },
        {
          label: "文章全体を校閲してください",
          prompt: "文章全体を校閲してください",
        },
        {
          label: "文章から読み取れる感情を教えて",
          prompt: "文章から読み取れる感情を教えて",
        },
      ],
    },
    threadItemActions: {
      feedback: true,
      retry: true,
    },
    onClientTool: handleClientTool,
  });

  return <ChatKit control={control} style={{ height: 500 }} />;
};
