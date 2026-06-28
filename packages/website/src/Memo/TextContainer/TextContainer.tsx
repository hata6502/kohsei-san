import React, { useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { styled } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Popover from "@mui/material/Popover";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import { diffChars } from "diff";
import type { ProofreadingMessage, ProofreadingResult } from "../../lintWorker";
import type { Memo, MemosAction } from "../../useMemo";
import { getLintMessages } from "../proofreadingMessages";
import type { LintMessage } from "../proofreadingMessages";
import { PinIcon } from "./PinIcon";

interface Pin {
  left: React.CSSProperties["left"];
  message: LintMessage;
  top: React.CSSProperties["top"];
}

const textContentStyle = ({ theme }: { theme: Theme }) => ({
  boxSizing: "border-box" as const,
  font: "inherit",
  fontWeight: 400,
  lineHeight: "inherit",
  padding: theme.spacing(2),
  whiteSpace: "pre-wrap" as const,
  width: "100%",
  wordBreak: "break-all" as const,
});

const Content = styled(TextareaAutosize)(({ theme }) => ({
  ...textContentStyle({ theme }),
  background: "transparent",
  border: 0,
  color: "inherit",
  display: "block",
  outline: 0,
  overflow: "hidden",
  resize: "none",
}));

const Mirror = styled("div")(({ theme }) => ({
  ...textContentStyle({ theme }),
  inset: 0,
  pointerEvents: "none",
  position: "absolute",
  visibility: "hidden",
}));

const MirrorMarker = styled("span")({
  display: "inline-block",
  height: "1em",
  verticalAlign: "top",
  width: 0,
});

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
  proofreadingPopoverIndex: ProofreadingMessage["index"] | null;
  onProofreadingPopoverOpen: () => void;
}> = ({
  dispatchIsLinting,
  dispatchMemos,
  memo,
  proofreadingPopoverIndex,
  onProofreadingPopoverOpen,
}) => {
  const [isTextContainerFocused, setIsTextContainerFocused] = useState(false);
  const [draftText, setDraftText] = useState(memo.text);
  const [pins, setPins] = useState<Pin[]>([]);

  const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLElement | null>(
    null,
  );
  const [popoverMessages, setPopoverMessages] = useState<
    LintMessage["messages"]
  >([]);

  const textRef = useRef<HTMLTextAreaElement | null>(null);
  const textBoxRef = useRef<HTMLDivElement | null>(null);
  const mirrorRef = useRef<HTMLDivElement | null>(null);
  const pinTargetsRef = useRef(
    new Map<ProofreadingMessage["index"], HTMLButtonElement>(),
  );

  const lintMessages = useMemo(
    () => getLintMessages(memo.result?.messages ?? []),
    [memo.result?.messages],
  );

  const memoID = memo.id;
  const dispatchText = (action?: (prevText: string) => string) => {
    dispatchMemos((prevMemos) => {
      const memoIndex = prevMemos.findIndex(
        (prevMemo) => prevMemo.id === memoID,
      );
      if (memoIndex < 0) {
        return prevMemos;
      }

      const prevMemo = prevMemos[memoIndex];

      const text = action
        ? action(prevMemo.text)
        : removeExtraNewLine(textRef.current?.value ?? draftText);
      const memo = {
        ...prevMemo,
        result: diffResult({
          result: prevMemo.result,
          prevText: prevMemo.text,
          text,
        }),
        text,
        updatedAt: new Date().toISOString(),
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
    setDraftText(memo.text);
  }, [memo.text]);

  useEffect(() => {
    if (!memo.result) {
      setPins([]);
      return;
    }

    try {
      if (!mirrorRef.current || !textBoxRef.current) {
        throw new Error(
          "mirrorRef.current or textBoxRef.current is not defined",
        );
      }

      const getPinsResult = getPins({
        lintMessages,
        mirror: mirrorRef.current,
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
  }, [dispatchIsLinting, lintMessages, memo.result, memo.text]);

  const isPopoverOpen = Boolean(popoverAnchorEl);

  useEffect(() => {
    if (proofreadingPopoverIndex === null || isTextContainerFocused) {
      return;
    }

    const pin = pins.find(
      ({ message }) => message.index === proofreadingPopoverIndex,
    );
    const anchorEl = pinTargetsRef.current.get(proofreadingPopoverIndex);
    if (!pin || !anchorEl) {
      return;
    }

    anchorEl.scrollIntoView({
      block: "center",
      inline: "nearest",
    });

    requestAnimationFrame(() => {
      setPopoverAnchorEl(anchorEl);
      setPopoverMessages(pin.message.messages);
      onProofreadingPopoverOpen();
    });
  }, [
    isTextContainerFocused,
    onProofreadingPopoverOpen,
    pins,
    proofreadingPopoverIndex,
  ]);

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

  const handleTextContainerChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setDraftText(event.target.value);
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
              aria-label="校正する文章"
              minRows={1}
              onBlur={handleTextContainerBlur}
              onChange={handleTextContainerChange}
              onFocus={handleTextContainerFocus}
              ref={(element: Element | null) => {
                textRef.current =
                  element instanceof HTMLTextAreaElement ? element : null;
              }}
              value={draftText}
            />

            <Mirror ref={mirrorRef} aria-hidden>
              {getMirrorContent({ lintMessages, text: memo.text })}
            </Mirror>
          </Typography>

          {!isTextContainerFocused &&
            pins.map(({ left, message, top }) => {
              const severity = Math.max(
                ...message.messages.map((message) => message.severity),
              );

              return (
                <PinTarget
                  key={message.index}
                  type="button"
                  ref={(element) => {
                    if (element) {
                      pinTargetsRef.current.set(message.index, element);
                    } else {
                      pinTargetsRef.current.delete(message.index);
                    }
                  }}
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
              return (
                <ListItem key={index}>
                  <ProofreadingMessageDetail
                    message={message}
                    onFix={handleFixClick}
                  />
                </ListItem>
              );
            })}
          </List>
        </Container>
      </MessagePopover>
    </>
  );
};

const ProofreadingMessageDetail: React.FunctionComponent<{
  message: ProofreadingMessage;
  onFix: ({ message }: { message: ProofreadingMessage }) => void;
}> = ({ message, onFix }) => {
  const handleFixButtonClick = () => {
    onFix({ message });
  };

  return (
    <Box
      sx={{
        alignItems: "start",
        display: "grid",
        gap: 1,
        gridTemplateColumns: "1fr auto",
        width: "100%",
      }}
    >
      <ListItemText
        primary={message.message}
        secondaryTypographyProps={{ component: "div" }}
      />

      {message.fix && (
        <Tooltip title="自動修正">
          <IconButton edge="end" onClick={handleFixButtonClick}>
            <SpellcheckIcon />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

const removeExtraNewLine = (text: string) => (text === "\n" ? "" : text);

const getMirrorContent = ({
  lintMessages,
  text,
}: {
  lintMessages: LintMessage[];
  text: string;
}) => {
  const children: React.ReactNode[] = [];
  let offset = 0;

  lintMessages.forEach((lintMessage) => {
    const index = Math.min(Math.max(lintMessage.index, 0), text.length);
    children.push(text.slice(offset, index));
    children.push(
      <MirrorMarker
        data-lint-message-index={lintMessage.index}
        key={lintMessage.index}
      />,
    );
    offset = index;
  });

  children.push(text.slice(offset), " ");

  return children;
};

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
    ...result,
    messages: result.messages.flatMap((message): ProofreadingMessage[] => {
      let offset = 0;
      let textIndex = 0;
      for (const part of diff) {
        const [start, end] = message.fix?.range ?? [
          message.index,
          message.index,
        ];

        if (textIndex >= end + offset) {
          break;
        }

        if (part.added) {
          offset += part.value.length;
          textIndex += part.value.length;
        } else if (part.removed) {
          if (
            textIndex < end + offset &&
            start + offset < textIndex + part.value.length
          ) {
            return [];
          }

          offset -= part.value.length;
        } else {
          textIndex += part.value.length;
        }
      }

      return [
        {
          ...message,
          index: message.index + offset,
          ...(message.fix && {
            fix: {
              ...message.fix,
              range: [
                message.fix.range[0] + offset,
                message.fix.range[1] + offset,
              ],
            },
          }),
        },
      ];
    }),
  };
};

const getPins = ({
  lintMessages,
  mirror,
  textBoxRect,
}: {
  lintMessages: LintMessage[];
  mirror: HTMLDivElement;
  textBoxRect: DOMRect;
}) => {
  const pins: Pin[] = [];

  for (const lintMessage of lintMessages) {
    const marker = mirror.querySelector(
      `[data-lint-message-index="${lintMessage.index}"]`,
    );
    if (!marker) {
      return {
        reject: new Error(`marker not found: ${lintMessage.index}`),
      };
    }

    const markerRect = marker.getBoundingClientRect();

    pins.push({
      left: markerRect.left - textBoxRect.left - 8,
      message: lintMessage,
      top: markerRect.top - textBoxRect.top + 8,
    });
  }

  return { resolve: pins };
};
