import React, { useEffect, useReducer, useState } from 'react';
import styled from 'styled-components';
import Alert, { AlertProps } from '@material-ui/lab/Alert';
import AppBar from '@material-ui/core/AppBar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import * as Sentry from '@sentry/browser';
import { v4 as uuidv4 } from 'uuid';
import Edit from './Edit';
import Sidebar, { SidebarProps } from './Sidebar';

const AppContainer = styled(Container)`
  ${({ theme }) => `
    margin-bottom: ${theme.spacing(2)}px;
    margin-top: ${theme.spacing(10)}px;
  `}
`;

const AppIcon = styled.img`
  height: auto;
  width: 48px;
`;

const AppTypography = styled(Typography)`
  ${({ theme }) => `
    flex-grow: 1;
    margin-left: ${theme.spacing(1)}px;
  `}
`;

export interface Memo {
  id: string;
  text: string;
}

export type MemosAction = (prevState: Memo[]) => Memo[];

const App: React.FunctionComponent = () => {
  const [memos, dispatchMemos] = useReducer(
    (state: Memo[], action: MemosAction) => action(state),
    undefined,
    () => {
      const localStorageMemos: Partial<Memo>[] = JSON.parse(
        localStorage.getItem('memos') || '[{}]'
      );

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

  const [isLinting, dispatchIsLinting] = useReducer((_: boolean, action: boolean) => action, true);
  const [memoId, dispatchMemoId] = useReducer((_: string, action: string) => action, memos[0].id);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSaveErrorOpen, setIsSaveErrorOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('memos', JSON.stringify(memos));
    } catch (exception) {
      setIsSaveErrorOpen(true);

      // eslint-disable-next-line no-console
      console.error(exception);
      Sentry.captureException(exception);
    }
  }, [memos]);

  const handleMenuIconClick: React.MouseEventHandler = () => setIsSidebarOpen(true);

  const handleSaveErrorClose: AlertProps['onClose'] = () => setIsSaveErrorOpen(false);

  const handleSidebarClose: SidebarProps['onClose'] = () => setIsSidebarOpen(false);

  return (
    <>
      <AppBar color="inherit">
        <Toolbar>
          <IconButton onClick={handleMenuIconClick}>
            <MenuIcon />
          </IconButton>
          {(isLinting && <CircularProgress color="secondary" />) || (
            <AppIcon alt="" src="favicon.png" />
          )}
          <AppTypography variant="h6">{(isLinting && '校正中…') || '校正さん'}</AppTypography>
          α版
        </Toolbar>
      </AppBar>

      <Sidebar
        dispatchMemoId={dispatchMemoId}
        dispatchMemos={dispatchMemos}
        memoId={memoId}
        memos={memos}
        onClose={handleSidebarClose}
        open={isSidebarOpen}
      />

      <AppContainer>
        <Edit
          dispatchIsLinting={dispatchIsLinting}
          dispatchMemos={dispatchMemos}
          isLinting={isLinting}
          key={memoId}
          memo={
            memos.find(({ id }) => id === memoId) || {
              id: memoId,
              text: ''
            }
          }
        />

        <Snackbar open={isSaveErrorOpen}>
          <Alert onClose={handleSaveErrorClose} severity="error">
            メモをローカルに保存できませんでした。 メモのバックアップを取り、LocalStorage
            を使用できることを確認してください。
          </Alert>
        </Snackbar>
      </AppContainer>
    </>
  );
};

export default App;
