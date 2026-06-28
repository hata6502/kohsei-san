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
import type { ProofreadingMessage } from "./lintWorker";
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

const ProofreadingAlert = styled(Alert)(({ theme }) => ({
  alignItems: "center",
  marginLeft: theme.spacing(1),
  maxWidth: "min(34vw, 160px)",
  whiteSpace: "nowrap",
  "&&": {
    padding: theme.spacing(0.5, 1),
  },
  "& .MuiAlert-icon": {
    fontSize: 18,
    marginRight: theme.spacing(0.5),
    padding: 0,
  },
  "& .MuiAlert-message": {
    overflow: "hidden",
    padding: 0,
    textOverflow: "ellipsis",
  },
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

  const [proofreadingPopoverIndex, setProofreadingPopoverIndex] = useState<
    ProofreadingMessage["index"] | null
  >(null);
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

  const handleProofreadingDetailOpen = ({
    index,
  }: {
    index: ProofreadingMessage["index"];
  }) => {
    setProofreadingPopoverIndex(index);
  };

  const handleProofreadingPopoverOpen = () => {
    setProofreadingPopoverIndex(null);
  };

  const memo = memos.find(({ id }) => id === memoId);
  const proofreadingAlert =
    memo?.result &&
    (memo.result.messages.length ? (
      <ProofreadingAlert key="message" role="alert" severity="info">
        見直し{memo.result.messages.length}件
      </ProofreadingAlert>
    ) : (
      <ProofreadingAlert key="success" role="alert" severity="success">
        見直しなし
      </ProofreadingAlert>
    ));

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

          {proofreadingAlert}
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
                  proofreadingPopoverIndex={proofreadingPopoverIndex}
                  onProofreadingPopoverOpen={handleProofreadingPopoverOpen}
                />
              </Grid>

              <Grid
                item
                position="sticky"
                top={64}
                xs={12}
                sm={12}
                md={4}
                sx={{
                  maxHeight: { md: "calc(100dvh - 80px)" },
                  overflowY: { md: "auto" },
                  overscrollBehavior: { md: "contain" },
                  scrollbarGutter: { md: "stable" },
                }}
              >
                <MemoActions
                  dispatchIsCopiedSnackbarOpen={dispatchIsCopiedSnackbarOpen}
                  dispatchIsSidebarOpen={dispatchIsSidebarOpen}
                  dispatchMemoId={dispatchMemoId}
                  dispatchMemos={dispatchMemos}
                  chatEnabled={chatEnabled}
                  memo={memo}
                  memos={memos}
                  onProofreadingDetailOpen={handleProofreadingDetailOpen}
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
