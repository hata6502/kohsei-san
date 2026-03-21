import { useEffect, useReducer, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { LintOption } from "core";
import type { ProofreadingResult } from "./lintWorker";

interface Setting {
  useChat?: boolean;
  mode: "standard" | "professional";
  lintOption: LintOption & {
    userDictionaryMemoId?: string;
  };
}

const initialSetting: Setting = {
  mode: "standard",
  lintOption: {},
};

interface Memo {
  id: string;
  result?: ProofreadingResult;
  setting: Setting;
  text: string;
}

type MemosAction = (prevMemo: Memo[]) => Memo[];

type DispatchSetting = (action: (prevSetting: Setting) => Setting) => void;

const useDispatchSetting =
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

const useMemo = (): {
  dispatchMemoId: Dispatch<string>;
  dispatchMemos: Dispatch<MemosAction>;
  isSaveErrorOpen: boolean;
  memoId: string;
  memos: Memo[];
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
      const localStorageMemos: Partial<Memo>[] = memosItem
        ? JSON.parse(memosItem)
        : [];

      return [
        ...localStorageMemos.map(
          (localStorageMemo): Memo => ({
            id: crypto.randomUUID(),
            setting: initialSetting,
            text: "",
            ...localStorageMemo,
          }),
        ),
        ...(isShared
          ? [
              {
                id: crypto.randomUUID(),
                setting: initialSetting,
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

  useEffect(() => {
    try {
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
  }, [memoId, memos]);

  return {
    dispatchMemoId,
    dispatchMemos,
    isSaveErrorOpen,
    memoId,
    memos,
    setIsSaveErrorOpen,
  };
};

export { initialSetting, useDispatchSetting, useMemo };
export type {
  DispatchSetting,
  Memo,
  MemosAction,
  Setting,
};
export type {
  ProofreadingMessage,
  ProofreadingMessageFix,
  ProofreadingResult,
} from "./lintWorker";
