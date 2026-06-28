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
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ChatIcon from "@mui/icons-material/Chat";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";
import type { ProofreadingMessage } from "../lintWorker";
import { createMemo, useDispatchSetting } from "../useMemo";
import type { Memo, MemosAction } from "../useMemo";
import { Chat } from "./Chat";
import { getLintMessages, getMessageSnippet } from "./proofreadingMessages";
import type { LintMessage } from "./proofreadingMessages";
import { SettingDialog } from "./SettingDialog";

export const MemoActions: React.FunctionComponent<{
  chatEnabled: boolean;
  dispatchIsCopiedSnackbarOpen: React.Dispatch<boolean>;
  dispatchIsSidebarOpen: React.Dispatch<boolean>;
  dispatchMemoId: React.Dispatch<Memo["id"]>;
  dispatchMemos: React.Dispatch<MemosAction>;
  memo: Memo;
  memos: Memo[];
  onProofreadingDetailOpen: ({
    index,
  }: {
    index: ProofreadingMessage["index"];
  }) => void;
}> = ({
  chatEnabled,
  dispatchIsCopiedSnackbarOpen,
  dispatchIsSidebarOpen,
  dispatchMemoId,
  dispatchMemos,
  memo,
  memos,
  onProofreadingDetailOpen,
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
    const { result, setting, text } = memo;
    const copiedMemo = { ...createMemo(), result, setting, text };

    dispatchMemos((prevMemos) => [copiedMemo, ...prevMemos]);
    dispatchIsCopiedSnackbarOpen(true);
    dispatchIsSidebarOpen(true);
    dispatchMemoId(copiedMemo.id);
  };

  const handleDeleteButtonClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteDialogAgree = () => {
    dispatchMemos((prevMemos) => prevMemos.filter(({ id }) => id !== memo.id));
  };

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleUseChatButtonClick = () => {
    dispatchMemoId("");
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
              <IconButton onClick={handleSettingButtonClick} aria-label="設定">
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

      <ProofreadingMessagesCard
        memo={memo}
        onProofreadingDetailOpen={onProofreadingDetailOpen}
      />

      {navigator.onLine && (
        <Card>
          <CardContent>
            {chatEnabled ? (
              <Chat dispatchMemos={dispatchMemos} memo={memo} memos={memos} />
            ) : (
              <Stack alignItems="center" spacing={2}>
                <img
                  alt=""
                  src="j260_12_0.svg"
                  style={{ opacity: 0.45, width: 120 }}
                />

                <Typography variant="h6">校正さんに相談</Typography>

                <Typography align="center" variant="body2">
                  文章全体の意味を読み取ったうえで見直しをしたいとき、AIに相談してみてください。
                </Typography>

                <Button
                  fullWidth
                  startIcon={<ChatIcon />}
                  variant="outlined"
                  onClick={handleUseChatButtonClick}
                >
                  相談する
                </Button>
              </Stack>
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
          <Button onClick={handleDeleteDialogClose} color="secondary" autoFocus>
            削除しない
          </Button>

          <Button onClick={handleDeleteDialogAgree} color="secondary">
            削除する
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

const ProofreadingMessagesCard: React.FunctionComponent<{
  memo: Memo;
  onProofreadingDetailOpen: ({
    index,
  }: {
    index: ProofreadingMessage["index"];
  }) => void;
}> = ({ memo, onProofreadingDetailOpen }) => {
  const lintMessages = getLintMessages(memo.result?.messages ?? []);
  if (!lintMessages.length) {
    return;
  }

  return (
    <Card>
      <CardContent>
        <Stack spacing={1}>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: "center",
            }}
          >
            <Typography component="h2" variant="h6">
              見直し箇所
            </Typography>
          </Stack>

          <List disablePadding>
            {lintMessages.map((lintMessage) => (
              <ProofreadingMessagesCardItem
                key={lintMessage.index}
                lintMessage={lintMessage}
                onProofreadingDetailOpen={onProofreadingDetailOpen}
                text={memo.text}
              />
            ))}
          </List>
        </Stack>
      </CardContent>
    </Card>
  );
};

const ProofreadingMessagesCardItem: React.FunctionComponent<{
  lintMessage: LintMessage;
  onProofreadingDetailOpen: ({
    index,
  }: {
    index: ProofreadingMessage["index"];
  }) => void;
  text: string;
}> = ({ lintMessage, onProofreadingDetailOpen, text }) => {
  const { afterText, beforeText, targetText } = getMessageSnippet({
    lintMessage,
    text,
  });

  const handleDetailButtonClick = () => {
    onProofreadingDetailOpen({ index: lintMessage.index });
  };

  return (
    <ListItem
      disableGutters
      divider
      secondaryAction={
        <Button size="small" onClick={handleDetailButtonClick}>
          詳しく表示する
        </Button>
      }
    >
      <ListItemText
        primary={
          <Typography component="span" variant="body2">
            {beforeText}「{targetText}」{afterText}
          </Typography>
        }
      />
    </ListItem>
  );
};
