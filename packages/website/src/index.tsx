import Clarity from "@microsoft/clarity";
import React from "react";
import { createRoot } from "react-dom/client";
import GlobalStyles from "@mui/material/GlobalStyles";
import { StyledEngineProvider } from "@mui/material/styles";
import App from "./App";
import { ThemeProvider } from "./ThemeProvider";

const rootElement = document.querySelector(".app");
if (!rootElement) {
  throw new Error("Failed to find application root element.");
}
const root = createRoot(rootElement);

const renderFatalError = ({ message }: { message: React.ReactNode }) =>
  root.render(
    <>
      {message}
      <br />

      <a
        href="https://helpfeel.com/hata6502/?q=%E6%96%87%E7%AB%A0%E6%A0%A1%E6%AD%A3"
        rel="noreferrer"
        target="_blank"
      >
        ヘルプ
      </a>
    </>,
  );

const main = async () => {
  try {
    const registration =
      await navigator.serviceWorker.register("serviceWorker.js");

    registration.onupdatefound = () => {
      const installing = registration.installing;
      if (installing) {
        installing.onstatechange = () => {
          if (
            installing.state === "activated" &&
            // 古いService Workerが存在する場合
            navigator.serviceWorker.controller
          ) {
            location.reload();
          }
        };
      }
    };
  } catch (exception) {
    console.error(exception);
  }

  Clarity.init("sgagyas3lh");

  if (!window.Worker) {
    renderFatalError({
      message: "校正さんを使用するには、Web Worker を有効にしてください。",
    });

    return;
  }

  const lintWorker = new Worker("lintWorker.js");

  try {
    const localStorageTest = "localStorageTest";

    localStorage.setItem(localStorageTest, localStorageTest);
    localStorage.removeItem(localStorageTest);
  } catch (exception) {
    const unavailable =
      !(exception instanceof DOMException) ||
      (exception.code !== 22 &&
        exception.code !== 1014 &&
        exception.name !== "QuotaExceededError" &&
        exception.name !== "NS_ERROR_DOM_QUOTA_REACHED") ||
      !localStorage ||
      localStorage.length === 0;

    if (unavailable) {
      renderFatalError({
        message: "校正さんを使用するには、localStorage を有効にしてください。",
      });

      return;
    }
  }

  root.render(
    <StyledEngineProvider injectFirst>
      <ThemeProvider>
        <GlobalStyles
          styles={{
            ".grecaptcha-badge": {
              visibility: "hidden",
            },
          }}
        />

        <App lintWorker={lintWorker} />
      </ThemeProvider>
    </StyledEngineProvider>,
  );
};

await main();
