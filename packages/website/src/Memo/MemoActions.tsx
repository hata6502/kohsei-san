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
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";
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
      <Stack spacing={2}>
        <Card>
          <CardContent>
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

                <IconButton onClick={handleDeleteButtonClick} aria-label="削除">
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {navigator.onLine && (
          <Card>
            <CardContent>
              {memo.setting.useChat ? (
                <Chat memo={memo} />
              ) : (
                <>
                  <Typography gutterBottom>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={handleUseChatButtonClick}
                    >
                      校正さんに相談（ベータ版）
                    </Button>
                  </Typography>

                  <Typography variant="body2" gutterBottom>
                    AIサーバーに情報を送信・保持します
                    <br />
                    ベータ版は評価目的で提供され、性能や品質について保証はなく、一切の責任を負いません
                  </Typography>

                  <Typography variant="caption" gutterBottom>
                    This site is protected by reCAPTCHA and the Google{" "}
                    <Link
                      href="https://policies.google.com/privacy"
                      target="_blank"
                    >
                      Privacy Policy
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="https://policies.google.com/terms"
                      target="_blank"
                    >
                      Terms of Service
                    </Link>{" "}
                    apply.
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        )}

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
      </Stack>
    );
  },
);
