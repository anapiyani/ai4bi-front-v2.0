"use client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import React, { useEffect, useState } from "react"
import { getCookie } from "../../api/service/cookie"
import useRenderMediaContent from '../../hooks/useRenderMediaContent'
import { MessageProps } from '../../types/types'
import Icons from "../Icons"
import useContextMenuItems from './ContextMenuItems'
import ReplyToMessageContent from './hooks/ReplyToMessage'

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
  forwarded_from,
  forwarded_from_first_name,
  forwarded_from_last_name,
  type,
  handleForward,
  media,
  handleSelectMessages,
  selectedMessages,
  counter,
}: MessageProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  const user_role = getCookie("role");
  const isAdmin = user_role === "admin";

  const isBot = sender === "bot";
  const isUser = sender === "user";

  const renderedMedia = useRenderMediaContent(media, t, isUser);

  const avatarText = React.useMemo(() => {
    if (isBot) {
      return t("aray-bot").slice(0, 2).toUpperCase();
    } 
    if (isUser) {
      return; 
    }
    const nameParts = sender.split(" ");
    return nameParts.length >= 2
        ? `${nameParts[0][0]}${nameParts[1][0]}`
        : `${nameParts[0][0]}`.toUpperCase();
  }, [sender, t, isBot, isUser]);

  const contextMenuItems = useContextMenuItems({
    isSelected,
    handleReplyClick: handleReplyClick || (() => {}),
    handleForward,
    handlePin,
    handleUnpin,
    handleEditClick: handleEditClick || (() => {}),
    handleOpenDeleteMessage,
    handleSelectMessages,
    t,
    isAdmin,
    isPinned,
    isOwner: sender === "user",
    messageId,
    selectedMessages,
  });

  useEffect(() => {
    if (selectedMessages.includes(messageId)) {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
  }, [selectedMessages, messageId]);

  if (type === "system_message") {
    return (
      <div className="flex w-full justify-center my-2 px-4">
        <div className="bg-gray-100 text-gray-600 text-sm px-3 py-2 rounded-md text-center">
          {message}
        </div>
      </div>
    );
  }
  const handleDoubleClick = () => {
    if (handleReplyClick) {
      handleReplyClick();
    }
  };

  const handleMessageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (selectedMessages.length >= 1 && handleSelectMessages) {
      e.preventDefault();
      const action = selectedMessages.includes(messageId) ? 'unselect' : 'select';
      handleSelectMessages(action);
    }
  };

  const senderName = isBot ? t("aray-bot") : isUser ? "" : sender;

  const avatarClasses = `w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
    isBot ? "bg-primary text-white" : "border border-neutrals-muted text-neutrals-muted"
  }`;

  const messageClasses = `flex flex-col p-2 rounded-lg w-fit min-w-[120px] ${
    isBot
      ? "bg-gradient-to-r from-[#0284C7] to-[#77BAAA]"
      : isUser
      ? "bg-neutrals-muted ml-auto text-white"
      : "bg-primary-foreground"
  }`;

  const textClasses = `text-sm font-normal px-2 text-start text-wrap break-words max-w-md ${
    isBot ? "text-white" : "text-secondary-foreground"
  } ${isUser ? "text-white" : ""}`;

  return (
    <div
      id={`message-${messageId}`}
      data-counter={counter}
      className={`message-item flex flex-col gap-2 p-1 ${
        isUser ? "w-full flex justify-end" : ""
      } ${
        isMenuOpen || isSelected
          ? "bg-[#4F4F4F20] hover:bg-[#4F4F4F20] transition-colors duration-200 rounded-lg"
          : "bg-transparent hover:bg-transparent transition-colors duration-200"
      }`}
      onClick={handleMessageClick}
    >
      {showSender && (
        <div className="flex items-center gap-2">
          {!isUser && <div className={avatarClasses}>{avatarText}</div>}
          <p
            className={`text-base font-medium text-neutrals-muted cursor-pointer ${
              isUser ? "ml-auto" : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
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
        <ContextMenuTrigger onDoubleClick={handleDoubleClick}>
          <div className={messageClasses}>
            {replyToMessage && reply_message_id && (
              <ReplyToMessageContent
                reply_message_id={reply_message_id}
                goToMessage={goToMessage}
                isUser={isUser}
                replyToMessage={replyToMessage}
                t={t}
              />
            )}
            {isPinned && (
              <p
                className={`text-xs text-neutrals-muted flex items-center gap-1 mb-1 ${
                  isUser ? "text-white" : ""
                }`}
              >
                <Icons.Pin
                  fill={isUser ? "#ffffff" : "#64748B"}
                  className="w-3 h-3"
                />
                {t("pinned")}
              </p>
            )}
            {forwarded_from && (
              <p
                onClick={(e) => {
                  e.stopPropagation();
                  createPrivateChat(forwarded_from);
                }}
                className={`text-xs flex items-center gap-1 mb-1 ${
                  isUser ? "text-white" : "text-neutrals-muted"
                } cursor-pointer`}
              >
                <Icons.Forward fill={isUser ? "#ffffff" : "#64748B"} />
                {t("forwarded_from")} {forwarded_from_first_name}{" "}
                {forwarded_from_last_name}
              </p>
            )}
            {renderedMedia}
            <p className={textClasses}>{message}</p>
            <div className="flex justify-end">
              <p
                className={`text-[10px] ${
                  isUser ? "text-white" : "text-neutrals-muted"
                } flex items-center gap-1`}
              >
                {isEdited && (
                  <span
                    className={`text-[10px] italic ${
                      isUser ? "text-white" : "text-neutrals-muted"
                    }`}
                  >
                    {t("edited")}
                  </span>
                )}
                {timestamp}
                <Icons.Checks fill={isUser ? "#ffffff" : "#64748B"} />
              </p>
            </div>
          </div>
        </ContextMenuTrigger>
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
