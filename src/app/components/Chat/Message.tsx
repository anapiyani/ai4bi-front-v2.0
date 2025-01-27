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

type Sender = "bot" | "user" | string;

interface MessageProps {
  message: string;
  sender: Sender;
  t: (key: string) => string;
  sender_id: string | null;
  timestamp: string;
  showSender: boolean;
  handleOpenDeleteMessage: (messageId: string) => void;
  messageId: string;
  handleReplyClick?: () => void;
  handleEditClick?: () => void;
  reply_message_id: string | null;
  goToMessage: (messageId: string) => void;
  replyToMessage?: {
    sender: string;
    content: string;
  } | null;
  createPrivateChat: (userId: string) => void;
  isEdited: boolean;
  handlePin: (message_id: string) => void;
  handleUnpin: (message_id: string) => void;
  isPinned: boolean;
}

const Message = ({
  message,
  sender,
  t,
  sender_id,
  timestamp,
  showSender,
  handleOpenDeleteMessage,
  messageId,
  handleReplyClick,
  handleEditClick,
  reply_message_id,
  replyToMessage,
  goToMessage,
  isEdited,
  createPrivateChat,
  isPinned,
  handlePin,
  handleUnpin,
}: MessageProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user_role = getCookie("role");
  const isAdmin = user_role === "admin";
  const isOwner = sender === "user";

  const isBot = sender === "bot";
  const isUser = sender === "user";

  const contextMenuItems = [
    {
      icon: Icons.Reply,
      label: t("reply"),
      show: true,
      action: () => {
        handleReplyClick && handleReplyClick();
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
      show: isAdmin && !isPinned,
      action: () => {
        handlePin(messageId);
      },
    },
    {
      icon: Icons.UnPin,
      label: t("unpin"),
      show: isAdmin && isPinned,
      action: () => {
        handleUnpin(messageId);
      },
    },
    {
      icon: Icons.Edit,
      label: t("edit"),
      show: isOwner,
      action: () => {
        handleEditClick && handleEditClick();
      },
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
      return;
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

  const senderName = isBot ? t("aray-bot") : isUser ? '' : sender;

  const avatarClasses = `w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
    isBot ? "bg-primary text-white" : "bg-input text-secondary-foreground"
  }`;

  const messageClasses = `flex flex-col p-2 rounded-lg w-fit min-w-[120px] ${
    isBot
      ? "bg-gradient-to-r from-[#0284C7] to-[#77BAAA]"
      : isUser
      ? "bg-cyan-600 ml-auto text-white"
      : "bg-primary-foreground"
  }`;

  const textClasses = `text-sm font-normal px-2 text-start text-wrap break-words max-w-md ${
    isBot ? "text-white" : "text-secondary-foreground"
  } ${isUser ? "text-white" : ""}`;

  return (
    <div
      id={`message-${messageId}`} 
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
            className={`text-base font-medium text-muted-foreground cursor-pointer ${
              isUser ? "ml-auto" : ""
            }`}
            onClick={() => {
              if (!isUser && sender_id) {
                createPrivateChat(sender_id);
              }
            }}
          >
            {senderName}
          </p>
        </div>
      )}

      <ContextMenu onOpenChange={(open) => setIsMenuOpen(open)}>
        <div className={messageClasses}>
          <ContextMenuTrigger>
            {replyToMessage && (
              <div
                onClick={() => reply_message_id && goToMessage(reply_message_id)}
                className={`mb-1 gap-2 border-l-2  pl-2 py-1 text-sm text-bi cursor-pointer ${isUser ? "bg-[#F1F5F933] border-secondary" : "bg-[#F1F5F9] border-[#0891B2]"}`}
              >
                <p className={`${isUser ? "text-foreground" : "text-primary"}`}>{replyToMessage.sender} </p>
                <p className="text-bi">{replyToMessage.content.length > 60 ? `${replyToMessage.content.slice(0, 40)}…` : replyToMessage.content}</p>
              </div>
            )}
            {isPinned && <p className={`text-xs text-muted-foreground flex items-center gap-1 mb-1 ${isUser ? "text-white" : ""}`}><Icons.Pin fill={isUser ? "#ffffff" : "#64748B"} className="w-3 h-3" /> {t("pinned")}</p>}
            <p className={textClasses}>{message}</p>

            <div className="flex justify-end">
              <p className={`text-[10px] ${isUser ? "text-white" : "text-muted-foreground"} flex items-center gap-1`}>
                {isEdited && <p className={`text-[10px] italic ${isUser ? "text-white" : "text-muted-foreground"}`}>{t("edited")}</p>}
                {timestamp} <Icons.Checks fill={isUser ? "#ffffff" : "#64748B"} />
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
              <span className="text-sm">{item.label}</span>
            </ContextMenuItem>
          ))}
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
};

export default Message;
