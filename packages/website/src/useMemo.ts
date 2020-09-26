import { useEffect, useReducer, useState } from 'react';
import * as Sentry from '@sentry/browser';
import { TextlintResult } from '@textlint/kernel';
import { v4 as uuidv4 } from 'uuid';

export interface Memo {
  id: string;
  result?: TextlintResult;
  text: string;
}

export type MemosAction = (prevState: Memo[]) => Memo[];

const useMemo = () => {
  const searchParams = new URLSearchParams(window.location.search);

  const textParam = searchParams.get('text');
  const titleParam = searchParams.get('title');
  const urlParam = searchParams.get('url');

  const isShared = textParam !== null || titleParam !== null || urlParam !== null;

  const [memos, dispatchMemos] = useReducer(
    (state: Memo[], action: MemosAction) => action(state),
    undefined,
    (): Memo[] => {
      const memosItem = localStorage.getItem('memos');
      const localStorageMemos: Memo[] = memosItem ? JSON.parse(memosItem) : [];

      return [
        ...localStorageMemos,
        ...(isShared
          ? [
              {
                id: uuidv4(),
                text: `${titleParam ?? ''}\n${textParam ?? ''}\n${urlParam ?? ''}`,
              },
            ]
          : []),
      ];
    }
  );

  const [memoId, dispatchMemoId] = useReducer(
    (_: string, action: string) => action,
    undefined,
    () => (isShared ? memos[memos.length - 1].id : localStorage.getItem('memoId') ?? '')
  );

  const [isSaveErrorOpen, setIsSaveErrorOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('memoId', memoId);
      localStorage.setItem('memos', JSON.stringify(memos));
    } catch (exception) {
      setIsSaveErrorOpen(true);

      if (
        !(exception instanceof DOMException) ||
        exception.code !== DOMException.QUOTA_EXCEEDED_ERR
      ) {
        console.error(exception);
        Sentry.captureException(exception);
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
    titleParam,
  };
};

export default useMemo;
