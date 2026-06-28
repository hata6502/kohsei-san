import React, { useReducer, useState } from "react";
import { styled } from "@mui/material/styles";
import Alert from "@mui/material/Alert";
import AppBar from "@mui/material/AppBar";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Drawer from "@mui/material/Drawer";
import Grid from "@mui/material/GridLegacy";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import { Edit, MemoActions } from "./Memo";
import Home from "./Home";
import Sidebar from "./Sidebar";
import { useMemo } from "./useMemo";

const MemoContainer = styled(Container)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

const Title = styled(Typography)(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

const KohseiSanAlert = styled(Alert)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  padding: theme.spacing(0, 1),
}));

const ToolbarOffset = styled("div")(({ theme }) => ({
  minHeight: 64,
  [theme.breakpoints.down("sm")]: {
    minHeight: 56,
  },
}));

const App: React.FunctionComponent<{ lintWorker: Worker }> = ({
  lintWorker,
}) => {
  const {
    chatEnabled,
    dispatchMemoId,
    dispatchMemos,
    isSaveErrorOpen,
    memoId,
    memos,
    setChatEnabled,
    setIsSaveErrorOpen,
  } = useMemo();

  const [isLinting, dispatchIsLinting] = useReducer(
    (_: boolean, action: boolean) => action,
    false,
  );

  const [, dispatchIsLintingHeavy] = useReducer(
    (_: boolean, action: boolean) => action,
    false,
  );

  const [isSidebarOpen, dispatchIsSidebarOpen] = useState(false);
  const [isCopiedSnackbarOpen, dispatchIsCopiedSnackbarOpen] = useState(false);

  const handleMenuIconClick = () => {
    dispatchIsSidebarOpen(true);
  };
  const handleSaveErrorClose = () => {
    setIsSaveErrorOpen(false);
  };
  const handleSidebarClose = () => {
    dispatchIsSidebarOpen(false);
  };

  const handleCopiedSnackbarClose = () => {
    dispatchIsCopiedSnackbarOpen(false);
  };

  const memo = memos.find(({ id }) => id === memoId);

  return (
    <div>
      <AppBar color="inherit">
        <Toolbar>
          <IconButton onClick={handleMenuIconClick}>
            <MenuIcon />
          </IconButton>

          {isLinting ? (
            <CircularProgress color="secondary" />
          ) : (
            <img alt="" src="favicon.png" style={{ width: 48 }} />
          )}

          <Title variant="h6">校正さん</Title>

          {memo?.result &&
            (memo.result.messages.length ? (
              <KohseiSanAlert key="message" severity="info">
                見直し箇所{memo.result.messages.length}件
              </KohseiSanAlert>
            ) : (
              <KohseiSanAlert key="success" severity="success">
                見直し箇所なし
              </KohseiSanAlert>
            ))}
        </Toolbar>
      </AppBar>

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
        <ToolbarOffset />

        {memo ? (
          <MemoContainer key={memo.id}>
            <Grid container alignItems="start" spacing={2}>
              <Grid item xs={12} sm={12} md={8}>
                <Edit
                  dispatchIsLinting={dispatchIsLinting}
                  dispatchIsLintingHeavy={dispatchIsLintingHeavy}
                  dispatchMemos={dispatchMemos}
                  isLinting={isLinting}
                  lintWorker={lintWorker}
                  memo={memo}
                  memos={memos}
                />
              </Grid>

              <Grid item position="sticky" top={64} xs={12} sm={12} md={4}>
                <MemoActions
                  dispatchIsCopiedSnackbarOpen={dispatchIsCopiedSnackbarOpen}
                  dispatchIsSidebarOpen={dispatchIsSidebarOpen}
                  dispatchMemoId={dispatchMemoId}
                  dispatchMemos={dispatchMemos}
                  chatEnabled={chatEnabled}
                  memo={memo}
                  memos={memos}
                />
              </Grid>
            </Grid>
          </MemoContainer>
        ) : (
          <Home
            chatEnabled={chatEnabled}
            dispatchMemoId={dispatchMemoId}
            setChatEnabled={setChatEnabled}
            setMemos={dispatchMemos}
          />
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
};

export default App;
