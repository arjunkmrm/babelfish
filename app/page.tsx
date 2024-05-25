"use client";

import { useState } from "react"; // state management
import { useUIState, useActions } from "ai/rsc";
import { type AI } from "./action";
import { UserMessage } from "@/components/message";

export default function Page() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitMessage } = useActions();

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <div className="flex flex-col space-y-4 w-full max-w-2xl mb-16">
        {
          // View messages in UI state
          messages.map((message) => (
            <div key={message.id}>{message.display}</div>
          ))
        }
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          const value = inputValue.trim();

          // Add user message to UI state
          setMessages((currentMessages) => [
            ...currentMessages,
            {
              id: Date.now(),
              display: <UserMessage>{value}</UserMessage>,
            },
          ]);

          // Submit and get response message
          const responseMessage = await submitMessage(inputValue);
          setMessages((currentMessages) => [
            ...currentMessages,
            responseMessage,
          ]);

          setInputValue("");
        }}
        className="fixed bottom-0 w-full max-w-2xl p-4 bg-white"
      >
        <div className="flex">
          <input
            placeholder="Send a message... (e.g. What is the weather in SF?)"
            value={inputValue}
            onChange={(event) => {
              setInputValue(event.target.value);
            }}
            className="border border-border rounded-md p-2 w-full focus:outline-none"
          />
        </div>
      </form>
    </div>
  );
}