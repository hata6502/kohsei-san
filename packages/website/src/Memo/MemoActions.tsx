import React, { useCallback, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";
import { useDispatchSetting } from "../useMemo";
import type { Memo, MemosAction } from "../useMemo";
import { SettingDialog } from "./SettingDialog";

export const MemoActions: React.FunctionComponent<{
  dispatchIsCopiedSnackbarOpen: React.Dispatch<boolean>;
  dispatchIsSidebarOpen: React.Dispatch<boolean>;
  dispatchMemoId: React.Dispatch<Memo["id"]>;
  dispatchMemos: React.Dispatch<MemosAction>;
  memo: Memo;
  memos: Memo[];
}> = React.memo(
  ({
    dispatchIsCopiedSnackbarOpen,
    dispatchIsSidebarOpen,
    dispatchMemoId,
    dispatchMemos,
    memo,
    memos,
  }) => {
    const [isSettingDialogOpen, setIsSettingDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const dispatchSetting = useDispatchSetting({
      dispatchMemos,
      memoId: memo.id,
    });

    const handleSettingButtonClick = useCallback(
      () => setIsSettingDialogOpen(true),
      []
    );
    const handleSettingDialogClose = useCallback(
      () => setIsSettingDialogOpen(false),
      []
    );

    const handleCopyButtonClick = useCallback(() => {
      const id = crypto.randomUUID();

      dispatchMemos((prevMemos) => [
        ...prevMemos,
        {
          ...memo,
          id,
        },
      ]);

      dispatchIsCopiedSnackbarOpen(true);
      dispatchIsSidebarOpen(true);
      dispatchMemoId(id);
    }, [
      dispatchIsCopiedSnackbarOpen,
      dispatchIsSidebarOpen,
      dispatchMemoId,
      dispatchMemos,
      memo,
    ]);

    const handleDeleteButtonClick = useCallback(
      () => setIsDeleteDialogOpen(true),
      []
    );

    const handleDeleteDialogAgree = useCallback(() => {
      dispatchMemos((prevMemos) =>
        prevMemos.filter(({ id }) => id !== memo.id)
      );
    }, [dispatchMemos, memo.id]);

    const handleDeleteDialogClose = useCallback(
      () => setIsDeleteDialogOpen(false),
      [setIsDeleteDialogOpen]
    );

    return (
      <>
        <Paper>
          <Box pb={2} pt={2}>
            <Container>
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems: "center",
                }}
              >
                <Chip label={`${memo.text.length}文字`} size="small" />

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    flexGrow: 1,
                    justifyContent: "end",
                  }}
                >
                  <IconButton
                    onClick={handleSettingButtonClick}
                    aria-label="設定"
                  >
                    <SettingsIcon />
                  </IconButton>

                  <IconButton onClick={handleCopyButtonClick} aria-label="複製">
                    <ContentCopyIcon />
                  </IconButton>

                  <IconButton
                    onClick={handleDeleteButtonClick}
                    aria-label="削除"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Stack>
            </Container>
          </Box>
        </Paper>

        <SettingDialog
          dispatchSetting={dispatchSetting}
          open={isSettingDialogOpen}
          setting={memo.setting}
          memos={memos}
          onClose={handleSettingDialogClose}
        />

        <Dialog open={isDeleteDialogOpen} onClose={handleDeleteDialogClose}>
          <DialogTitle>メモを削除しますか？</DialogTitle>

          <DialogContent>
            <DialogContentText>
              削除を元に戻すことはできません。
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={handleDeleteDialogClose}
              color="secondary"
              autoFocus
            >
              削除しない
            </Button>

            <Button onClick={handleDeleteDialogAgree} color="secondary">
              削除する
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
);
