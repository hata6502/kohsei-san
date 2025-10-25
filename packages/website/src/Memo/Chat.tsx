import React from "react";
import type { FunctionComponent } from "react";
import { ChatKit, useChatKit } from "@openai/chatkit-react";
import type { Memo } from "../useMemo";

export const Chat: FunctionComponent<{ memo: Memo }> = ({ memo }) => {
  const { control } = useChatKit({
    api: {
      getClientSecret: async () => {
        await new Promise<void>((resolve) =>
          grecaptcha.enterprise.ready(resolve)
        );
        const recaptchaToken = await grecaptcha.enterprise.execute(
          "6LeYs_YrAAAAAEUU58gmxMlJR0y9_qYB7YQ0FyIF",
          { action: "GET_CLIENT_SECRET" }
        );

        const response = await fetch(
          "https://chatkit-session-788918986145.us-central1.run.app/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              recaptchaToken,
              userID: memo.id,
            }),
          }
        );
        if (!response.ok) {
          throw new Error(
            `Failed to create session: ${response.status} ${response.statusText}`
          );
        }
        const { clientSecret } = await response.json();

        return clientSecret;
      },
    },
  });

  return <ChatKit control={control} style={{ height: 520 }} />;
};
