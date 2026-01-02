import React, { useCallback } from "react";
import type { Dispatch, FunctionComponent } from "react";
import { ChatKit, useChatKit } from "@openai/chatkit-react";
import type { ChatKitOptions } from "@openai/chatkit-react";
import type { TextlintMessage } from "@textlint/kernel";
import { z } from "zod";

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
          lineIndex: z.number().describe("0-based"),
          message: z.string(),
        }),
      ),
    }),
  }),
]);
//console.log(z.toJSONSchema(toolCallSchema));

export const Chat: FunctionComponent<{
  memo: Memo;
  dispatchMemos: Dispatch<MemosAction>;
}> = ({ memo, dispatchMemos }) => {
  const handleClientTool: NonNullable<ChatKitOptions["onClientTool"]> =
    useCallback(
      (toolCall) => {
        try {
          const { name, params } = toolCallSchema.parse(toolCall);
          switch (name) {
            case "get_memo": {
              return { result: memo.result, text: memo.text };
            }

            case "set_ai_lint_messages": {
              dispatchMemos((prevMemos) =>
                prevMemos.map((prevMemo) => {
                  if (prevMemo.id !== memo.id || !prevMemo.result) {
                    return prevMemo;
                  }

                  // @ts-expect-error
                  const aiMessages: TextlintMessage[] = params.messages.map(
                    (message) => ({
                      type: "lint",
                      ruleId: "ai",
                      message: message.message,
                      index: prevMemo.text
                        .split("\n")
                        .slice(0, message.lineIndex)
                        .join("\n").length,
                      severity: 0,
                    }),
                  );

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
      },
      [memo],
    );

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
    startScreen: {
      prompts: [
        {
          label: "文章にはどんな見直し箇所がある?",
          prompt: "文章にはどんな見直し箇所がある?",
        },
        {
          label: "文章全体を査読してください",
          prompt: "文章全体を査読してください",
        },
        {
          label: "文章から読み取れる感情を教えて",
          prompt: "文章から読み取れる感情を教えて",
        },
      ],
    },
    onClientTool: handleClientTool,
  });

  return <ChatKit control={control} style={{ height: 500 }} />;
};
