import { useEffect, useReducer, useState } from 'react';
import * as Sentry from '@sentry/browser';
import { v4 as uuidv4 } from 'uuid';

export interface Memo {
  id: string;
  text: string;
}

export type MemosAction = (prevState: Memo[]) => Memo[];

const useMemo = () => {
  const [memos, dispatchMemos] = useReducer(
    (state: Memo[], action: MemosAction) => action(state),
    undefined,
    () => {
      const memosItem = localStorage.getItem('memos');
      const localStorageMemos: Partial<Memo>[] = (memosItem && JSON.parse(memosItem)) || [{}];

      const searchParams = new URLSearchParams(window.location.search);

      const textParam = searchParams.get('text');
      const titleParam = searchParams.get('title');
      const urlParam = searchParams.get('url');

      return [
        ...localStorageMemos.map(({ id, text }) => ({
          id: id || uuidv4(),
          text: text || ''
        })),
        ...(((titleParam !== null || textParam !== null || urlParam !== null) && [
          {
            id: uuidv4(),
            text: `${titleParam || ''}\n${textParam || ''}\n${urlParam || ''}`
          }
        ]) ||
          [])
      ];
    }
  );

  const [memoId, dispatchMemoId] = useReducer(
    (_: string, action: string) => action,
    undefined,
    () => localStorage.getItem('memoId') || (memos.length !== 0 && memos[0].id) || ''
  );

  const [isSaveErrorOpen, setIsSaveErrorOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('memoId', memoId);
      localStorage.setItem('memos', JSON.stringify(memos));
    } catch (exception) {
      setIsSaveErrorOpen(true);

      // eslint-disable-next-line no-console
      console.error(exception);
      Sentry.captureException(exception);
    }
  }, [memoId, memos]);

  return {
    dispatchMemoId,
    dispatchMemos,
    isSaveErrorOpen,
    memoId,
    memos,
    setIsSaveErrorOpen
  };
};

export default useMemo;
