import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import ShareIcon from '@material-ui/icons/Share';
import Alert, { AlertProps } from '@material-ui/lab/Alert';
import * as Sentry from '@sentry/browser';
import { TextlintMessage } from '@textlint/kernel';
import score from 'common/score';
import { Memo, MemosAction } from './useMemo';

import Korrect from 'korrect';
import 'korrect/korrect.css';

const scoreAverage = 0.01314297939;
const scoreVariance = 0.00007091754903;

let korrect = null;

const EditContainer = styled(Container)`
  ${({ theme }) => `
    margin-bottom: ${theme.spacing(2)}px;
    margin-top: ${theme.spacing(10)}px;
  `}
`;

const TextContainer = styled.div`
  ${({ theme }) => `
    &:empty::before {
      content: '校正する文章を入力';
      color: ${theme.palette.text.disabled};
    }
  `}
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
  const [deviation, setDeviation] = useState(50);
  const [isLintErrorOpen, setIsLintErrorOpen] = useState(false);
  const [isTextContainerFocus, setIsTextContainerFocus] = useState(false);

  const textRef = useRef<HTMLDivElement>(null);
  const textBoxRef = useRef<HTMLDivElement>(null);

  const dispatchMemo = useCallback(
    () =>
      dispatchMemos((prevMemos) =>
        prevMemos.map((prevMemo) => ({
          ...prevMemo,
          ...(prevMemo.id === memo.id && { text: textRef.current?.textContent }),
        }))
      ),
    [dispatchMemos, memo.id]
  );

  useEffect(() => {
    korrect = new Korrect({
      onChangeDebounceTimeout: 300,
      hideSpinner: true,
      onTextCorrect: () => {
        dispatchMemo();
        setIsTextContainerFocus(false);
      },
    }).init();
  }, [dispatchMemo]);

  useEffect(() => {
    window.addEventListener('beforeunload', dispatchMemo);

    return () => window.removeEventListener('beforeunload', dispatchMemo);
  }, [dispatchMemo]);

  useEffect(() => {
    if (textRef.current && textRef.current.textContent !== memo.text) {
      textRef.current.textContent = memo.text;
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

          // convert messages for korrect
          const corrections = mergedMessages.map((msg) => {
            const ret = {
              length: 1,
              replacements: [],
              offset: msg.index,
              message: msg.message,
              rule: {
                id: msg.ruleId,
                description: msg.message,
              },
            };

            if (msg.fix) {
              const [begin, end] = msg.fix.range;
              ret.offset = begin;
              ret.length = end - begin;
              ret.replacements = [{ value: msg.fix.text }];
            }
            return ret;
          });

          korrect.getKorrectArea(textRef.current).updateCorrections(corrections);
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

  const handleLintErrorClose: AlertProps['onClose'] = () => setIsLintErrorOpen(false);

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
    dispatchMemo();
    setIsTextContainerFocus(false);
  };

  const handleTextContainerFocus: React.FocusEventHandler = () => setIsTextContainerFocus(true);

  let corrections = [];
  if (korrect) {
    corrections = korrect.getKorrectArea(textRef.current).getCorrections();
  }

  return (
    <EditContainer maxWidth="md">
      <Paper>
        <Box pb={2} pt={2}>
          <Container>
            <Chip
              clickable
              component="a"
              href="https://github.com/blue-hood/kohsei-san#校正偏差値"
              label={`校正偏差値 ${isDisplayResult ? Math.round(deviation) : '??'}`}
              rel="noopener"
              size="small"
              target="_blank"
            />

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
                      // https://github.com/w3c/editing/issues/162
                      // @ts-ignore
                      contentEditable="plaintext-only"
                      onBlur={handleTextContainerBlur}
                      onFocus={handleTextContainerFocus}
                      ref={textRef}
                    />
                  </Typography>


                </div>
              )}
            </Box>

            {isDisplayResult &&
              ((corrections.length === 0 && (
                <Alert severity="success">校正を通過しました。おめでとうございます！</Alert>
              )) || (
                <Alert severity="info">
                  <div>自動校正によるメッセージがあります。</div>
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
