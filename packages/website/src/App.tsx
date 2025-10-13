import React, { useCallback, useReducer, useState } from "react";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import Alert from "@material-ui/lab/Alert";
import AppBar from "@material-ui/core/AppBar";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Drawer from "@material-ui/core/Drawer";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import { Edit, MemoActions } from "./Memo";
import Empty from "./Empty";
import Sidebar from "./Sidebar";
import { useMemo } from "./useMemo";

const MemoContainer = styled(Container)`
  ${({ theme }) => `
    margin-bottom: ${theme.spacing(2)}px;
    margin-top: ${theme.spacing(2)}px;
  `}
`;

const Title = styled(Typography)`
  ${({ theme }) => `
    margin-left: ${theme.spacing(1)}px;
  `}
`;

const TopBar = styled(AppBar)`
  /* Sentry のレポートダイアログを最前面に表示するため */
  z-index: 998;
`;

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
}));

const App: React.FunctionComponent<{ lintWorker: Worker }> = React.memo(
  ({ lintWorker }) => {
    const {
      dispatchMemoId,
      dispatchMemos,
      isSaveErrorOpen,
      memoId,
      memos,
      setIsSaveErrorOpen,
      titleParam,
    } = useMemo();

    const [isLinting, dispatchIsLinting] = useReducer(
      (_: boolean, action: boolean) => action,
      false
    );

    const [isLintingHeavy, dispatchIsLintingHeavy] = useReducer(
      (_: boolean, action: boolean) => action,
      false
    );

    const [isSidebarOpen, dispatchIsSidebarOpen] = useState(false);
    const [isCopiedSnackbarOpen, dispatchIsCopiedSnackbarOpen] =
      useState(false);

    const classes = useStyles();

    const handleMenuIconClick = useCallback(
      () => dispatchIsSidebarOpen(true),
      [dispatchIsSidebarOpen]
    );
    const handleSaveErrorClose = useCallback(
      () => setIsSaveErrorOpen(false),
      [setIsSaveErrorOpen]
    );
    const handleSidebarClose = useCallback(
      () => dispatchIsSidebarOpen(false),
      [dispatchIsSidebarOpen]
    );

    const handleCopiedSnackbarClose = useCallback(
      () => dispatchIsCopiedSnackbarOpen(false),
      [dispatchIsCopiedSnackbarOpen]
    );

    const memo = memos.find(({ id }) => id === memoId);
    const title =
      titleParam === null
        ? "校正さん"
        : `「${titleParam}」の校正結果 | 校正さん`;

    return (
      <div>
        <Helmet>
          <title>{title}</title>
        </Helmet>

        <TopBar color="inherit">
          <Toolbar>
            <IconButton onClick={handleMenuIconClick}>
              <MenuIcon />
            </IconButton>

            {isLinting ? (
              <CircularProgress color="secondary" />
            ) : (
              <img alt="" src="favicon.png" style={{ width: 48 }} />
            )}

            <Title variant="h6">
              {isLinting
                ? isLintingHeavy
                  ? "お待ちください…"
                  : "校正中…"
                : "校正さん"}
            </Title>
          </Toolbar>
        </TopBar>

        <nav>
          <Drawer
            open={isSidebarOpen}
            variant="temporary"
            onClose={handleSidebarClose}
          >
            <Sidebar
              dispatchMemoId={dispatchMemoId}
              dispatchMemos={dispatchMemos}
              memoId={memoId}
              memos={memos}
              onClose={handleSidebarClose}
            />
          </Drawer>
        </nav>

        <main>
          <div className={classes.toolbar} />

          {memo ? (
            <MemoContainer>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={8}>
                  <Edit
                    key={memoId}
                    dispatchIsLinting={dispatchIsLinting}
                    dispatchIsLintingHeavy={dispatchIsLintingHeavy}
                    dispatchMemos={dispatchMemos}
                    isLinting={isLinting}
                    lintWorker={lintWorker}
                    memo={memo}
                    memos={memos}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={4}>
                  <MemoActions
                    dispatchIsCopiedSnackbarOpen={dispatchIsCopiedSnackbarOpen}
                    dispatchIsSidebarOpen={dispatchIsSidebarOpen}
                    dispatchMemoId={dispatchMemoId}
                    dispatchMemos={dispatchMemos}
                    memo={memo}
                    memos={memos}
                  />
                </Grid>
              </Grid>
            </MemoContainer>
          ) : (
            <Empty />
          )}
        </main>

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
      </div>
    );
  }
);

export default App;
