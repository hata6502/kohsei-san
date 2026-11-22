import React, { useEffect, useRef, useState } from "react";
import type {
  Dispatch,
  ChangeEventHandler,
  MouseEvent,
  ReactEventHandler,
  SetStateAction,
} from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import Popover from "@mui/material/Popover";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import type { MemoFragment } from "../../App";
import type {
  ProofreadingMessage,
  ProofreadingMessageFix,
} from "../../lintWorker";
import { diffProofreadingResult } from "../../useMemo";
import type { Memo, MemosAction } from "../../useMemo";
import { PinIcon } from "./PinIcon";

interface LintMessage {
  index: ProofreadingMessage["index"];
  messages: ProofreadingMessage[];
}

interface Pin {
  top: React.CSSProperties["top"];
  left: React.CSSProperties["left"];
  message: LintMessage;
}

const MirrorTextarea = styled("div")({
  position: "absolute",
  top: 0,
  left: 0,
  visibility: "hidden",
  boxSizing: "border-box",
  fontWeight: 400,
  padding: "16px 14px",
  width: "100%",
  lineHeight: "23px",
  whiteSpace: "pre-wrap",
  wordBreak: "break-all",
});

const MessagePopover = styled(Popover)({
  wordBreak: "break-word",
});

const PinTarget = styled("button")(({ theme }) => ({
  padding: theme.spacing(1),
  position: "absolute",
  transform: "translate(-8px, calc(-100% + 8px))",
  background: "none",
  border: "none",
  cursor: "pointer",
}));

export const TextContainer: React.FunctionComponent<{
  dispatchIsLinting: React.Dispatch<boolean>;
  dispatchIsTextContainerFocused: Dispatch<SetStateAction<boolean>>;
  dispatchMemoFragment: Dispatch<SetStateAction<MemoFragment>>;
  dispatchMemos: React.Dispatch<MemosAction>;
  isTextContainerFocused: boolean;
  memo: Memo;
}> = ({
  dispatchIsLinting,
  dispatchIsTextContainerFocused,
  dispatchMemoFragment,
  dispatchMemos,
  isTextContainerFocused,
  memo,
}) => {
  const [draftText, setDraftText] = useState(memo.text);
  const [pins, setPins] = useState<Pin[]>([]);

  const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLElement | null>(
    null,
  );
  const [popoverMessages, setPopoverMessages] = useState<
    LintMessage["messages"]
  >([]);

  const boxRef = useRef<HTMLDivElement | null>(null);
  const mirrorTextareaRef = useRef<HTMLDivElement | null>(null);
  const textFieldRef = useRef<HTMLTextAreaElement | null>(null);

  const memoID = memo.id;
  const dispatchText = (action?: (prevText: string) => string) => {
    dispatchMemos((prevMemos) => {
      if (!textFieldRef.current) {
        throw new Error("textFieldRef.current is not defined");
      }

      const memoIndex = prevMemos.findIndex(
        (prevMemo) => prevMemo.id === memoID,
      );
      const prevMemo = prevMemos[memoIndex];

      const text = action ? action(prevMemo.text) : textFieldRef.current.value;
      const memos = [...prevMemos];
      memos.splice(memoIndex, 1);
      memos.unshift({
        ...prevMemo,
        result: diffProofreadingResult({
          result: prevMemo.result,
          prevText: prevMemo.text,
          text,
        }),
        text,
        updatedAt: new Date().toISOString(),
      });

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
    setDraftText(memo.text);
  }, [memo.text]);

  useEffect(() => {
    if (!memo.result) {
      return;
    }

    try {
      if (!boxRef.current || !mirrorTextareaRef.current) {
        throw new Error();
      }
      const box = boxRef.current;
      const mirrorTextarea = mirrorTextareaRef.current;

      const mergedMessages: LintMessage[] = [];

      memo.result.messages.forEach((message) => {
        const duplicatedMessage = mergedMessages.find(
          ({ index }) => index === message.index,
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
        box,
        mirrorTextarea,
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

  const handleTextFieldBlur = () => {
    dispatchIsTextContainerFocused(false);
    dispatchText();
  };

  const handleTextFieldChange: ChangeEventHandler<HTMLTextAreaElement> = (
    event,
  ) => {
    setDraftText(event.target.value);
  };

  const handleTextFieldFocus = () => {
    dispatchIsTextContainerFocused(true);
  };

  const handleTextFieldSelect: ReactEventHandler = (event) => {
    if (!(event.target instanceof HTMLTextAreaElement)) {
      throw new Error("Expected a textarea for memo selection");
    }

    dispatchMemoFragment({
      selectionStart: event.target.selectionStart,
      selectionEnd: event.target.selectionEnd,
    });
  };

  return (
    <>
      <Box ref={boxRef} position="relative" mt={1}>
        <TextField
          inputRef={textFieldRef}
          fullWidth
          multiline
          value={draftText}
          placeholder="メモを入力"
          aria-label="校正する文章"
          onBlur={handleTextFieldBlur}
          onChange={handleTextFieldChange}
          onFocus={handleTextFieldFocus}
          onSelect={handleTextFieldSelect}
          slotProps={{ input: { sx: { fontWeight: 400 } } }}
        />

        <MirrorTextarea ref={mirrorTextareaRef} aria-hidden>
          {draftText}
        </MirrorTextarea>

        {!isTextContainerFocused &&
          pins.map(({ top, left, message }) => {
            const severity = Math.max(
              ...message.messages.map((message) => message.severity),
            );

            return (
              <PinTarget
                key={message.index}
                type="button"
                onClick={(event) => handlePinClick(event, message.messages)}
                aria-label={`「${memo.text.slice(message.index, message.index + 10)}……」に対する見直しの詳細を開く`}
                role="alert"
                style={{ top, left }}
              >
                <PinIcon severity={severity} />
              </PinTarget>
            );
          })}
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

const getPins = ({
  lintMessages,
  box,
  mirrorTextarea,
}: {
  lintMessages: LintMessage[];
  box: HTMLDivElement;
  mirrorTextarea: HTMLDivElement;
}) => {
  const range = document.createRange();
  const boxRect = box.getBoundingClientRect();

  const textNode = mirrorTextarea.firstChild;
  if (!(textNode instanceof Text)) {
    return { reject: new Error("text.firstChild is not Text") };
  }

  const pins: Pin[] = [];
  for (const lintMessage of lintMessages) {
    if (lintMessage.index > textNode.length) {
      return { reject: new Error("lintMessage.index > textNode.length") };
    }

    range.setStart(textNode, lintMessage.index);
    const rangeRect = range.getBoundingClientRect();

    pins.push({
      top: rangeRect.top - boxRect.top,
      left: rangeRect.left - boxRect.left,
      message: lintMessage,
    });
  }

  return { resolve: pins };
};
