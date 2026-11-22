import { diffChars } from "diff";
import { useEffect, useReducer, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { LintOption } from "core";
import type { ProofreadingMessage, ProofreadingResult } from "./lintWorker";

export interface Setting {
  mode: "standard" | "professional";
  lintOption: LintOption & {
    userDictionaryMemoId?: string;
  };
}

export interface Memo {
  id: string;
  result?: ProofreadingResult;
  setting: Setting;
  text: string;
  updatedAt?: string;
  chatHistoryHeadID?: string;
}

export const createMemo = (): Memo => ({
  id: crypto.randomUUID(),
  setting: { mode: "standard", lintOption: {} },
  text: "",
  updatedAt: new Date().toISOString(),
});

export const getMemoTitle = (memo: Pick<Memo, "text">) =>
  memo.text.trim().split("\n")[0] || "(空のメモ)";

export type MemosAction = (prevMemo: Memo[]) => Memo[];

export type DispatchSetting = (
  action: (prevSetting: Setting) => Setting,
) => void;

export const useDispatchSetting =
  ({
    dispatchMemos,
    memoId,
  }: {
    dispatchMemos: React.Dispatch<MemosAction>;
    memoId: Memo["id"];
  }): DispatchSetting =>
  (action) =>
    dispatchMemos((prevMemos) =>
      prevMemos.map((prevMemo) => ({
        ...prevMemo,
        ...(prevMemo.id === memoId && {
          result: undefined,
          setting: action(prevMemo.setting),
        }),
      })),
    );

export const useMemo = (): {
  chatEnabled: boolean;
  dispatchMemoId: Dispatch<string>;
  dispatchMemos: Dispatch<MemosAction>;
  isSaveErrorOpen: boolean;
  memoId: string;
  memos: Memo[];
  setChatEnabled: Dispatch<SetStateAction<boolean>>;
  setIsSaveErrorOpen: Dispatch<SetStateAction<boolean>>;
} => {
  const searchParams = new URLSearchParams(window.location.search);

  const textParam = searchParams.get("text");
  const titleParam = searchParams.get("title");
  const urlParam = searchParams.get("url");

  const isShared =
    textParam !== null || titleParam !== null || urlParam !== null;

  const [memos, dispatchMemos] = useReducer(
    (state: Memo[], action: MemosAction) => action(state),
    undefined,
    (): Memo[] => {
      const memosItem = localStorage.getItem("memos");
      const localStorageMemos: Memo[] = memosItem ? JSON.parse(memosItem) : [];

      return [
        ...localStorageMemos,
        ...(isShared
          ? [
              {
                ...createMemo(),
                text: [
                  ...(titleParam ? [titleParam] : []),
                  ...(textParam ? [textParam] : []),
                  ...(urlParam ? [urlParam] : []),
                ].join("\n\n"),
              },
            ]
          : []),
      ];
    },
  );

  const [memoId, dispatchMemoId] = useReducer(
    (_: Memo["id"], action: Memo["id"]) => action,
    undefined,
    () =>
      isShared
        ? memos[memos.length - 1].id
        : (localStorage.getItem("memoId") ?? ""),
  );

  const [isSaveErrorOpen, setIsSaveErrorOpen] = useState(false);
  const [chatEnabled, setChatEnabled] = useState(
    () => localStorage.getItem("chatEnabled") === "true",
  );

  useEffect(() => {
    try {
      localStorage.setItem("chatEnabled", JSON.stringify(chatEnabled));
      localStorage.setItem("memoId", memoId);
      localStorage.setItem("memos", JSON.stringify(memos));
    } catch (exception) {
      setIsSaveErrorOpen(true);

      if (
        !(exception instanceof DOMException) ||
        exception.code !== DOMException.QUOTA_EXCEEDED_ERR
      ) {
        console.error(exception);
      }
    }
  }, [chatEnabled, memoId, memos]);

  return {
    chatEnabled,
    dispatchMemoId,
    dispatchMemos,
    isSaveErrorOpen,
    memoId,
    memos,
    setChatEnabled,
    setIsSaveErrorOpen,
  };
};

export const diffProofreadingResult = ({
  result,
  prevText,
  text,
}: {
  result?: ProofreadingResult;
  prevText: string;
  text: string;
}) => {
  if (!result) {
    return;
  }

  const diff = diffChars(prevText, text);
  return {
    ...result,
    messages: result.messages.flatMap((message): ProofreadingMessage[] => {
      let offset = 0;
      let textIndex = 0;
      for (const part of diff) {
        const [start, end] = message.fix?.range ?? [
          message.index,
          message.index,
        ];

        if (textIndex >= end + offset) {
          break;
        }

        if (part.added) {
          offset += part.value.length;
          textIndex += part.value.length;
        } else if (part.removed) {
          if (
            textIndex < end + offset &&
            start + offset < textIndex + part.value.length
          ) {
            return [];
          }

          offset -= part.value.length;
        } else {
          textIndex += part.value.length;
        }
      }

      return [
        {
          ...message,
          index: message.index + offset,
          ...(message.fix && {
            fix: {
              ...message.fix,
              range: [
                message.fix.range[0] + offset,
                message.fix.range[1] + offset,
              ],
            },
          }),
        },
      ];
    }),
  };
};
