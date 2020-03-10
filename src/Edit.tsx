import React, { useEffect, useState } from 'react';
import Alert, { AlertProps } from '@material-ui/lab/Alert';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import ShareIcon from '@material-ui/icons/Share';
import * as Sentry from '@sentry/browser';
import { TextlintMessage } from '@textlint/kernel';
import { Memo, MemosAction } from './App';
import lint from './lint';

declare global {
  interface Navigator {
    share?: (data?: { text?: string; url?: string }) => Promise<void>;
  }
}

export interface EditProps {
  dispatchIsLinting: React.Dispatch<boolean>;
  dispatchMemos: React.Dispatch<MemosAction>;
  isLinting: boolean;
  memo: Memo;
}

const Edit: React.FunctionComponent<EditProps> = ({
  dispatchIsLinting,
  dispatchMemos,
  isLinting,
  memo
}) => {
  const [isLintErrorOpen, setIsLintErrorOpen] = useState(false);
  const [messages, setMessages] = useState<TextlintMessage[]>([]);

  useEffect(() => {
    setTimeout(async () => {
      try {
        const result = await lint(memo.text);

        setMessages(result.messages);
      } catch (exception) {
        setIsLintErrorOpen(true);

        // eslint-disable-next-line no-console
        console.error(exception);
        Sentry.captureException(exception);
      } finally {
        dispatchIsLinting(false);
      }
    });
  }, [memo.text]);

  const handleLintErrorClose: AlertProps['onClose'] = () => setIsLintErrorOpen(false);

  const handleShareClick: React.MouseEventHandler = () =>
    navigator.share?.({
      text: memo.text,
      url: 'https://kohsei-san.b-hood.site/'
    });

  const handleTextBlur: React.FocusEventHandler<HTMLTextAreaElement> = ({ target }) => {
    if (target.value !== memo.text) {
      dispatchIsLinting(true);
    }

    dispatchMemos(prevMemos =>
      prevMemos.map(prevMemo => ({
        ...prevMemo,
        ...(prevMemo.id === memo.id && { text: target.value })
      }))
    );
  };

  return (
    <>
      <Paper>
        <Box pb={2}>
          <Container>
            <TextField
              defaultValue={memo.text}
              fullWidth
              label="本文"
              margin="normal"
              multiline
              onBlur={handleTextBlur}
              variant="outlined"
            />

            {!isLinting && messages.length === 0 && memo.text !== '' && (
              <Alert severity="success">校正を通過しました！</Alert>
            )}

            <ul>
              {messages.map(({ column, index, message, line }) => (
                <li key={index}>{`行${line}, 列${column}: ${message}`}</li>
              ))}
            </ul>

            {navigator.share && (
              <Button
                color="primary"
                onClick={handleShareClick}
                startIcon={<ShareIcon />}
                variant="contained"
              >
                共有
              </Button>
            )}
          </Container>
        </Box>
      </Paper>

      <Snackbar open={isLintErrorOpen}>
        <Alert onClose={handleLintErrorClose} severity="error">
          本文を校正できませんでした。 アプリの不具合が修正されるまで、しばらくお待ちください。
        </Alert>
      </Snackbar>
    </>
  );
};

export default Edit;
