import type { ToolCallMessagePartComponent } from "@assistant-ui/react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import React, { useEffect, useState } from "react";
import type { ChangeEventHandler } from "react";

export const ReadAloud: ToolCallMessagePartComponent<
  Record<string, never>,
  { text: string }
> = ({ result, status, addResult }) => {
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null,
  );
  const [text, setText] = useState("");
  const active = result === undefined && status.type !== "incomplete";

  useEffect(() => {
    if (!active) return;
    return () => {
      if (recognition) {
        recognition.onresult = null;
        recognition.onend = null;
        recognition.onerror = null;
        recognition.abort();
      }
    };
  }, [active, recognition]);

  const handleStart = () => {
    const Recognition: typeof SpeechRecognition | undefined =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Recognition) {
      alert(
        "このブラウザでは音声認識を使えません。文字起こしのテキストファイルを選択してください。",
      );
      return;
    }

    const previousText = text;
    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.onresult = (event) => {
      setText(
        previousText +
          Array.from(event.results, (result) => result[0].transcript).join(""),
      );
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = (event) => {
      setListening(false);
      alert(`音声認識に失敗しました: ${event.error}`);
    };
    setRecognition(recognition);

    try {
      recognition.start();
      setListening(true);
    } catch (exception) {
      alert(`音声認識を開始できませんでした: ${String(exception)}`);
    }
  };

  const handleComplete = () => {
    if (listening) recognition?.stop();
    if (!text.trim()) {
      alert(
        "文字起こしがありません。読み上げるか、テキストファイルを選択してください。",
      );
      return;
    }
    addResult({ text });
  };

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = async (
    event,
  ) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    event.currentTarget.value = "";

    try {
      const fileText = await file.text();
      if (!fileText.trim()) {
        alert("選択したファイルに文字起こしがありません。");
        return;
      }
      if (listening) recognition?.stop();
      addResult({ text: fileText });
    } catch (exception) {
      alert(`テキストファイルを読み込めませんでした: ${String(exception)}`);
    }
  };

  if (!active) return null;

  return (
    <Paper
      role="region"
      aria-label="読み上げの文字起こし"
      elevation={6}
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        p: 1,
        pb: "max(8px, env(safe-area-inset-bottom))",
      }}
    >
      <Box role="group" aria-label="読み上げ" sx={{ display: "flex", gap: 1 }}>
        <Button onClick={handleStart} disabled={listening}>
          🎙️ 開始
        </Button>
        <Button onClick={handleComplete}>✅️ 完了</Button>
      </Box>
      <Box role="group" aria-label="ファイル入力" sx={{ ml: 3 }}>
        <Button component="label">
          📂 ファイル選択
          <input
            type="file"
            accept="text/plain"
            hidden
            onChange={handleFileChange}
          />
        </Button>
      </Box>
    </Paper>
  );
};
