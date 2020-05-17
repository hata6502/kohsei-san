import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Popover, { PopoverProps } from '@material-ui/core/Popover';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import FeedbackIcon from '@material-ui/icons/Feedback';
import ShareIcon from '@material-ui/icons/Share';
import Alert, { AlertProps } from '@material-ui/lab/Alert';
import * as Sentry from '@sentry/browser';
import { TextlintMessage } from '@textlint/kernel';
import score from 'common/score';
import { Memo, MemosAction } from './useMemo';

declare global {
  interface Window {
    webkitSpeechRecognition?: typeof SpeechRecognition;
  }
}

const scoreAverage = 0.024654281552034554;
const scoreVariance = 0.00038698602006324937;

const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = Recognition && new Recognition();

if (recognition) {
  recognition.continuous = true;
}

const EditContainer = styled(Container)`
  ${({ theme }) => `
    margin-bottom: ${theme.spacing(2)}px;
    margin-top: ${theme.spacing(10)}px;
  `}
`;

const Pin = styled(FeedbackIcon)`
  ${({ theme }) => `
    background-color: ${theme.palette.background.paper};
  `}
  cursor: pointer;
  opacity: 0.5;
  position: absolute;
  transform: translateY(-100%);
`;

const TextContainer = styled.div`
  outline: 0;
`;

interface Message {
  index: TextlintMessage['index'];
  messages: TextlintMessage['message'][];
}

interface Pin {
  left: React.CSSProperties['left'];
  message: Message;
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
  memo,
}) => {
  const [deviation, setDeviation] = useState<number>();
  const [isLintErrorOpen, setIsLintErrorOpen] = useState(false);
  const [isTextContainerFocus, setIsTextContainerFocus] = useState(false);
  const [pins, setPins] = useState<Pin[]>([]);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState<Element>();
  const [popoverMessages, setPopoverMessages] = useState<Message['messages']>([]);

  const textRef = useRef<HTMLDivElement>(null);
  const textBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleRecognitionResult = ({ results }: SpeechRecognitionEvent) =>
      document.execCommand('inserttext', false, results[results.length - 1][0].transcript);

    recognition?.addEventListener('result', handleRecognitionResult);

    return () => recognition?.removeEventListener('result', handleRecognitionResult);
  }, []);

  useEffect(() => {
    if (textRef.current) {
      textRef.current.innerText = memo.text;
    }

    let isUnmounted = false;

    dispatchIsLinting(true);

    setTimeout(async () => {
      try {
        const { default: lint } = await import(/* webpackChunkName: "lint" */ 'common/lint');
        const result = await lint(memo.text);

        if (!isUnmounted && textRef.current && textBoxRef.current) {
          setDeviation(
            50 -
              ((score({ result, text: memo.text }) - scoreAverage) / Math.sqrt(scoreVariance)) * 10
          );

          const mergedMessages: Message[] = [];

          result.messages.forEach((message) => {
            const duplicatedMessage = mergedMessages.find(({ index }) => index === message.index);

            if (duplicatedMessage) {
              duplicatedMessage.messages.push(message.message);
            } else {
              mergedMessages.push({
                ...message,
                messages: [message.message],
              });
            }
          });

          const range = document.createRange();
          const text = textRef.current;
          const textBoxRect = textBoxRef.current.getBoundingClientRect();

          setPins(
            mergedMessages.map((message) => {
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
                top: rangeRect.top - textBoxRect.top,
              };
            })
          );
        }
      } catch (exception) {
        if (!isUnmounted) {
          setIsLintErrorOpen(true);
        }

        Sentry.captureException(exception);
        console.error(exception);
      } finally {
        dispatchIsLinting(false);
      }
    });

    return () => {
      isUnmounted = true;
    };
  }, [dispatchIsLinting, memo.text]);

  const isDisplayResult = !isTextContainerFocus && !isLinting;
  const isPopoverOpen = Boolean(popoverAnchorEl);

  const handleLintErrorClose: AlertProps['onClose'] = () => setIsLintErrorOpen(false);

  const handlePinClick = ({
    currentTarget,
    messages,
  }: {
    currentTarget: Element;
    messages: Message['messages'];
  }) => {
    setPopoverAnchorEl(currentTarget);
    setPopoverMessages(messages);
  };

  const handlePopoverClose: PopoverProps['onClose'] = () => setPopoverAnchorEl(undefined);

  const handleShareClick: React.MouseEventHandler = async () => {
    try {
      await navigator.share?.({
        text: memo.text,
      });
    } catch (exception) {
      if (exception instanceof DOMException && exception.name === 'AbortError') return;

      throw exception;
    }
  };

  const handleTextContainerBlur: React.FocusEventHandler = () => {
    recognition?.stop();

    dispatchMemos((prevMemos) =>
      prevMemos.map((prevMemo) => ({
        ...prevMemo,
        ...(prevMemo.id === memo.id && { text: textRef.current?.innerText }),
      }))
    );

    setIsTextContainerFocus(false);
  };

  const handleTextContainerFocus: React.FocusEventHandler = () => {
    recognition?.start();
    setIsTextContainerFocus(true);
  };

  return (
    <EditContainer>
      <Paper>
        <Box pb={2} pt={2}>
          <Container>
            <Chip
              label={`校正偏差値 ${deviation === undefined ? '??' : Math.round(deviation)}`}
              size="small"
            />

            <Box
              border={1}
              borderColor={(isTextContainerFocus && 'primary.main') || 'grey.500'}
              borderRadius="borderRadius"
              mb={2}
              mt={1}
              p={2}
              position="relative"
            >
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(props: any) => (
                // eslint-disable-next-line react/jsx-props-no-spreading
                <div {...props} ref={textBoxRef}>
                  <Typography component="div" variant="body1">
                    <TextContainer
                      // https://github.com/w3c/editing/issues/162
                      // @ts-ignore
                      contentEditable="plaintext-only"
                      onBlur={handleTextContainerBlur}
                      onFocus={handleTextContainerFocus}
                      ref={textRef}
                    />
                  </Typography>

                  {isDisplayResult &&
                    pins.map(({ top, left, message }) => (
                      <Pin
                        key={message.index}
                        color="primary"
                        onClick={({ currentTarget }) => {
                          handlePinClick({ currentTarget, messages: message.messages });
                        }}
                        style={{ top, left }}
                      />
                    ))}

                  <Popover
                    anchorEl={popoverAnchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    onClose={handlePopoverClose}
                    open={isPopoverOpen}
                    transformOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                  >
                    <Box p={2}>
                      {popoverMessages.map((message, index) => (
                        <div key={index}>{message}</div>
                      ))}
                    </Box>
                  </Popover>
                </div>
              )}
            </Box>

            {isDisplayResult &&
              ((pins.length === 0 && <Alert severity="success">校正を通過しました！</Alert>) || (
                <Alert severity="warning">
                  <div>
                    メッセージがあります。
                    <FeedbackIcon color="primary" />
                    を押して内容を確認してください。
                  </div>
                </Alert>
              ))}

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
    </EditContainer>
  );
};

export default Edit;
