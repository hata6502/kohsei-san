import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import FeedbackIcon from '@material-ui/icons/Feedback';
import ShareIcon from '@material-ui/icons/Share';
import Alert, { AlertProps } from '@material-ui/lab/Alert';
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
  transform: translateY(-100%);
`;

const TextContainer = styled.div`
  outline: 0;
`;

interface Pin {
  left: React.CSSProperties['left'];
  message: TextlintMessage;
  top: React.CSSProperties['top'];
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
  const [isTextContainerFocus, setIsTextContainerFocus] = useState(false);
  const [messages, setMessages] = useState<TextlintMessage[]>([]);
  const [pins, setPins] = useState<Pin[]>([]);

  const textRef = useRef<HTMLDivElement>(null);
  const textBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      textRef.current.innerText = memo.text;
    }
  }, []);

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

  useEffect(() => {
    try {
      if (!textRef.current || !textBoxRef.current) {
        return;
      }

      const range = document.createRange();
      const text = textRef.current;
      const textBoxRect = textBoxRef.current.getBoundingClientRect();

      setPins(
        messages.map(message => {
          let childNodesIndex = 0;
          let offset = message.index;

          for (
            childNodesIndex = 0;
            childNodesIndex < text.childNodes.length;
            childNodesIndex += 1
          ) {
            const child = text.childNodes[childNodesIndex];
            const length =
              (child instanceof HTMLBRElement && 1) || (child instanceof Text && child.length);

            if (!length) {
              throw new Error('Unexpected node type. ');
            }

            if (offset < length) {
              range.setStart(child, offset);

              break;
            }

            offset -= length;
          }

          if (childNodesIndex >= text.childNodes.length) {
            throw new Error('Pin position is not found. ');
          }

          const rangeRect = range.getBoundingClientRect();

          return {
            left: rangeRect.left - textBoxRect.left,
            message,
            top: rangeRect.top - textBoxRect.top
          };
        })
      );
    } catch (exception) {
      setIsLintErrorOpen(true);

      // eslint-disable-next-line no-console
      console.error(exception);
      Sentry.captureException(exception);
    }
  }, [messages, textRef.current, textBoxRef.current]);

  const handleLintErrorClose: AlertProps['onClose'] = () => setIsLintErrorOpen(false);

  const handleShareClick: React.MouseEventHandler = () =>
    navigator.share?.({
      text: memo.text,
      url: 'https://kohsei-san.b-hood.site/'
    });

  const handleTextContainerBlur: React.FocusEventHandler<HTMLDivElement> = ({ target }) => {
    dispatchMemos(prevMemos =>
      prevMemos.map(prevMemo => ({
        ...prevMemo,
        ...(prevMemo.id === memo.id && { text: target.innerText })
      }))
    );

    if (textRef.current) {
      textRef.current.innerText = target.innerText;
    }

    setIsTextContainerFocus(false);
  };

  const handleTextContainerFocus: React.FocusEventHandler = () => setIsTextContainerFocus(true);

  return (
    <>
      <Paper>
        <Box pb={2} pt={2}>
          <Container>
            <Box
              border={1}
              borderColor={(isTextContainerFocus && 'primary.main') || 'grey.500'}
              borderRadius="borderRadius"
              p={2}
              position="relative"
            >
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(props: any) => (
                // eslint-disable-next-line react/jsx-props-no-spreading
                <div {...props} ref={textBoxRef}>
                  <Typography component="div" variant="body1">
                    <TextContainer
                      contentEditable
                      onBlur={handleTextContainerBlur}
                      onFocus={handleTextContainerFocus}
                      ref={textRef}
                    />
                  </Typography>

                  {isTextContainerFocus ||
                    pins.map(({ top, left, message }) => (
                      <Pin key={message.index} color="primary" style={{ top, left }} />
                    ))}
                </div>
              )}
            </Box>

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
