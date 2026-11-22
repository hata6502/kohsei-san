import React, { useReducer, useState } from "react";
import type { PointerEventHandler } from "react";
import { styled } from "@mui/material/styles";
import Alert from "@mui/material/Alert";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
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
import { createMemo, useMemo } from "./useMemo";

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

export interface MemoFragment {
  selectionStart: number;
  selectionEnd: number;
}

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
  const [isSplitMemoButtonPressing, setIsSplitMemoButtonPressing] =
    useState(false);
  const [isTextContainerFocused, dispatchIsTextContainerFocused] =
    useState(false);
  const [isCopiedSnackbarOpen, dispatchIsCopiedSnackbarOpen] = useState(false);

  const [memoFragment, dispatchMemoFragment] = useState<MemoFragment>({
    selectionStart: 0,
    selectionEnd: 0,
  });

  const handleMenuIconClick = () => {
    dispatchIsSidebarOpen(true);
  };

  const handleSplitMemoButtonClick = () => {
    if (!memo) {
      throw new Error("No source memo to split");
    }

    const newMemo = {
      ...createMemo(),
      setting: memo.setting,
      text: memo.text.slice(
        memoFragment.selectionStart,
        memoFragment.selectionEnd,
      ),
    };

    dispatchMemos((prevMemos) => {
      const memoIndex = prevMemos.findIndex(
        (prevMemo) => prevMemo.id === memo.id,
      );
      const existingMemos = [...prevMemos];
      existingMemos.splice(memoIndex, 1);
      existingMemos.unshift({
        ...prevMemos[memoIndex],
        result: undefined,
        text: `${memo.text.slice(0, memoFragment.selectionStart)}${memo.text.slice(memoFragment.selectionEnd)}`,
        updatedAt: new Date().toISOString(),
      });

      return [newMemo, ...existingMemos];
    });
    dispatchIsSidebarOpen(true);
    dispatchMemoId(newMemo.id);
  };

  const handleSplitMemoButtonPointerDown: PointerEventHandler = (event) => {
    setIsSplitMemoButtonPressing(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const handleSplitMemoButtonPointerUp: PointerEventHandler = (event) => {
    const splitMemoButton = event.currentTarget;
    // click可能にするため
    setTimeout(() => {
      setIsSplitMemoButtonPressing(false);
      splitMemoButton.releasePointerCapture(event.pointerId);
    });
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

          {isTextContainerFocused || isSplitMemoButtonPressing
            ? memoFragment.selectionStart !== memoFragment.selectionEnd && (
                <Button
                  variant="text"
                  onClick={handleSplitMemoButtonClick}
                  onPointerDown={handleSplitMemoButtonPointerDown}
                  onPointerUp={handleSplitMemoButtonPointerUp}
                  onPointerCancel={handleSplitMemoButtonPointerUp}
                >
                  メモに切り出す
                </Button>
              )
            : memo?.result &&
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
                  dispatchIsTextContainerFocused={
                    dispatchIsTextContainerFocused
                  }
                  dispatchMemoFragment={dispatchMemoFragment}
                  dispatchMemos={dispatchMemos}
                  isLinting={isLinting}
                  isTextContainerFocused={isTextContainerFocused}
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
