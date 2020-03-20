import React, { useEffect, useRef, useState } from 'react';
import Alert, { AlertProps } from '@material-ui/lab/Alert';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import FeedbackIcon from '@material-ui/icons/Feedback';
import ShareIcon from '@material-ui/icons/Share';
import escape from 'escape-html';
import * as Sentry from '@sentry/browser';
import { TextlintMessage } from '@textlint/kernel';
import lint from './lint';
import { Memo, MemosAction } from './useMemo';

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
    let isUnmounted = false;

    (async () => {
      if (!isUnmounted) {
        dispatchIsLinting(true);
      }

      try {
        const result = await lint(memo.text);

        if (!isUnmounted) {
          setMessages(result.messages);
        }
      } catch (exception) {
        if (!isUnmounted) {
          setIsLintErrorOpen(true);
        }

        // eslint-disable-next-line no-console
        console.error(exception);
        Sentry.captureException(exception);
      } finally {
        if (!isUnmounted) {
          dispatchIsLinting(false);
        }
      }
    })();

    return () => {
      isUnmounted = true;
    };
  }, [memo.text]);

  const testRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const pins = testRef.current && messages.map((message) => {
    const test = testRef.current as HTMLDivElement;
    const testRect = test.getBoundingClientRect();
    const range = document.createRange();

    range.setStart(textRef.current?.childNodes[0], message.index);

    const rangeRect = range.getBoundingClientRect();

    return {
      message,
      top: rangeRect.top - testRect.top,
      left: rangeRect.left - testRect.left,
    }
  });

  const handleLintErrorClose: AlertProps['onClose'] = () => setIsLintErrorOpen(false);

  const handleShareClick: React.MouseEventHandler = () =>
    navigator.share?.({
      text: memo.text,
      url: 'https://kohsei-san.b-hood.site/'
    });

  const handleTextBlur: React.FocusEventHandler<HTMLDivElement> = ({ target }) =>
    dispatchMemos(prevMemos =>
      prevMemos.map(prevMemo => ({
        ...prevMemo,
        ...(prevMemo.id === memo.id && { text: target.textContent || '' })
      }))
    );

  return (
    <>
      <Paper>
        <Box pb={2}>
          <Container>
            <div style={{ position: 'relative' }} ref={testRef}>
              <div contentEditable dangerouslySetInnerHTML={{__html: escape(memo.text)}} onBlur={handleTextBlur} ref={textRef} />

              {pins?.map(({ top, left, message }) => {
                return <FeedbackIcon key={message.index} color='primary' style={{ position: 'absolute', top, left, transform: 'translateY(-80%)' }} />;
              })}
            </div>

            {!isLinting && messages.length === 0 && memo.text !== '' && (
              <Alert severity="success">校正を通過しました！</Alert>
            )}

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
