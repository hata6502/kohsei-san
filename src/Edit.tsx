import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import FeedbackIcon from '@material-ui/icons/Feedback';
import ShareIcon from '@material-ui/icons/Share';
import Alert, { AlertProps } from '@material-ui/lab/Alert';
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

const Pin = styled(FeedbackIcon)`
  position: absolute;
  transform: translateY(-80%);
`;

const TextContainer = styled.div`
  position: relative;
`;

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

  const textRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  const pins = textRef.current && textContainerRef.current && messages.map((message) => {
    const textContainer = textContainerRef.current as HTMLDivElement;
    const textContainerRect = textContainer.getBoundingClientRect();

    const text = textRef.current as HTMLDivElement;
    const range = document.createRange();

    range.setStart(text.childNodes[0], message.index);

    const rangeRect = range.getBoundingClientRect();

    return {
      message,
      top: rangeRect.top - textContainerRect.top,
      left: rangeRect.left - textContainerRect.left,
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
        ...(prevMemo.id === memo.id && { text: target.innerText })
      }))
    );

  return (
    <>
      <Paper>
        <Box pb={2}>
          <Container>
            <TextContainer ref={textContainerRef}>
              <div
                contentEditable
                dangerouslySetInnerHTML={{ __html: escape(memo.text).replace(/\n/g, '<br />') }}
                onBlur={handleTextBlur}
                ref={textRef}
              />

              {pins?.map(({ top, left, message }) =>
                <Pin key={message.index} color='primary' style={{ top, left }} />
              )}
            </TextContainer>

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
