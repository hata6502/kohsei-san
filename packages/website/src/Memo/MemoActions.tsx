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
import Grid from "@mui/material/GridLegacy";
import Paper from "@mui/material/Paper";
import ShareIcon from "@mui/icons-material/Share";
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

    const handleShareClick = useCallback(async () => {
      try {
        await navigator.share?.({
          text: memo.text,
        });
      } catch (exception) {
        if (
          !(exception instanceof DOMException) ||
          exception.code !== DOMException.ABORT_ERR
        ) {
          throw exception;
        }
      }
    }, [memo.text]);

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
              <Grid container spacing={1} wrap="wrap">
                <Grid item>
                  <Chip label={`${memo.text.length}文字`} size="small" />
                </Grid>
              </Grid>

              <Box mt={2}>
                <Grid container spacing={1}>
                  {
                    // @ts-expect-error navigator.share() が存在しない環境もある。
                    navigator.share && (
                      <Grid item>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={handleShareClick}
                          startIcon={<ShareIcon />}
                        >
                          共有
                        </Button>
                      </Grid>
                    )
                  }

                  <Grid item>
                    <Button
                      variant="outlined"
                      onClick={handleSettingButtonClick}
                    >
                      校正設定
                    </Button>
                  </Grid>

                  <Grid item>
                    <Button variant="outlined" onClick={handleCopyButtonClick}>
                      コピー
                    </Button>
                  </Grid>

                  <Grid item>
                    <Button
                      variant="outlined"
                      onClick={handleDeleteButtonClick}
                    >
                      削除
                    </Button>
                  </Grid>
                </Grid>
              </Box>
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
