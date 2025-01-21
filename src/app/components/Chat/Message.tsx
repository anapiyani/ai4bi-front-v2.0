"use client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import React, { useState } from "react"
import { getCookie } from "../../api/service/cookie"
import Icons from "../Icons"

// Reuse your "Sender" and chat message interface as needed
type Sender = "bot" | "user" | string;

interface MessageProps {
  message: string;
  sender: Sender;
  t: (key: string) => string;
  timestamp: string;
  showSender: boolean;
  handleOpenDeleteMessage: (messageId: string) => void;
  messageId: string;

  // NEW: For replying
  handleReplyClick?: () => void;

  // Optionally show the snippet we’re replying to
  replyToMessage?: {
    sender: string;
    content: string;
  } | null;
}

const Message = ({
  message,
  sender,
  t,
  timestamp,
  showSender,
  handleOpenDeleteMessage,
  messageId,
  handleReplyClick,
  replyToMessage,
}: MessageProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user_role = getCookie("role");
  const isAdmin = user_role === "admin";
  const isOwner = sender === "user"; 

  const isBot = sender === "bot";
  const isUser = sender === "user";

  // Build context menu items
  const contextMenuItems = [
    {
      icon: Icons.Reply,
      label: t("reply"),
      show: true,
      action: () => {
        if (handleReplyClick) handleReplyClick()
      },
    },
    {
      icon: Icons.Forward,
      label: t("forward"),
      show: true,
      action: () => {},
    },
    {
      icon: Icons.Pin,
      label: t("pin"),
      show: isAdmin,
      action: () => {},
    },
    {
      icon: Icons.Edit,
      label: t("edit"),
      show: isOwner,
      action: () => {},
    },
    {
      icon: Icons.Delete,
      label: t("delete"),
      show: isAdmin || isOwner,
      action: () => {
        handleOpenDeleteMessage(messageId);
      },
    },
  ].filter((item) => item.show);

  const avatarText = React.useMemo(() => {
    if (isBot) {
      return t("aray-bot").slice(0, 2).toUpperCase();
    } else if (isUser) {
      return t("you").slice(0, 2).toUpperCase();
    } else if (typeof sender === "string") {
      const nameParts = sender.split(" ");
      const initials =
        nameParts.length >= 2
          ? `${nameParts[0][0]}${nameParts[1][0]}`
          : `${nameParts[0][0]}`;
      return initials.toUpperCase();
    }
    return "?";
  }, [sender, t, isBot, isUser]);

  const senderName = isBot ? t("aray-bot") : isUser ? t("you") : sender;

  const avatarClasses = `w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
    isBot ? "bg-primary text-white" : "bg-input text-secondary-foreground"
  }`;

  const messageClasses = `flex flex-col p-2 rounded-lg w-fit min-w-[100px] ${
    isBot
      ? "bg-gradient-to-r from-[#0284C7] to-[#77BAAA]"
      : isUser
      ? "bg-input ml-auto"
      : "bg-primary-foreground"
  }`;

  const textClasses = `text-sm font-normal px-2 text-start text-wrap break-words max-w-md ${
    isBot ? "text-white" : "text-secondary-foreground"
  }`;

  return (
    <div
      className={`flex flex-col gap-2 p-1 ${
        isUser ? "w-full flex justify-end" : ""
      } ${
        isMenuOpen
          ? "bg-[#0E749040] hover:bg-[#0E749040] transition-colors duration-200 rounded-lg"
          : "bg-transparent hover:bg-transparent transition-colors duration-200"
      }`}
    >
      {showSender && (
        <div className="flex items-center gap-2">
          {!isUser && <div className={avatarClasses}>{avatarText}</div>}
          <p
            className={`text-sm font-medium text-muted-foreground cursor-pointer ${
              isUser ? "ml-auto" : ""
            }`}
          >
            {senderName}
          </p>
          {isUser && <div className={avatarClasses + " w-0"} />}
        </div>
      )}

      <ContextMenu onOpenChange={(open) => setIsMenuOpen(open)}>
        <div className={messageClasses}>
          <ContextMenuTrigger>
            {replyToMessage && (
              <div className="mb-1 border-l-2 border-gray-300 pl-2 text-xs text-muted-foreground italic">
                {t("reply-to")}: {replyToMessage.sender} – “{replyToMessage.content.slice(0, 30)}…”
              </div>
            )}
            <p className={textClasses}>{message}</p>

            <div className="flex justify-end">
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                {timestamp} <Icons.Checks />
              </p>
            </div>
          </ContextMenuTrigger>
        </div>
        <ContextMenuContent className="bg-popover w-56 items-center justify-start gap-2 p-2">
          {contextMenuItems.map((item, index) => (
            <ContextMenuItem
              key={index}
              onClick={item.action}
              className="flex items-center justify-start gap-2"
            >
              <item.icon />
              {item.label}
            </ContextMenuItem>
          ))}
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
};

export default Message;
