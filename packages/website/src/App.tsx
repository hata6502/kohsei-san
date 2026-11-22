import React, { useEffect, useReducer, useRef, useState } from "react";
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
import { updateMemoText } from "./Memo/TextContainer";
import Home from "./Home";
import Sidebar from "./Sidebar";
import { createMemo, useMemo } from "./useMemo";
import type { Memo } from "./useMemo";

const MemoContainer = styled(Container)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

const Title = styled(Typography)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  [theme.breakpoints.down("sm")]: {
    fontSize: theme.typography.pxToRem(16),
    marginLeft: 4,
  },
}));

const ToolbarBrandIcon = styled("div")(({ theme }) => ({
  display: "grid",
  placeItems: "center",
  width: 48,
  height: 48,
  flexShrink: 0,
  "& > img": { width: "100%" },
  [theme.breakpoints.down("sm")]: { width: 28, height: 28 },
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

interface MemoSelection {
  input: HTMLTextAreaElement;
  start: number;
  end: number;
  text: string;
}

const readMemoSelection = (
  input: HTMLTextAreaElement,
): MemoSelection | undefined => {
  const { selectionStart: start, selectionEnd: end, value: text } = input;
  return start < end ? { input, start, end, text } : undefined;
};

const App: React.FunctionComponent<{ lintWorker: Worker }> = ({
  lintWorker,
}) => {
  const {
    chatEnabled,
    dispatchMemoId: selectMemo,
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
  const [isEditorFocused, setIsEditorFocused] = useState(false);
  const [selection, setSelection] = useState<MemoSelection>();
  const splitButtonRef = useRef<HTMLButtonElement>(null);
  const splitPress = useRef<{ pointerId: number; selection: MemoSelection }>(
    undefined,
  );

  useEffect(() => {
    const releaseSplitPress = (event: PointerEvent) => {
      const press = splitPress.current;
      if (!press || !event.isPrimary) return;

      const isOnButton = splitButtonRef.current?.contains(
        document.elementFromPoint(event.clientX, event.clientY),
      );
      if (event.type !== "pointerdown" && event.pointerId !== press.pointerId)
        return;
      // タップの pointerup 後に blur が発生する場合も click まで選択を保持する。
      if (event.type === "pointerup" && isOnButton) return;

      splitPress.current = undefined;
      if (event.type === "pointerdown" && isOnButton) return;
      const { input } = press.selection;
      setSelection(
        input === document.activeElement ? readMemoSelection(input) : undefined,
      );
    };
    document.addEventListener("pointerdown", releaseSplitPress, true);
    document.addEventListener("pointerup", releaseSplitPress);
    document.addEventListener("pointercancel", releaseSplitPress);
    return () => {
      document.removeEventListener("pointerdown", releaseSplitPress, true);
      document.removeEventListener("pointerup", releaseSplitPress);
      document.removeEventListener("pointercancel", releaseSplitPress);
    };
  }, []);

  const dispatchMemoId = (nextMemoId: Memo["id"]) => {
    if (nextMemoId !== memoId) {
      splitPress.current = undefined;
      setIsEditorFocused(false);
      setSelection(undefined);
    }
    selectMemo(nextMemoId);
  };

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

  const handleEditorSelectionChange = (input: HTMLTextAreaElement) => {
    if (
      !splitPress.current ||
      input.value !== splitPress.current.selection.text
    )
      setSelection(readMemoSelection(input));
  };

  const handleEditorBlur = (nextTarget: EventTarget | null) => {
    setIsEditorFocused(false);
    if (
      !splitPress.current &&
      (!nextTarget || nextTarget !== splitButtonRef.current)
    )
      setSelection(undefined);
  };

  const handleSplitClick = () => {
    const pressedSelection = splitPress.current?.selection;
    const currentSelection = pressedSelection ?? selection;
    splitPress.current = undefined;
    setSelection(undefined);
    if (!memo || !currentSelection) return;
    const { input, start, end, text } = currentSelection;
    if (!input.isConnected || input.value !== text) return;
    if (
      !pressedSelection &&
      input === document.activeElement &&
      (input.selectionStart !== start || input.selectionEnd !== end)
    ) {
      return;
    }

    const newMemo = {
      ...createMemo(),
      setting: memo.setting,
      text: text.slice(start, end),
    };
    const remainingText = text.slice(0, start) + text.slice(end);
    // 先に通常の blur 保存を行い、切り出し後の本文が上書きされないようにする。
    input.blur();
    dispatchMemos((previousMemos) => {
      const sourceMemo = previousMemos.find(({ id }) => id === memo.id);
      if (!sourceMemo) return previousMemos;
      const sourceWithDraft =
        sourceMemo.text === text
          ? sourceMemo
          : updateMemoText(sourceMemo, text);
      const remainingMemo = updateMemoText(sourceWithDraft, remainingText, {
        start,
        end,
      });
      return [
        newMemo,
        ...previousMemos.map((previousMemo) =>
          previousMemo.id === memo.id ? remainingMemo : previousMemo,
        ),
      ];
    });
    dispatchMemoId(newMemo.id);
  };

  return (
    <div>
      <AppBar color="inherit">
        <Toolbar sx={{ px: { xs: 1, sm: 3 }, pl: { xs: "2px", sm: 3 } }}>
          <IconButton
            aria-label="メモ一覧"
            onClick={handleMenuIconClick}
            sx={{ minWidth: 44, minHeight: 44 }}
          >
            <MenuIcon />
          </IconButton>

          <ToolbarBrandIcon>
            {isLinting ? (
              <CircularProgress color="secondary" size="83%" />
            ) : (
              <img alt="" src="favicon.png" />
            )}
          </ToolbarBrandIcon>

          <Title variant="h6">校正さん</Title>

          {memo && selection ? (
            <Button
              ref={splitButtonRef}
              onBlur={() => {
                if (!splitPress.current) setSelection(undefined);
              }}
              onClick={handleSplitClick}
              onPointerDown={(event) => {
                // ポインター操作で本文欄からフォーカスが移るのを防ぐ。
                if (!event.isPrimary || event.button !== 0) return;
                const { input } = selection;
                const pressedSelection =
                  input === document.activeElement
                    ? readMemoSelection(input)
                    : selection;
                if (!pressedSelection) {
                  setSelection(undefined);
                  return;
                }
                splitPress.current = {
                  pointerId: event.pointerId,
                  selection: pressedSelection,
                };
                event.preventDefault();
              }}
              sx={{
                ml: "auto",
                minHeight: 44,
                px: 1.25,
                flexShrink: 0,
                fontWeight: 500,
                whiteSpace: "nowrap",
                "&:hover, &:active": { color: "primary.dark" },
                "&.Mui-focusVisible": {
                  outline: "2px solid",
                  outlineColor: "primary.main",
                  outlineOffset: -2,
                },
              }}
              variant="text"
            >
              新しいメモに切り出す
            </Button>
          ) : memo?.result?.messages.length ? (
            <KohseiSanAlert key="message" severity="info">
              見直し箇所{memo.result.messages.length}件
            </KohseiSanAlert>
          ) : memo?.result && !isEditorFocused ? (
            <KohseiSanAlert key="success" severity="success">
              見直し箇所なし
            </KohseiSanAlert>
          ) : null}
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
                  editorToolbar={{
                    onBlur: handleEditorBlur,
                    onFocus: () => setIsEditorFocused(true),
                    onSelectionChange: handleEditorSelectionChange,
                  }}
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
