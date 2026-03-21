import React, { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { styled } from "@mui/material/styles";
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
import type { TextlintRuleSeverityLevel } from "@textlint/kernel";
import { diffChars } from "diff";
import type {
  ProofreadingMessage,
  ProofreadingMessageFix,
  ProofreadingResult,
} from "../../lintWorker";
import type {
  Memo,
  MemosAction,
} from "../../useMemo";
import { PinIcon } from "./PinIcon";

interface LintMessage {
  index: ProofreadingMessage["index"];
  messages: ProofreadingMessage[];
}

interface Pin {
  left: React.CSSProperties["left"];
  message: LintMessage;
  top: React.CSSProperties["top"];
}

const Content = styled("div")(({ theme }) => ({
  outline: 0,
  padding: theme.spacing(2),
  wordBreak: "break-all",
}));

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

export const TextContainer: React.FunctionComponent<{
  dispatchIsLinting: React.Dispatch<boolean>;
  dispatchMemos: React.Dispatch<MemosAction>;
  memo: Memo;
}> = ({ dispatchIsLinting, dispatchMemos, memo }) => {
  const [isTextContainerFocused, setIsTextContainerFocused] = useState(false);
  const [pins, setPins] = useState<Pin[]>([]);

  const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLElement | null>(
    null,
  );
  const [popoverMessages, setPopoverMessages] = useState<
    LintMessage["messages"]
  >([]);

  const textRef = useRef<HTMLDivElement | null>(null);
  const textBoxRef = useRef<HTMLDivElement | null>(null);

  const memoID = memo.id;
  const dispatchText = (action?: (prevText: string) => string) => {
    dispatchMemos((prevMemos) => {
      if (!textRef.current) {
        throw new Error("textRef.current is not defined");
      }

      const memoIndex = prevMemos.findIndex(
        (prevMemo) => prevMemo.id === memoID,
      );
      const prevMemo = prevMemos[memoIndex];

      const text = action
        ? action(prevMemo.text)
        : removeExtraNewLine(textRef.current.innerText);
      const memo = {
        ...prevMemo,
        result: diffResult({
          result: prevMemo.result,
          prevText: prevMemo.text,
          text,
        }),
        text,
      };

      const memos = [...prevMemos];
      memos.splice(memoIndex, 1);
      memos.unshift(memo);

      return memos;
    });
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      dispatchText();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [dispatchText]);

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
        throw new Error("textRef.current or textBoxRef.current is not defined");
      }

      const mergedMessages: LintMessage[] = [];

      memo.result.messages.forEach((message) => {
        const duplicatedMessage = mergedMessages.find(
          ({ index }) => index === message.index,
        );

        if (duplicatedMessage) {
          duplicatedMessage.messages.push(message);
        } else {
          mergedMessages.push({
            index: message.index,
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

  const handleFixClick = ({ message }: { message: ProofreadingMessage }) => {
    dispatchText((prevText) => {
      if (!message.fix) {
        throw new Error("message.fix is not defined");
      }

      return `${prevText.slice(0, message.fix.range[0])}${message.fix.text}${prevText.slice(message.fix.range[1])}`;
    });

    setPopoverAnchorEl(null);
  };

  const handlePinClick = (
    event: MouseEvent<HTMLElement>,
    messages: LintMessage["messages"],
  ) => {
    setPopoverAnchorEl(event.currentTarget);
    setPopoverMessages(messages);
  };

  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
  };

  const handleTextContainerBlur = () => {
    setIsTextContainerFocused(false);
    dispatchText();
  };

  const handleTextContainerFocus = () => {
    setIsTextContainerFocused(true);
  };

  return (
    <>
      {!memo.text ? (
        <Alert key="waiting" severity="info">
          校正する文章を入力してください
        </Alert>
      ) : !memo.result ? undefined : memo.result.messages.length ? (
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
          sx={{
            position: "relative",
            borderRadius: 1,
            outlineColor: isTextContainerFocused ? "primary.main" : "grey.500",
            outlineStyle: "solid",
            outlineWidth: isTextContainerFocused ? 2 : 1,
          }}
        >
          <Typography component="div" variant="body1">
            <Content
              contentEditable="plaintext-only"
              onBlur={handleTextContainerBlur}
              onFocus={handleTextContainerFocus}
              ref={textRef}
            />
          </Typography>

          {!isTextContainerFocused &&
            pins.map(({ left, message, top }) => {
              const severity = Math.max(
                ...message.messages.map((message) => message.severity),
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
            {popoverMessages.map((message, index) => {
              const fixPreview = message.fix
                ? getFixPreview({ fix: message.fix, text: memo.text })
                : undefined;

              return (
                <ListItem key={index}>
                  <ListItemText
                    primary={message.message}
                    secondary={
                      fixPreview && (
                        <Box
                          component="span"
                          sx={{ display: "block", mt: 0.5 }}
                        >
                          <Typography
                            color="text.secondary"
                            component="div"
                            variant="caption"
                          >
                            修正前: {fixPreview.beforeText}
                          </Typography>
                          <Typography
                            color="text.secondary"
                            component="div"
                            variant="caption"
                          >
                            修正後: {fixPreview.afterText}
                          </Typography>
                        </Box>
                      )
                    }
                    secondaryTypographyProps={{ component: "div" }}
                  />

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
              );
            })}
          </List>
        </Container>
      </MessagePopover>
    </>
  );
};

const removeExtraNewLine = (text: string) => (text === "\n" ? "" : text);

const getFixPreview = ({
  fix,
  text,
}: {
  fix: ProofreadingMessageFix;
  text: string;
}) => ({
  afterText: fix.text || "（なし）",
  beforeText: text.slice(fix.range[0], fix.range[1]) || "（なし）",
});

const diffResult = ({
  result,
  prevText,
  text,
}: {
  result?: ProofreadingResult;
  prevText: string;
  text: string;
}) => {
  if (!result) {
    return;
  }

  const diff = diffChars(prevText, text);

  return {
    messages: result.messages.flatMap((message): ProofreadingMessage[] => {
      let offset = 0;
      let textIndex = 0;
      for (const part of diff) {
        const intersected =
          message.index + offset >= textIndex &&
          message.index + offset < textIndex + part.value.length;

        if (part.added) {
          offset += part.value.length;
          textIndex += part.value.length;
        } else if (part.removed) {
          if (intersected) {
            return [];
          }

          offset -= part.value.length;
        } else {
          if (intersected) {
            break;
          }

          textIndex += part.value.length;
        }
      }

      const shiftedMessage: ProofreadingMessage = {
        index: message.index + offset,
        message: message.message,
        ruleId: message.ruleId,
        severity: message.severity,
        ...(message.fix && {
          fix: {
            range: [
              message.fix.range[0] + offset,
              message.fix.range[1] + offset,
            ] as ProofreadingMessageFix["range"],
            text: message.fix.text,
          },
        }),
      };

      return [
        shiftedMessage,
      ];
    }),
  };
};

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
