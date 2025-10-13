import React, { useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
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
      [dispatchIsLinting]
    );

    useEffect(() => {
      if (!lintWorker || memo.result) {
        return;
      }

      const userDictionaryMemo = memos.find(
        ({ id }) => id === memo.setting.lintOption.userDictionaryMemoId
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
        lintingTimeoutLimitMS
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
      memo.result,
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
        event: MessageEvent<LintWorkerResultMessage>
      ) => {
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
  }
);
