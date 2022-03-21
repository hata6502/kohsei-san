import React, { useCallback, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import Alert from '@material-ui/lab/Alert';
import AppBar from '@material-ui/core/AppBar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Snackbar from '@material-ui/core/Snackbar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import { Edit } from './Edit';
import Empty from './Empty';
import Sidebar from './Sidebar';
import { useMemo } from './useMemo';

const sidebarWidth = 250;

const Main = styled.main`
  flex-grow: 1;
`;

const Navigation = styled.nav`
  ${({ theme }) => `
    ${theme.breakpoints.up('md')} {
      flex-shrink: 0;
      width: ${sidebarWidth}px;
    }
  `}
`;

const Root = styled.div`
  display: flex;
`;

const Title = styled(Typography)`
  ${({ theme }) => `
    margin-left: ${theme.spacing(1)}px;
  `}
`;

const TopBar = styled(AppBar)`
  ${({ theme }) => `
    ${theme.breakpoints.up('md')} {
      width: calc(100% - ${sidebarWidth}px);
    }
  `}

  /* Sentry のレポートダイアログを最前面に表示するため */
  z-index: 998;
`;

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
}));

const App: React.FunctionComponent<{ lintWorker: Worker }> = React.memo(({ lintWorker }) => {
  const {
    dispatchMemoId,
    dispatchMemos,
    isSaveErrorOpen,
    memoId,
    memos,
    setIsSaveErrorOpen,
    titleParam,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  } = useMemo();

  const [isLinting, dispatchIsLinting] = useReducer((_: boolean, action: boolean) => action, false);

  const [isLintingHeavy, dispatchIsLintingHeavy] = useReducer(
    (_: boolean, action: boolean) => action,
    false
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCopiedSnackbarOpen, dispatchIsCopiedSnackbarOpen] = useState(false);

  const classes = useStyles();

  const handleMenuIconClick = useCallback(() => setIsSidebarOpen(true), [setIsSidebarOpen]);
  const handleSaveErrorClose = useCallback(() => setIsSaveErrorOpen(false), [setIsSaveErrorOpen]);
  const handleSidebarClose = useCallback(() => setIsSidebarOpen(false), [setIsSidebarOpen]);

  const handleCopiedSnackbarClose = useCallback(
    () => dispatchIsCopiedSnackbarOpen(false),
    [dispatchIsCopiedSnackbarOpen]
  );

  const memo = memos.find(({ id }) => id === memoId);
  const title = titleParam === null ? '校正さん' : `「${titleParam}」の校正結果 | 校正さん`;

  const sidebarContent = (
    <Sidebar
      dispatchMemoId={dispatchMemoId}
      dispatchMemos={dispatchMemos}
      memoId={memoId}
      memos={memos}
      onClose={handleSidebarClose}
    />
  );

  return (
    <Root>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <TopBar color="inherit">
        <Toolbar>
          <Hidden mdUp>
            <IconButton onClick={handleMenuIconClick}>
              <MenuIcon />
            </IconButton>
          </Hidden>
          {isLinting ? (
            <CircularProgress color="secondary" />
          ) : (
            <img alt="" src="favicon.png" style={{ width: 48 }} />
          )}

          <Title variant="h6">
            {isLinting ? (isLintingHeavy ? 'お待ちください…' : '校正中…') : '校正さん'}
          </Title>
        </Toolbar>
      </TopBar>

      <Navigation>
        <Hidden mdUp>
          <Drawer open={isSidebarOpen} variant="temporary" onClose={handleSidebarClose}>
            {sidebarContent}
          </Drawer>
        </Hidden>

        <Hidden smDown>
          <Drawer open variant="permanent">
            {sidebarContent}
          </Drawer>
        </Hidden>
      </Navigation>

      <Main>
        <div className={classes.toolbar} />

        <Alert severity="warning">
          校正さんはメンテナンスを終了します。さらに高機能な
          <Link
            href="https://helpfeel.com/hata6502/scrapbox-lint-61acc979ee8557001f7e0d5e"
            rel="noopener"
            target="_blank"
          >
            scrapbox-lint
          </Link>
          をご利用ください。
        </Alert>

        {memo ? (
          <Edit
            key={memoId}
            dispatchIsCopiedSnackbarOpen={dispatchIsCopiedSnackbarOpen}
            dispatchIsLinting={dispatchIsLinting}
            dispatchIsLintingHeavy={dispatchIsLintingHeavy}
            dispatchMemoId={dispatchMemoId}
            dispatchMemos={dispatchMemos}
            isLinting={isLinting}
            lintWorker={lintWorker}
            memo={memo}
          />
        ) : (
          <Empty />
        )}
      </Main>

      <Snackbar
        autoHideDuration={6000}
        open={isCopiedSnackbarOpen}
        onClose={handleCopiedSnackbarClose}
      >
        <Alert severity="success">メモをコピーしました。</Alert>
      </Snackbar>

      <Snackbar open={isSaveErrorOpen}>
        <Alert onClose={handleSaveErrorClose} severity="error">
          メモを保存できませんでした。
          メモを他の場所に保存してから、アプリをインストールしてみてください。
        </Alert>
      </Snackbar>
    </Root>
  );
});

export default App;
