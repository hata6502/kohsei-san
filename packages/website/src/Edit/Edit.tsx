import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Container from '@material-ui/core/Container';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import ShareIcon from '@material-ui/icons/Share';
import { v4 as uuidv4 } from 'uuid';
import type { LintWorkerLintMessage, LintWorkerResultMessage } from '../lintWorker';
import { useDispatchSetting } from '../useMemo';
import type { Memo, MemosAction } from '../useMemo';
import { SettingDialog } from './SettingDialog';
import { TextContainer } from './TextContainer';

const lintingTimeoutLimitMS = 10000;

const EditContainer = styled(Container)`
  ${({ theme }) => `
    margin-bottom: ${theme.spacing(2)}px;
    margin-top: ${theme.spacing(2)}px;
  `}
`;

const Edit: React.FunctionComponent<{
  dispatchIsCopiedSnackbarOpen: React.Dispatch<boolean>;
  dispatchIsLinting: React.Dispatch<boolean>;
  dispatchIsLintingHeavy: React.Dispatch<boolean>;
  dispatchIsSidebarOpen: React.Dispatch<boolean>;
  dispatchMemoId: React.Dispatch<Memo['id']>;
  dispatchMemos: React.Dispatch<MemosAction>;
  isLinting: boolean;
  lintWorker: Worker;
  memo: Memo;
  memos: Memo[];
}> = React.memo(
  ({
    dispatchIsCopiedSnackbarOpen,
    dispatchIsLinting,
    dispatchIsLintingHeavy,
    dispatchIsSidebarOpen,
    dispatchMemoId,
    dispatchMemos,
    isLinting,
    lintWorker,
    memo,
    memos,
  }) => {
    const [isTextContainerFocused, dispatchIsTextContainerFocused] = useState(false);

    const [isSettingDialogOpen, setIsSettingDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const dispatchSetting = useDispatchSetting({ dispatchMemos, memoId: memo.id });

    useEffect(
      () => () => {
        dispatchIsLinting(false);
      },
      [dispatchIsLinting]
    );

    useEffect(() => {
      if (!lintWorker || memo.result) {
        return;
      }

      const userDictionaryMemo = memos.find(
        ({ id }) => id === memo.setting.lintOption.userDictionaryMemoId
      );
      const professionalModeLintOption = {
        ...memo.setting.lintOption,
        jaSimpleUserDictionary: {
          dictionary:
            userDictionaryMemo?.text
              .trim()
              .split('\n')
              .slice(1)
              .join('\n')
              .split('\n\n')
              .flatMap((section) => {
                const lines = section.trim().split('\n');
                return lines[0] ? [{ pattern: lines[0], message: lines.slice(1).join('\n') }] : [];
              }) ?? [],
        },
      };

      const message: LintWorkerLintMessage = {
        lintOption: {
          professional: professionalModeLintOption,
          standard: {},
        }[memo.setting.mode],
        text: memo.text,
      };

      lintWorker.postMessage(message);

      const lintingTimeoutID = setTimeout(
        () => dispatchIsLintingHeavy(true),
        lintingTimeoutLimitMS
      );

      dispatchIsLinting(true);
      dispatchIsLintingHeavy(false);

      return () => clearTimeout(lintingTimeoutID);
    }, [
      dispatchIsLinting,
      dispatchIsLintingHeavy,
      dispatchMemos,
      lintWorker,
      memo.id,
      memo.result,
      memo.setting.lintOption,
      memo.setting.mode,
      memo.text,
    ]);

    useEffect(() => {
      const handleLintWorkerError = () => {
        dispatchIsLinting(false);

        throw new Error();
      };

      const handleLintWorkerMessage = (event: MessageEvent<LintWorkerResultMessage>) => {
        if (event.data.text !== memo.text) {
          return;
        }

        dispatchMemos((prevMemos) =>
          prevMemos.map((prevMemo) => ({
            ...prevMemo,
            ...(prevMemo.id === memo.id && { result: event.data.result }),
          }))
        );
      };

      lintWorker.addEventListener('error', handleLintWorkerError);
      lintWorker.addEventListener('message', handleLintWorkerMessage);

      return () => {
        lintWorker.removeEventListener('error', handleLintWorkerError);
        lintWorker.removeEventListener('message', handleLintWorkerMessage);
      };
    }, [dispatchIsLinting, dispatchMemos, lintWorker, memo.id, memo.text]);

    const shouldDisplayResult = !isTextContainerFocused && !isLinting;

    const handleShareClick = useCallback(async () => {
      try {
        await navigator.share?.({
          text: memo.text,
        });
      } catch (exception) {
        if (!(exception instanceof DOMException) || exception.code !== DOMException.ABORT_ERR) {
          throw exception;
        }
      }
    }, [memo.text]);

    const handleSettingButtonClick = useCallback(() => setIsSettingDialogOpen(true), []);
    const handleSettingDialogClose = useCallback(() => setIsSettingDialogOpen(false), []);

    const handleCopyButtonClick = useCallback(() => {
      const id = uuidv4();

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
    }, [dispatchIsCopiedSnackbarOpen, dispatchIsSidebarOpen, dispatchMemoId, dispatchMemos, memo]);

    const handleDeleteButtonClick = useCallback(() => setIsDeleteDialogOpen(true), []);

    const handleDeleteDialogAgree = useCallback(() => {
      dispatchMemos((prevMemos) => prevMemos.filter(({ id }) => id !== memo.id));
    }, [dispatchMemos, memo.id]);

    const handleDeleteDialogClose = useCallback(
      () => setIsDeleteDialogOpen(false),
      [setIsDeleteDialogOpen]
    );

    return (
      <EditContainer maxWidth="md">
        <Paper>
          <Box pb={2} pt={2}>
            <Container>
              <Grid container spacing={1} wrap="wrap">
                <Grid item>
                  <Chip
                    label={`${shouldDisplayResult ? memo.text.length : '??'} 文字`}
                    size="small"
                  />
                </Grid>
              </Grid>

              <TextContainer
                dispatchIsLinting={dispatchIsLinting}
                dispatchIsTextContainerFocused={dispatchIsTextContainerFocused}
                dispatchMemos={dispatchMemos}
                isTextContainerFocused={isTextContainerFocused}
                memo={memo}
                shouldDisplayResult={shouldDisplayResult}
              />

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
                    <Button variant="outlined" onClick={handleSettingButtonClick}>
                      校正設定
                    </Button>
                  </Grid>

                  <Grid item>
                    <Button variant="outlined" onClick={handleCopyButtonClick}>
                      コピー
                    </Button>
                  </Grid>

                  <Grid item>
                    <Button variant="outlined" onClick={handleDeleteButtonClick}>
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
            <DialogContentText>削除を元に戻すことはできません。</DialogContentText>
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
      </EditContainer>
    );
  }
);

export { Edit };
