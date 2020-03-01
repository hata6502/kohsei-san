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
import lint from './lint';

declare global {
  interface Navigator {
    share?: (data?: { text?: string; title?: string; url?: string }) => Promise<void>;
  }
}

export interface EditProp {
  dispatchIsLinting: React.Dispatch<boolean>;
}

const Edit: React.FunctionComponent<EditProp> = ({ dispatchIsLinting }) => {
  const [isLintErrorOpen, setIsLintErrorOpen] = useState(false);
  const [isSaveErrorOpen, setIsSaveErrorOpen] = useState(false);
  const [messages, setMessages] = useState<TextlintMessage[]>([]);
  const [text, setText] = useState(() => localStorage.getItem('text') || '');
  const [title, setTitle] = useState(() => localStorage.getItem('title') || '');

  useEffect(() => {
    try {
      localStorage.setItem('text', text);
      localStorage.setItem('title', title);
    } catch (exception) {
      setIsSaveErrorOpen(true);

      // eslint-disable-next-line no-console
      console.error(exception);
      Sentry.captureException(exception);
    }
  }, [text, title]);

  const handleLintErrorClose: AlertProps['onClose'] = () => setIsLintErrorOpen(false);

  const handleSaveErrorClose: AlertProps['onClose'] = () => setIsSaveErrorOpen(false);

  const handleShareClick: React.MouseEventHandler = () =>
    navigator.share?.({
      text,
      title,
      url: 'https://kohsei-san.b-hood.site/'
    });

  const handleTextBlur: React.FocusEventHandler<HTMLTextAreaElement> = ({ target }) => {
    setText(target.value);

    dispatchIsLinting(true);
    setTimeout(async () => {
      try {
        const result = await lint(target.value);

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
  };

  const handleTitleBlur: React.FocusEventHandler<HTMLTextAreaElement> = ({ target }) =>
    setTitle(target.value);

  return (
    <>
      <Paper>
        <Container>
          <TextField
            defaultValue={title}
            fullWidth
            label="タイトル"
            margin="normal"
            onBlur={handleTitleBlur}
          />

          <TextField
            defaultValue={text}
            fullWidth
            label="本文"
            margin="normal"
            multiline
            onBlur={handleTextBlur}
            variant="outlined"
          />

          <ul>
            {messages.map(({ column, index, message, line }) => (
              <li key={index}>{`行${line}, 列${column}: ${message}`}</li>
            ))}
          </ul>

          {navigator.share && (
            <Box pb={2}>
              <Button
                color="primary"
                onClick={handleShareClick}
                startIcon={<ShareIcon />}
                variant="contained"
              >
                共有
              </Button>
            </Box>
          )}
        </Container>
      </Paper>

      <Snackbar open={isLintErrorOpen}>
        <Alert onClose={handleLintErrorClose} severity="error">
          本文を校正できませんでした。 アプリの不具合が修正されるまで、しばらくお待ちください。
        </Alert>
      </Snackbar>

      <Snackbar open={isSaveErrorOpen}>
        <Alert onClose={handleSaveErrorClose} severity="error">
          メモをローカルに保存できませんでした。 メモのバックアップを取り、LocalStorage
          を使用できることを確認してください。
        </Alert>
      </Snackbar>
    </>
  );
};

export default Edit;
