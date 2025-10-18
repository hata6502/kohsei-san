import React, {
  type HTMLAttributes,
  type RefAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import Popover from "@mui/material/Popover";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import Alert from "@mui/material/Alert";
import type {
  TextlintMessage,
  TextlintRuleSeverityLevel,
} from "@textlint/kernel";
import type { Memo, MemosAction } from "../../useMemo";
import { PinIcon } from "./PinIcon";

const removeExtraNewLine = (text: string) => (text === "\n" ? "" : text);

const MessagePopover = styled(Popover)`
  word-break: break-all;
`;

type PinTargetProps = HTMLAttributes<HTMLDivElement>;

const PinTarget = styled.div<PinTargetProps>`
  cursor: pointer;
  padding: 8px;
  position: absolute;
  transform: translateY(-100%);
`;

type ContentProps = HTMLAttributes<HTMLDivElement> &
  RefAttributes<HTMLDivElement>;

const Content = styled.div<ContentProps>`
  ${({ theme }) => `
    padding: ${theme.spacing(2)};
    &:empty::before {
      content: '校正する文章を入力';
      color: ${theme.palette.text.disabled};
    }
  `}
  outline: 0;
  word-break: break-all;
`;

interface LintMessage {
  index: TextlintMessage["index"];
  messages: TextlintMessage[];
}

interface Pin {
  left: React.CSSProperties["left"];
  message: LintMessage;
  top: React.CSSProperties["top"];
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

    for (
      childNodesIndex = 0;
      childNodesIndex < text.childNodes.length;
      childNodesIndex += 1
    ) {
      const child = text.childNodes[childNodesIndex];
      const length =
        (child instanceof HTMLBRElement && 1) ||
        (child instanceof Text && child.length);

      if (typeof length !== "number") {
        return { reject: new Error("child.length is not defined") };
      }

      if (offset < length) {
        range.setStart(child, offset);

        break;
      }

      offset -= length;
    }

    if (childNodesIndex >= text.childNodes.length) {
      return { reject: new Error("childNodesIndex >= text.childNodes.length") };
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
    const [popoverMessages, setPopoverMessages] = useState<
      LintMessage["messages"]
    >([]);

    const textRef = useRef<HTMLDivElement>(null);
    const textBoxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const dispatchText = () =>
        dispatchMemos((prevMemos) =>
          prevMemos.map((prevMemo) => {
            if (!textRef.current) {
              throw new Error("textRef.current is not defined");
            }

            return {
              ...prevMemo,
              ...(prevMemo.id === memo.id && {
                text: removeExtraNewLine(textRef.current.innerText),
              }),
            };
          })
        );

      window.addEventListener("beforeunload", dispatchText);

      return () => window.removeEventListener("beforeunload", dispatchText);
    }, [dispatchMemos, memo.id]);

    useEffect(() => {
      // Undo できるようにする。
      if (!textRef.current || textRef.current.innerText === memo.text) {
        return;
      }

      textRef.current.innerText = memo.text;
    }, [memo.text]);

    useEffect(() => {
      if (!textRef.current) {
        return;
      }

      textRef.current.setAttribute("contentEditable", "plaintext-only");
    }, []);

    useEffect(() => {
      if (!memo.result) {
        return;
      }

      if (!textRef.current || !textBoxRef.current) {
        return;
      }

      try {
        const mergedMessages: LintMessage[] = [];

        memo.result.messages.forEach((message) => {
          const duplicatedMessage = mergedMessages.find(
            ({ index }) => index === message.index
          );

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
        }

        setPins(getPinsResult.resolve);
      } finally {
        dispatchIsLinting(false);
      }
    }, [dispatchIsLinting, memo.result, memo.text]);

    const isPopoverOpen = Boolean(popoverAnchorEl);

    const handleFixClick = useCallback(
      ({ message }: { message: TextlintMessage }) => {
        if (!message.fix) {
          throw new Error("message.fix is not defined");
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
        messages: LintMessage["messages"];
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
            throw new Error("textRef.current is not defined");
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
          borderColor={isTextContainerFocused ? "primary.main" : "grey.500"}
          borderRadius={1}
          component="div"
          m={isTextContainerFocused ? 0 : "1px"}
          position="relative"
          ref={textBoxRef}
        >
          <Typography component="div" variant="body1">
            <Content
              contentEditable
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
                    onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                      const { currentTarget } = event;

                      handlePinClick({
                        currentTarget,
                        messages: message.messages,
                      });
                    }}
                  >
                    <PinIcon severity={severity} />
                  </PinTarget>
              );
            })}

          <MessagePopover
            anchorEl={popoverAnchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            onClose={handlePopoverClose}
            open={isPopoverOpen}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "left",
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
                          <IconButton edge="end" onClick={() => handleFixClick({ message })} size="large">
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
        </Box>
        {shouldDisplayResult &&
          memo.text &&
          memo.result?.messages.length === 0 && (
            <Box mt={1}>
              <Alert severity="success">
                お疲れさまでした！エラーはありません
              </Alert>
            </Box>
          )}
      </Box>
    );
  }
);

export { TextContainer };
