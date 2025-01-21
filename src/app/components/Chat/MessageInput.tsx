"use client";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChatMessage } from "../../types/types"

type MessageInputProps = {
  t: any;
  sendChatMessage: (reply?: ChatMessage | null) => void;
  isConnected: boolean;
  value: string;
  setNewMessage: (value: string) => void;
  // For “Reply to”
  replyTo: ChatMessage | null;
  setReplyTo: (message: ChatMessage | null) => void;
};

const MessageInput = ({
  t,
  sendChatMessage,
  isConnected,
  value,
  setNewMessage,
  replyTo,
  setReplyTo,
}: MessageInputProps) => {
  // SHIFT+ENTER or normal “Enter” handling is up to you
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      if (value.trim() && isConnected) {
        sendChatMessage(replyTo); // pass “replyTo” here
        setNewMessage("");
        setReplyTo(null);
      }
    }
  };

  // On normal submit
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      sendChatMessage(replyTo);
      setNewMessage("");
      setReplyTo(null);
    }
  };

  return (
    <div className="relative w-full"> 
      {/* 1) The reply-to bar is absolutely positioned */}
      {replyTo && (
        <div className="absolute bottom-10 left-0 w-full bg-gray-200 p-1 px-2 text-sm text-gray-700 rounded flex items-center justify-between z-10">
          <div>
            {t("reply-to")}: {replyTo.sender_first_name}
            <span className="italic text-sm">
              {" "}
              - {replyTo.content.slice(0, 30)}…
            </span>
          </div>
          <button
            onClick={() => setReplyTo(null)}
            className="text-xs text-red-500"
          >
            {t("cancel")}
          </button>
        </div>
      )}

      {/* 2) Add top padding so the form doesn't overlap the reply bar */}
      <form
        onSubmit={handleSend}
        className={`flex items-center gap-2 w-full pt-${
          replyTo ? "10" : "0"
        }`} 
      >
        <Input
          placeholder={t("type-your-message-here")}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          value={value}
          className="w-full focus:outline-none"
        />
        <Button disabled={!isConnected || !value.trim()} type="submit">
          {t("send")}
        </Button>
      </form>
    </div>
  );
};

export default MessageInput;
