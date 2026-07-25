import {
  ActionBarPrimitive,
  AssistantRuntimeProvider,
  AuiIf,
  ComposerPrimitive,
  MessagePrimitive,
  Suggestions,
  SuggestionPrimitive,
  ThreadPrimitive,
  Tools,
  defineToolkit,
  useAui,
  InMemoryThreadListAdapter,
  useRemoteThreadListRuntime,
} from "@assistant-ui/react";
import type {
  MessageStorageEntry,
  ThreadHistoryAdapter,
} from "@assistant-ui/react";
import {
  AssistantChatTransport,
  useChatRuntime,
} from "@assistant-ui/react-ai-sdk";
import { MarkdownTextPrimitive } from "@assistant-ui/react-markdown";
import {
  PaperAirplaneIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import CardActions from "@mui/material/CardActions";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { lastAssistantMessageIsCompleteWithToolCalls } from "ai";
import React, { useMemo } from "react";
import type { Dispatch, FunctionComponent } from "react";
import remarkGfm from "remark-gfm";
import { z } from "zod";

import type { ProofreadingMessage } from "../lintWorker";
import { getMemoTitle } from "../useMemo";
import type { Memo, MemosAction } from "../useMemo";

const getMemoParameters = z.object({});
type GetMemoParameters = z.infer<typeof getMemoParameters>;
type GetMemoResult = Pick<Memo, "result" | "text">;

const listOtherMemosParameters = z.object({});
type ListOtherMemosParameters = z.infer<typeof listOtherMemosParameters>;
interface ListOtherMemosResult {
  memos: (Pick<Memo, "id" | "updatedAt"> & { title: string })[];
}

const getOtherMemosParameters = z.object({ ids: z.array(z.string()) });
type GetOtherMemosParameters = z.infer<typeof getOtherMemosParameters>;
interface GetOtherMemosResult {
  memos: Pick<Memo, "id" | "text">[];
}

const setAILintMessagesParameters = z.object({
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
});
type SetAILintMessagesParameters = z.infer<typeof setAILintMessagesParameters>;
interface SetAILintMessagesResult {}

export const Chat: FunctionComponent<{
  memo: Memo;
  memos: Memo[];
  dispatchMemos: Dispatch<MemosAction>;
}> = ({ memo, memos, dispatchMemos }) => {
  // useMemoを入れて安定化する
  // https://www.assistant-ui.com/docs/api-reference/tools
  const toolkit = useMemo(
    () =>
      defineToolkit({
        get_memo: {
          type: "frontend",
          description: "文章を取得する",
          parameters: getMemoParameters,
          execute: ({}: GetMemoParameters): GetMemoResult => ({
            result: memo.result,
            text: memo.text,
          }),
          renderText: { complete: "文章を読みました。" },
        },
        list_other_memos: {
          type: "frontend",
          description: "他のメモの一覧を取得する",
          parameters: listOtherMemosParameters,
          execute: ({}: ListOtherMemosParameters): ListOtherMemosResult => ({
            memos: memos
              .filter(({ id }) => id !== memo.id)
              .map((memo) => ({
                id: memo.id,
                title: getMemoTitle(memo),
                updatedAt: memo.updatedAt,
              })),
          }),
          renderText: { complete: "メモの一覧を取得しました。" },
        },
        get_other_memos: {
          type: "frontend",
          description: "指定した他のメモの本文を取得する",
          parameters: getOtherMemosParameters,
          execute: ({ ids }: GetOtherMemosParameters): GetOtherMemosResult => ({
            memos: ids.map((id) => {
              const otherMemo = memos.find(
                (otherMemo) => otherMemo.id === id && otherMemo.id !== memo.id,
              );
              if (!otherMemo) {
                throw new Error(`Unknown other memo id: ${id}`);
              }
              return { id: otherMemo.id, text: otherMemo.text };
            }),
          }),
          renderText: {
            complete: ({ result }: { result: GetOtherMemosResult }) =>
              `メモ${result.memos.map((memo) => `「${getMemoTitle(memo)}」`).join("")}を読みました。`,
          },
        },
        set_ai_lint_messages: {
          type: "frontend",
          description: "AIによる見直し箇所をセットする",
          parameters: setAILintMessagesParameters,
          execute: ({
            messages,
          }: SetAILintMessagesParameters): SetAILintMessagesResult => {
            const errors: string[] = [];

            const aiMessages: ProofreadingMessage[] = messages.flatMap(
              (message) => {
                const lines = memo.text.split("\n");
                const lineText = lines.at(message.line - 1);
                if (lineText === undefined) {
                  errors.push(
                    `line ${message.line}: line out of range (1-${lines.length})`,
                  );
                  return [];
                }

                const graphemes = [
                  ...new Intl.Segmenter().segment(lineText),
                ].map(({ segment }) => segment);
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
                if (prevMemo.id !== memo.id) {
                  return prevMemo;
                }

                return {
                  ...prevMemo,
                  result: {
                    ...prevMemo.result,
                    messages: [
                      ...(prevMemo.result?.messages.filter(
                        (message) => message.ruleId !== "ai",
                      ) ?? []),
                      ...aiMessages,
                    ],
                  },
                };
              }),
            );

            return {};
          },
          renderText: { complete: "見直し箇所を表示しました。" },
        },
      }),
    [memo.result, memo.text, memos],
  );

  const aui = useAui({
    tools: Tools({ toolkit }),
    suggestions: Suggestions([
      "文章全体を校閲して",
      "他のメモとのズレを探して",
      "飾りっぽい表現や造語を見直して",
      "機密情報を伏せ字に置換して",
      "文章から読み取れる感情を教えて",
    ]),
  });

  class SingleThreadListAdapter extends InMemoryThreadListAdapter {
    async fetch(threadId: string) {
      const threadMemo = memos.find((memo) => memo.id === threadId);
      if (!threadMemo?.chatHistoryHeadID) {
        throw new Error(`Chat history head not found for memo: ${threadId}`);
      }

      return { remoteId: threadMemo.id, status: "regular" as const };
    }
  }

  const history: ThreadHistoryAdapter = {
    load: async () => ({ headId: null, messages: [] }),
    append: async () => {},
    withFormat: (formatAdapter) => {
      type ChatHistoryItem = MessageStorageEntry<
        ReturnType<typeof formatAdapter.encode>
      >;

      const getChatHistory = (): ChatHistoryItem[] =>
        JSON.parse(localStorage.getItem("chatHistory") ?? "[]");
      const setChatHistory = (
        action: (prevChatHistory: ChatHistoryItem[]) => ChatHistoryItem[],
      ) => {
        localStorage.setItem(
          "chatHistory",
          JSON.stringify(action(getChatHistory())),
        );
      };

      return {
        load: async () => {
          setChatHistory((prevChatHistory) => {
            const reachableMessageIDs = new Set<string>();
            for (const memo of memos) {
              let messageID = memo.chatHistoryHeadID;
              while (messageID) {
                reachableMessageIDs.add(messageID);

                messageID =
                  prevChatHistory.find(
                    (chatHistoryItem) => chatHistoryItem.id === messageID,
                  )?.parent_id ?? undefined;
              }
            }

            return prevChatHistory.filter((chatHistoryItem) =>
              reachableMessageIDs.has(chatHistoryItem.id),
            );
          });

          return {
            headId: memo.chatHistoryHeadID,
            messages: getChatHistory().map(formatAdapter.decode),
          };
        },
        append: async (item) => {
          const id = formatAdapter.getId(item.message);

          setChatHistory((prevChatHistory) => {
            const chatHistory = [...prevChatHistory];
            chatHistory.push({
              id,
              parent_id: item.parentId,
              format: formatAdapter.format,
              content: formatAdapter.encode(item),
            });
            return chatHistory;
          });

          dispatchMemos((prevMemos) =>
            prevMemos.map((prevMemo) => {
              if (prevMemo.id !== memo.id) {
                return prevMemo;
              }

              return { ...prevMemo, chatHistoryHeadID: id };
            }),
          );
        },
      };
    },
  };

  const transport = new AssistantChatTransport({
    api: "https://ai-chat-788918986145.asia-northeast1.run.app/",
    body: async () => {
      // HTTPリクエストのたびに新しいreCAPTCHA tokenを取得する必要あり
      await new Promise<void>((resolve) =>
        grecaptcha.enterprise.ready(resolve),
      );
      const recaptchaToken = await grecaptcha.enterprise.execute(
        "6LeYs_YrAAAAAEUU58gmxMlJR0y9_qYB7YQ0FyIF",
        { action: "GET_CLIENT_SECRET" },
      );

      return { recaptchaToken };
    },
  });

  const runtime = useRemoteThreadListRuntime({
    runtimeHook: () =>
      useChatRuntime({
        adapters: { history },
        transport,
        sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
        onError: (error) => {
          console.error("Chat request failed", error);
        },
      }),
    adapter: new SingleThreadListAdapter(),
    threadId: memo.id,
  });

  return (
    <AssistantRuntimeProvider aui={aui} runtime={runtime}>
      <Card>
        <ThreadPrimitive.Root>
          <ThreadPrimitive.Viewport
            autoScroll
            className="max-h-[560px] overflow-y-auto overscroll-contain"
          >
            <CardContent>
              <div className="[&:not(:empty)]:mb-3">
                <ThreadPrimitive.Suggestions>
                  {() => (
                    <SuggestionPrimitive.Trigger
                      send
                      className="mb-1 w-full rounded-md bg-[#00857E]/10 px-2.5 py-1.5 text-left text-sm text-[#006B66] shadow-xs hover:bg-[#00857E]/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00857E]"
                    >
                      <SuggestionPrimitive.Title />
                    </SuggestionPrimitive.Trigger>
                  )}
                </ThreadPrimitive.Suggestions>
              </div>

              <ThreadPrimitive.Messages>
                {({ message }) => (
                  <MessagePrimitive.Root
                    className={
                      message.composer.isEditing
                        ? undefined
                        : message.role === "user"
                          ? "rounded-lg bg-zinc-100 p-3"
                          : "py-2 text-sm/6 text-zinc-700"
                    }
                  >
                    {message.composer.isEditing ? (
                      <ComposerPrimitive.Root className="flex w-full items-end gap-2 rounded-xl border border-zinc-950/10 bg-white p-2 shadow-sm focus-within:ring-2 focus-within:ring-[#00857E]">
                        <ComposerPrimitive.Input
                          autoFocus
                          className="min-h-10 min-w-0 flex-1 resize-none bg-transparent px-2 py-2 text-sm/6 outline-none placeholder:text-zinc-500"
                        />

                        <div className="flex shrink-0 flex-col gap-2">
                          <ComposerPrimitive.Cancel className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00857E]">
                            <XMarkIcon className="size-5" />
                            <span className="sr-only">キャンセル</span>
                          </ComposerPrimitive.Cancel>
                          <ComposerPrimitive.Send className="rounded-full bg-[#00857E] p-2 text-white shadow-sm hover:bg-[#006B66] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00857E] disabled:opacity-50">
                            <PaperAirplaneIcon className="size-5" />
                            <span className="sr-only">送信</span>
                          </ComposerPrimitive.Send>
                        </div>
                      </ComposerPrimitive.Root>
                    ) : (
                      <>
                        <MessagePrimitive.Parts>
                          {({ part }) =>
                            ({
                              text: (
                                <MarkdownTextPrimitive
                                  remarkPlugins={[remarkGfm]}
                                  defer
                                  className="prose prose-sm prose-zinc max-w-none prose-li:pl-0 prose-ol:pl-4 prose-ul:pl-4"
                                />
                              ),
                              audio: null,
                              data: null,
                              file: null,
                              "generative-ui": null,
                              image: null,
                              reasoning: null,
                              source: null,
                              "tool-call": null,
                            })[part.type]
                          }
                        </MessagePrimitive.Parts>

                        <ActionBarPrimitive.Root className="mt-1 flex justify-end">
                          {{
                            system: false,
                            user: true,
                            assistant: false,
                          }[message.role] && (
                            <ActionBarPrimitive.Edit className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00857E]">
                              <PencilSquareIcon className="size-4" />
                              <span className="sr-only">編集</span>
                            </ActionBarPrimitive.Edit>
                          )}
                        </ActionBarPrimitive.Root>
                      </>
                    )}
                  </MessagePrimitive.Root>
                )}
              </ThreadPrimitive.Messages>

              <AuiIf condition={(state) => state.thread.isRunning}>
                <div role="status" className="px-1 py-2 text-sm text-zinc-500">
                  校正さんが回答しています…
                </div>
              </AuiIf>
            </CardContent>

            <CardActions className="sticky bottom-0 bg-white/95 backdrop-blur">
              <ThreadPrimitive.ViewportFooter className="w-full">
                <ComposerPrimitive.Root className="flex w-full items-end gap-2 rounded-xl border border-zinc-950/10 bg-white p-2 shadow-sm focus-within:ring-2 focus-within:ring-[#00857E]">
                  <ComposerPrimitive.Input
                    placeholder="校正さんに相談する"
                    className="min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm/6 outline-none placeholder:text-zinc-500"
                  />
                  <ComposerPrimitive.Send className="rounded-full bg-[#00857E] p-2 text-white shadow-sm hover:bg-[#006B66] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00857E] disabled:opacity-50">
                    <PaperAirplaneIcon className="size-5" />
                    <span className="sr-only">送信</span>
                  </ComposerPrimitive.Send>
                </ComposerPrimitive.Root>
              </ThreadPrimitive.ViewportFooter>
            </CardActions>
          </ThreadPrimitive.Viewport>
        </ThreadPrimitive.Root>
      </Card>
    </AssistantRuntimeProvider>
  );
};
