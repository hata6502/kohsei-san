import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import type {
  LintWorkerLintMessage,
  LintWorkerResultMessage,
} from "../lintWorker";
import type { Memo, MemosAction } from "../useMemo";
import { TextContainer } from "./TextContainer";

const lintingTimeoutLimitMS = 10000;

export const Edit: React.FunctionComponent<{
  dispatchIsLinting: React.Dispatch<boolean>;
  dispatchIsLintingHeavy: React.Dispatch<boolean>;
  dispatchMemos: React.Dispatch<MemosAction>;
  isLinting: boolean;
  lintWorker: Worker;
  memo: Memo;
  memos: Memo[];
}> = React.memo(
  ({
    dispatchIsLinting,
    dispatchIsLintingHeavy,
    dispatchMemos,
    isLinting,
    lintWorker,
    memo,
    memos,
  }) => {
    const [isTextContainerFocused, dispatchIsTextContainerFocused] =
      useState(false);

    useEffect(
      () => () => {
        dispatchIsLinting(false);
      },
      [dispatchIsLinting],
    );

    useEffect(() => {
      const userDictionaryMemo = memos.find(
        ({ id }) => id === memo.setting.lintOption.userDictionaryMemoId,
      );
      const professionalModeLintOption = {
        ...memo.setting.lintOption,
        jaSimpleUserDictionary: {
          dictionary:
            userDictionaryMemo?.text
              .trim()
              .split("\n")
              .slice(1)
              .join("\n")
              .split("\n\n")
              .flatMap((section) => {
                const lines = section.trim().split("\n");
                return lines[0]
                  ? [
                      {
                        pattern: lines[0],
                        message: lines.slice(1).join("\n").trim() || undefined,
                      },
                    ]
                  : [];
              }) ?? [],
        },
      };

      const message: LintWorkerLintMessage = {
        lintOption: {
          professional: professionalModeLintOption,
          standard: {},
        }[memo.setting.mode],
        text: memo.text,
      };

      lintWorker.postMessage(message);

      const lintingTimeoutID = setTimeout(
        () => dispatchIsLintingHeavy(true),
        lintingTimeoutLimitMS,
      );

      dispatchIsLinting(true);
      dispatchIsLintingHeavy(false);

      return () => clearTimeout(lintingTimeoutID);
    }, [
      dispatchIsLinting,
      dispatchIsLintingHeavy,
      dispatchMemos,
      lintWorker,
      memo.id,
      memo.setting.lintOption,
      memo.setting.mode,
      memo.text,
    ]);

    useEffect(() => {
      const handleLintWorkerError = () => {
        dispatchIsLinting(false);

        throw new Error();
      };

      const handleLintWorkerMessage = (
        event: MessageEvent<LintWorkerResultMessage>,
      ) => {
        if (event.data.text !== memo.text) {
          return;
        }

        dispatchMemos((prevMemos) =>
          prevMemos.map((prevMemo) =>
            prevMemo.id === memo.id
              ? {
                  ...prevMemo,
                  result: {
                    ...event.data.result,
                    messages: [
                      ...event.data.result.messages,
                      ...(prevMemo.result?.messages.filter(
                        (message) => message.ruleId === "ai",
                      ) ?? []),
                    ],
                  },
                }
              : prevMemo,
          ),
        );
      };

      lintWorker.addEventListener("error", handleLintWorkerError);
      lintWorker.addEventListener("message", handleLintWorkerMessage);

      return () => {
        lintWorker.removeEventListener("error", handleLintWorkerError);
        lintWorker.removeEventListener("message", handleLintWorkerMessage);
      };
    }, [dispatchIsLinting, dispatchMemos, lintWorker, memo.id, memo.text]);

    const shouldDisplayResult = !isTextContainerFocused && !isLinting;

    return (
      <Paper>
        <Box pb={2} pt={2}>
          <Container>
            <TextContainer
              dispatchIsLinting={dispatchIsLinting}
              dispatchIsTextContainerFocused={dispatchIsTextContainerFocused}
              dispatchMemos={dispatchMemos}
              isTextContainerFocused={isTextContainerFocused}
              memo={memo}
              shouldDisplayResult={shouldDisplayResult}
            />
          </Container>
        </Box>
      </Paper>
    );
  },
);
