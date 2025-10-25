import React, { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
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

const Content = styled("div")(({ theme }) => ({
  outline: 0,
  padding: theme.spacing(2),
  wordBreak: "break-all",
}));

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

const MessagePopover = styled(Popover)({
  wordBreak: "break-word",
});

const PinTarget = styled("button")(({ theme }) => ({
  padding: theme.spacing(1),
  position: "absolute",
  transform: "translateY(-100%)",
  background: "none",
  border: "none",
  cursor: "pointer",
}));

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

    const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLElement | null>(
      null
    );
    const [popoverMessages, setPopoverMessages] = useState<
      LintMessage["messages"]
    >([]);

    const textRef = useRef<HTMLDivElement | null>(null);
    const textBoxRef = useRef<HTMLDivElement | null>(null);

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
      if (!memo.result) {
        return;
      }

      try {
        if (!textRef.current || !textBoxRef.current) {
          throw new Error(
            "textRef.current or textBoxRef.current is not defined"
          );
        }

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

        setPopoverAnchorEl(null);
      },
      [dispatchMemos, memo.id, setPopoverAnchorEl]
    );

    const handlePinClick = useCallback(
      (event: MouseEvent<HTMLElement>, messages: LintMessage["messages"]) => {
        setPopoverAnchorEl(event.currentTarget);
        setPopoverMessages(messages);
      },
      []
    );

    const handlePopoverClose = useCallback(() => setPopoverAnchorEl(null), []);

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
      <>
        {!shouldDisplayResult || !memo.result || !memo.text ? (
          <Alert key="waiting" severity="info">
            校正する文章を入力してください
          </Alert>
        ) : memo.result.messages.length ? (
          <Alert key="message" severity="info">
            {memo.result.messages.length}件の見直し箇所があります
          </Alert>
        ) : (
          <Alert key="success" severity="success">
            お疲れさまでした！見直し箇所はありません
          </Alert>
        )}

        <Box mt={1}>
          <Box
            ref={textBoxRef}
            border={isTextContainerFocused ? 2 : 1}
            borderColor={isTextContainerFocused ? "primary.main" : "grey.500"}
            borderRadius="4px"
            m={isTextContainerFocused ? 0 : "1px"}
            position="relative"
          >
            <Typography component="div" variant="body1">
              <Content
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
                    type="button"
                    onClick={(event) => handlePinClick(event, message.messages)}
                    aria-label={`「${memo.text.slice(message.index, message.index + 10)}……」に対する見直しの詳細を開く`}
                    role="alert"
                    style={{ left, top }}
                  >
                    <PinIcon severity={severity} />
                  </PinTarget>
                );
              })}
          </Box>
        </Box>

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
      </>
    );
  }
);

export { TextContainer };
