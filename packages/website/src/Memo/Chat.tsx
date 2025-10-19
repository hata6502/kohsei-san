import React from "react";
import type { FunctionComponent } from "react";
import { ChatKit, useChatKit } from "@openai/chatkit-react";

export const Chat: FunctionComponent = () => {
  const { control } = useChatKit({
    api: {
      getClientSecret: async (existing) => {
        if (existing) {
          // implement session refresh
        }

        const res = await fetch("/api/chatkit/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const { client_secret } = await res.json();
        return client_secret;
      },
    },
  });

  return <ChatKit control={control} style={{ height: 540 }} />;
};
