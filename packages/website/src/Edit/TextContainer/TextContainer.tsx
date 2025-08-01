import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Popover from '@material-ui/core/Popover';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import SpellcheckIcon from '@material-ui/icons/Spellcheck';
import type { TextlintMessage, TextlintRuleSeverityLevel } from '@textlint/kernel';
import type { Memo, MemosAction } from '../../useMemo';
import { PinIcon } from './PinIcon';

const removeExtraNewLine = (text: string) => (text === '\n' ? '' : text);

const MessagePopover = styled(Popover)`
  word-break: break-all;
`;

const PinTarget = styled.div`
  cursor: pointer;
  padding: 8px;
  position: absolute;
  transform: translateY(-100%);
`;

const Content = styled.div`
  ${({ theme }) => `
    padding: ${theme.spacing(2)}px;
    &:empty::before {
      content: '校正する文章を入力';
      color: ${theme.palette.text.disabled};
    }
  `}
  outline: 0;
  word-break: break-all;
`;

interface LintMessage {
  index: TextlintMessage['index'];
  messages: TextlintMessage[];
}

interface Pin {
  left: React.CSSProperties['left'];
  message: LintMessage;
  top: React.CSSProperties['top'];
}

const getPins = ({
  lintMessages,
  text,
  textBoxRect,
}: {
  lintMessages: LintMessage[];
  text: HTMLDivElement;
  textBoxRect: DOMRect;
}) => {
  const pins: Pin[] = [];
  const range = document.createRange();

  for (const lintMessage of lintMessages) {
    let childNodesIndex = 0;
    let offset = lintMessage.index;

    for (childNodesIndex = 0; childNodesIndex < text.childNodes.length; childNodesIndex += 1) {
      const child = text.childNodes[childNodesIndex];
      const length =
        (child instanceof HTMLBRElement && 1) || (child instanceof Text && child.length);

      if (typeof length !== 'number') {
        return { reject: new Error('child.length is not defined') };
      }

      if (offset < length) {
        range.setStart(child, offset);

        break;
      }

      offset -= length;
    }

    if (childNodesIndex >= text.childNodes.length) {
      return { reject: new Error('childNodesIndex >= text.childNodes.length') };
    }

    const rangeRect = range.getBoundingClientRect();

    pins.push({
      left: rangeRect.left - textBoxRect.left - 8,
      message: lintMessage,
      top: rangeRect.top - textBoxRect.top + 8,
    });
  }

  return { resolve: pins };
};

const TextContainer: React.FunctionComponent<{
  dispatchIsLinting: React.Dispatch<boolean>;
  dispatchIsTextContainerFocused: React.Dispatch<React.SetStateAction<boolean>>;
  dispatchMemos: React.Dispatch<MemosAction>;
  isTextContainerFocused: boolean;
  memo: Memo;
  shouldDisplayResult: boolean;
}> = React.memo(
  ({
    dispatchIsLinting,
    dispatchIsTextContainerFocused,
    dispatchMemos,
    isTextContainerFocused,
    memo,
    shouldDisplayResult,
  }) => {
    const [pins, setPins] = useState<Pin[]>([]);

    const [popoverAnchorEl, setPopoverAnchorEl] = useState<Element>();
    const [popoverMessages, setPopoverMessages] = useState<LintMessage['messages']>([]);

    const textRef = useRef<HTMLDivElement>(null);
    const textBoxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const dispatchText = () =>
        dispatchMemos((prevMemos) =>
          prevMemos.map((prevMemo) => {
            if (!textRef.current) {
              throw new Error('textRef.current is not defined');
            }

            return {
              ...prevMemo,
              ...(prevMemo.id === memo.id && {
                text: removeExtraNewLine(textRef.current.innerText),
              }),
            };
          })
        );

      window.addEventListener('beforeunload', dispatchText);

      return () => window.removeEventListener('beforeunload', dispatchText);
    }, [dispatchMemos, memo.id]);

    useEffect(() => {
      // Undo できるようにする。
      if (!textRef.current || textRef.current.innerText === memo.text) {
        return;
      }

      textRef.current.innerText = memo.text;
    }, [memo.text]);

    useEffect(() => {
      if (!memo.result) {
        return;
      }

      try {
        if (!textRef.current || !textBoxRef.current) {
          throw new Error('textRef.current or textBoxRef.current is not defined');
        }

        const mergedMessages: LintMessage[] = [];

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

        const getPinsResult = getPins({
          lintMessages: mergedMessages,
          text: textRef.current,
          textBoxRect: textBoxRef.current.getBoundingClientRect(),
        });

        if (getPinsResult.reject) {
          console.error(getPinsResult.reject);

          return;
        } else {
          setPins(getPinsResult.resolve);
        }
      } finally {
        dispatchIsLinting(false);
      }
    }, [dispatchIsLinting, memo.result, memo.text]);

    const isPopoverOpen = Boolean(popoverAnchorEl);

    const handleFixClick = useCallback(
      ({ message }: { message: TextlintMessage }) => {
        if (!message.fix) {
          throw new Error('message.fix is not defined');
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
      },
      [dispatchMemos, memo.id, setPopoverAnchorEl]
    );

    const handlePinClick = useCallback(
      ({
        currentTarget,
        messages,
      }: {
        currentTarget: Element;
        messages: LintMessage['messages'];
      }) => {
        setPopoverAnchorEl(currentTarget);
        setPopoverMessages(messages);
      },
      [setPopoverAnchorEl, setPopoverMessages]
    );

    const handlePopoverClose = useCallback(
      () => setPopoverAnchorEl(undefined),
      [setPopoverAnchorEl]
    );

    const handleTextContainerBlur = useCallback(() => {
      dispatchIsTextContainerFocused(false);

      dispatchMemos((prevMemos) =>
        prevMemos.map((prevMemo) => {
          if (!textRef.current) {
            throw new Error('textRef.current is not defined');
          }

          return {
            ...prevMemo,
            ...(prevMemo.id === memo.id && {
              result: undefined,
              text: removeExtraNewLine(textRef.current.innerText),
            }),
          };
        })
      );
    }, [dispatchIsTextContainerFocused, dispatchMemos, memo.id]);

    const handleTextContainerFocus = useCallback(
      () => dispatchIsTextContainerFocused(true),
      [dispatchIsTextContainerFocused]
    );

    return (
      <Box pb={2} pt={1}>
        <Box
          border={isTextContainerFocused ? 2 : 1}
          borderColor={isTextContainerFocused ? 'primary.main' : 'grey.500'}
          borderRadius="borderRadius"
          m={isTextContainerFocused ? 0 : '1px'}
          position="relative"
        >
          {(props: any) => (
            <div {...props} ref={textBoxRef}>
              <Typography component="div" variant="body1">
                <Content
                  // @ts-expect-error plaintext-only をサポートしたブラウザを利用している。
                  contentEditable="plaintext-only"
                  onBlur={handleTextContainerBlur}
                  onFocus={handleTextContainerFocus}
                  ref={textRef}
                />
              </Typography>

              {shouldDisplayResult &&
                pins.map(({ left, message, top }) => {
                  const severity = Math.max(
                    ...message.messages.map((message) => message.severity)
                  ) as TextlintRuleSeverityLevel;

                  return (
                    <PinTarget
                      key={message.index}
                      style={{ left, top }}
                      onClick={({ currentTarget }) => {
                        handlePinClick({ currentTarget, messages: message.messages });
                      }}
                    >
                      <PinIcon severity={severity} />
                    </PinTarget>
                  );
                })}

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
                              <IconButton edge="end" onClick={() => handleFixClick({ message })}>
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
      </Box>
    );
  }
);

export { TextContainer };
