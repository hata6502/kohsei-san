import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Popover, { PopoverProps } from '@material-ui/core/Popover';
import Snackbar from '@material-ui/core/Snackbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import FeedbackIcon from '@material-ui/icons/Feedback';
import ShareIcon from '@material-ui/icons/Share';
import SpellcheckIcon from '@material-ui/icons/Spellcheck';
import Alert, { AlertProps } from '@material-ui/lab/Alert';
import * as Sentry from '@sentry/browser';
import type { TextlintMessage } from '@textlint/kernel';
import score from 'common/score';
import type { LintWorkerMessage } from './lintWorker';
import { Memo, MemosAction } from './useMemo';

const lintingTimeoutLimitMS = 10000;
const scoreAverage = 0.003685109284;
const scoreVariance = 0.00001274531341;

const EditContainer = styled(Container)`
  ${({ theme }) => `
    margin-bottom: ${theme.spacing(2)}px;
    margin-top: ${theme.spacing(10)}px;
  `}
`;

const MessagePopover = styled(Popover)`
  word-break: break-all;
`;

const PinIcon = styled(FeedbackIcon)`
  ${({ theme }) => `
    background-color: ${theme.palette.background.paper};
  `}
  opacity: 0.5;
  vertical-align: middle;
`;

const PinTarget = styled.div`
  cursor: pointer;
  padding: 12px;
  position: absolute;
  transform: translateY(-100%);
`;

const TextContainer = styled.div`
  ${({ theme }) => `
    &:empty::before {
      content: '校正する文章を入力';
      color: ${theme.palette.text.disabled};
    }
  `}
  outline: 0;
  word-break: break-all;
`;

interface Message {
  index: TextlintMessage['index'];
  messages: TextlintMessage[];
}

interface Pin {
  left: React.CSSProperties['left'];
  message: Message;
  top: React.CSSProperties['top'];
}

export interface EditProps {
  dispatchIsLinting: React.Dispatch<boolean>;
  dispatchIsLintingHeavy: React.Dispatch<boolean>;
  dispatchMemos: React.Dispatch<MemosAction>;
  isLinting: boolean;
  lintWorker: Worker;
  memo: Memo;
}

const Edit: React.FunctionComponent<EditProps> = ({
  dispatchIsLinting,
  dispatchIsLintingHeavy,
  dispatchMemos,
  isLinting,
  lintWorker,
  memo,
}) => {
  const [deviation, setDeviation] = useState<number>();
  const [isLintErrorOpen, setIsLintErrorOpen] = useState(false);
  const [isTextContainerFocus, setIsTextContainerFocus] = useState(false);
  const [negaposiScore, setNegaposiScore] = useState<number>();
  const [pins, setPins] = useState<Pin[]>();
  const [popoverAnchorEl, setPopoverAnchorEl] = useState<Element>();
  const [popoverMessages, setPopoverMessages] = useState<Message['messages']>([]);

  const textRef = useRef<HTMLDivElement>(null);
  const textBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dispatchText = () =>
      dispatchMemos((prevMemos) =>
        prevMemos.map((prevMemo) => ({
          ...prevMemo,
          ...(prevMemo.id === memo.id && { text: textRef.current?.innerText }),
        }))
      );

    window.addEventListener('beforeunload', dispatchText);

    return () => window.removeEventListener('beforeunload', dispatchText);
  }, [dispatchMemos, memo.id]);

  useEffect(() => {
    if (!textRef.current) {
      return;
    }

    textRef.current.innerText = memo.text;
  }, [memo.text]);

  useEffect(() => {
    if (!lintWorker || memo.result) {
      return;
    }

    lintWorker.postMessage(memo.text);

    const lintingTimeoutID = setTimeout(() => dispatchIsLintingHeavy(true), lintingTimeoutLimitMS);

    dispatchIsLinting(true);
    dispatchIsLintingHeavy(false);

    return () => {
      clearTimeout(lintingTimeoutID);

      dispatchIsLinting(false);
    };
  }, [
    dispatchIsLinting,
    dispatchIsLintingHeavy,
    dispatchMemos,
    lintWorker,
    memo.id,
    memo.result,
    memo.text,
  ]);

  useEffect(() => {
    const handleLintWorkerError = () => {
      dispatchIsLinting(false);
      setIsLintErrorOpen(true);
    };

    const handleLintWorkerMessage = (event: MessageEvent<LintWorkerMessage>) => {
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

  useEffect(() => {
    if (!memo.result) {
      return;
    }

    try {
      if (!textRef.current || !textBoxRef.current) {
        throw new Error();
      }

      setDeviation(
        50 -
          ((score({ result: memo.result, text: memo.text }) - scoreAverage) /
            Math.sqrt(scoreVariance)) *
            10
      );

      const mergedMessages: Message[] = [];

      memo.result.messages.forEach((message) => {
        const duplicatedMessage = mergedMessages.find(({ index }) => index === message.index);

        if (duplicatedMessage) {
          duplicatedMessage.messages.push(message);
        } else {
          mergedMessages.push({
            ...message,
            messages: [message],
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
              throw new Error('不明な DOM ノードです。');
            }

            if (offset < length) {
              range.setStart(child, offset);

              break;
            }

            offset -= length;
          }

          if (childNodesIndex >= text.childNodes.length) {
            throw new Error('ピンの位置が見つかりませんでした。');
          }

          const rangeRect = range.getBoundingClientRect();

          return {
            left: rangeRect.left - textBoxRect.left - 12,
            message,
            top: rangeRect.top - textBoxRect.top + 12,
          };
        })
      );
    } catch (exception) {
      setIsLintErrorOpen(true);

      Sentry.captureException(exception);
      console.error(exception);
    } finally {
      dispatchIsLinting(false);
    }
  }, [dispatchIsLinting, memo.result, memo.text]);

  useEffect(() => {
    let isUnmounted = false;

    (async () => {
      const { analyzeNegaposi } = await import(/* webpackChunkName: "negaposi" */ 'negaposi');

      if (!isUnmounted) {
        setNegaposiScore(analyzeNegaposi({ text: memo.text }));
      }
    })();

    return () => {
      isUnmounted = true;
    };
  }, [memo.text]);

  const isDisplayResult = !isTextContainerFocus && !isLinting;
  const isPopoverOpen = Boolean(popoverAnchorEl);

  const handleFixClick = ({ message }: { message: TextlintMessage }) => {
    if (!message.fix) {
      throw new Error();
    }

    const { range, text } = message.fix;

    dispatchMemos((prevMemos) =>
      prevMemos.map((prevMemo) => ({
        ...prevMemo,
        ...(prevMemo.id === memo.id && {
          result: undefined,
          text: `${prevMemo.text.slice(0, range[0])}${text}${prevMemo.text.slice(range[1])}`,
        }),
      }))
    );

    setPopoverAnchorEl(undefined);
  };

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
      if (!(exception instanceof DOMException) || exception.code !== DOMException.ABORT_ERR) {
        throw exception;
      }
    }
  };

  const handleTextContainerBlur: React.FocusEventHandler = () => {
    if (!textRef.current) {
      throw new Error();
    }

    const text = textRef.current.innerText;

    textRef.current.innerText = text;

    dispatchMemos((prevMemos) =>
      prevMemos.map((prevMemo) => ({
        ...prevMemo,
        ...(prevMemo.id === memo.id && {
          result: undefined,
          text,
        }),
      }))
    );

    setIsTextContainerFocus(false);
  };

  const handleTextContainerFocus: React.FocusEventHandler = () => setIsTextContainerFocus(true);

  return (
    <EditContainer maxWidth="md">
      <Paper>
        <Box pb={2} pt={2}>
          <Container>
            <Grid container spacing={1} wrap="wrap">
              <Grid item>
                <Chip label={`${memo.text.length} 文字`} size="small" />
              </Grid>

              <Grid item>
                <Chip
                  clickable
                  component="a"
                  href="https://github.com/hata6502/kohsei-san#校正偏差値"
                  label={`偏差値 ${deviation && isDisplayResult ? Math.round(deviation) : '??'}`}
                  rel="noreferrer"
                  size="small"
                  target="_blank"
                />
              </Grid>

              <Grid item>
                <Chip
                  clickable
                  component="a"
                  href="https://github.com/hata6502/kohsei-san#ネガポジ判定"
                  label={`ネガポジ ${
                    !isDisplayResult || negaposiScore === undefined
                      ? '??'
                      : negaposiScore < -0.6
                      ? '😢'
                      : negaposiScore < -0.2
                      ? '😧'
                      : negaposiScore < 0.2
                      ? '😐'
                      : negaposiScore < 0.6
                      ? '😃'
                      : '😄'
                  }`}
                  rel="noreferrer"
                  size="small"
                  target="_blank"
                />
              </Grid>
            </Grid>

            <Box
              border={1}
              borderColor={isTextContainerFocus ? 'primary.main' : 'grey.500'}
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
                      contentEditable="true"
                      onBlur={handleTextContainerBlur}
                      onFocus={handleTextContainerFocus}
                      ref={textRef}
                    />
                  </Typography>

                  {isDisplayResult &&
                    pins?.map(({ left, message, top }) => (
                      <PinTarget
                        key={message.index}
                        style={{ left, top }}
                        onClick={({ currentTarget }) => {
                          handlePinClick({ currentTarget, messages: message.messages });
                        }}
                      >
                        <PinIcon color="primary" />
                      </PinTarget>
                    ))}

                  <MessagePopover
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
                    <Container maxWidth="sm">
                      <List>
                        {popoverMessages.map((message, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={message.message} />

                            <ListItemSecondaryAction>
                              {message.fix && (
                                <Tooltip title="自動修正">
                                  <IconButton
                                    edge="end"
                                    onClick={() => handleFixClick({ message })}
                                  >
                                    <SpellcheckIcon />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    </Container>
                  </MessagePopover>
                </div>
              )}
            </Box>

            {isDisplayResult &&
              pins &&
              (pins.length === 0 ? (
                <Alert severity="success">校正を通過しました。おめでとうございます！</Alert>
              ) : (
                <Alert severity="info">
                  <div>
                    自動校正によるメッセージがあります。
                    <FeedbackIcon color="primary" />
                    を押して参考にしてみてください。
                  </div>
                </Alert>
              ))}

            {navigator.share && (
              <Box mt={1}>
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
