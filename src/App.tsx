import React, { useReducer, useState } from 'react';
import styled from 'styled-components';
import Alert, { AlertProps } from '@material-ui/lab/Alert';
import AppBar from '@material-ui/core/AppBar';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import Edit from './Edit';
import Landing from './Landing';
import Sidebar, { SidebarProps } from './Sidebar';
import useMemo from './useMemo';

const AppIcon = styled.img`
  height: auto;
  width: 48px;
`;

const AppTitle = styled(Typography)`
  ${({ theme }) => `
    margin-left: ${theme.spacing(1)}px;
  `}
  cursor: pointer;
  flex-grow: 1;
`;

const AppTopBar = styled(AppBar)`
  /* Sentry のレポートダイアログを最前面に表示するため */
  z-index: 998;
`;

const App: React.FunctionComponent = () => {
  const {
    dispatchMemoId,
    dispatchMemos,
    isSaveErrorOpen,
    memoId,
    memos,
    setIsSaveErrorOpen,
  } = useMemo();

  const [isLinting, dispatchIsLinting] = useReducer((_: boolean, action: boolean) => action, false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleAppTitleClick: React.MouseEventHandler = () => dispatchMemoId('');
  const handleMenuIconClick: React.MouseEventHandler = () => setIsSidebarOpen(true);
  const handleSaveErrorClose: AlertProps['onClose'] = () => setIsSaveErrorOpen(false);
  const handleSidebarClose: SidebarProps['onClose'] = () => setIsSidebarOpen(false);

  const memo = memos.find(({ id }) => id === memoId);

  return (
    <>
      <AppTopBar color="inherit">
        <Toolbar>
          <IconButton onClick={handleMenuIconClick}>
            <MenuIcon />
          </IconButton>
          {(isLinting && <CircularProgress color="secondary" />) || (
            <AppIcon alt="" src="favicon.png" />
          )}
          <AppTitle onClick={handleAppTitleClick} variant="h6">
            {(isLinting && '校正中…') || '校正さん'}
          </AppTitle>
        </Toolbar>
      </AppTopBar>

      <Sidebar
        dispatchMemoId={dispatchMemoId}
        dispatchMemos={dispatchMemos}
        memoId={memoId}
        memos={memos}
        onClose={handleSidebarClose}
        open={isSidebarOpen}
      />

      {(memo && (
        <Edit
          dispatchIsLinting={dispatchIsLinting}
          dispatchMemos={dispatchMemos}
          isLinting={isLinting}
          key={memoId}
          memo={memo}
        />
      )) || <Landing />}

      <Snackbar open={isSaveErrorOpen}>
        <Alert onClose={handleSaveErrorClose} severity="error">
          メモをローカルに保存できませんでした。 メモのバックアップを取り、LocalStorage
          が使用できることを確認してください。
        </Alert>
      </Snackbar>
    </>
  );
};

export default App;
