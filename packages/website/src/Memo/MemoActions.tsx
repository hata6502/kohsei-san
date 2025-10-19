import React, { useState } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/GridLegacy";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useDispatchSetting } from "../useMemo";
import type { Memo, MemosAction } from "../useMemo";
import { Chat } from "./Chat";
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

    const handleSettingButtonClick = () => {
      setIsSettingDialogOpen(true);
    };
    const handleSettingDialogClose = () => {
      setIsSettingDialogOpen(false);
    };

    const handleCopyButtonClick = () => {
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
    };

    const handleDeleteButtonClick = () => {
      setIsDeleteDialogOpen(true);
    };

    const handleDeleteDialogAgree = () => {
      dispatchMemos((prevMemos) =>
        prevMemos.filter(({ id }) => id !== memo.id),
      );
    };

    const handleDeleteDialogClose = () => {
      setIsDeleteDialogOpen(false);
    };

    const handleUseChatButtonClick = () => {
      dispatchSetting((prev) => ({
        ...prev,
        useChat: true,
      }));
    };

    return (
      <>
        <Stack spacing={2}>
          <Card>
            <CardContent>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <Chip label={`${memo.text.length}文字`} size="small" />
                </Grid>

                <Grid item>
                  <Button variant="outlined" onClick={handleSettingButtonClick}>
                    設定
                  </Button>
                </Grid>

                <Grid item>
                  <Button onClick={handleCopyButtonClick}>コピー</Button>
                </Grid>

                <Grid item>
                  <Button onClick={handleDeleteButtonClick}>削除</Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              {memo.setting.useChat ? (
                <Chat />
              ) : (
                <>
                  <Typography gutterBottom>
                    <Button
                      variant="outlined"
                      onClick={handleUseChatButtonClick}
                    >
                      AIアシスタントに相談
                    </Button>
                  </Typography>

                  <Typography variant="caption" gutterBottom>
                    AIサーバーに情報を送信します
                    <br />
                    送信した情報は学習に利用されません
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Stack>

        <SettingDialog
          // ここでもAIチャットの設定をしないといけない
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
  },
);
