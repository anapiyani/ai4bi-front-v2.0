"use client";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useRef } from "react"
import { ChatMessage } from "../../types/types"
import Icons from '../Icons'

type MessageInputProps = {
  t: any;
  sendChatMessage: (reply?: ChatMessage | null) => void;
  isConnected: boolean;
  value: string;
  setNewMessage: (value: string) => void;
  // For "Reply to"
  replyTo: ChatMessage | null;
  setReplyTo: (message: ChatMessage | null) => void;
  editMessage: ChatMessage | null;
  setEditMessage: (message: ChatMessage | null) => void;
  handleEdit: (e: React.FormEvent<HTMLFormElement>) => void;
  openDropZoneModal: boolean;
  setOpenDropZoneModal: (open: boolean) => void;
};

const MessageInput = ({
  t,
  sendChatMessage,
  isConnected,
  value,
  setNewMessage,
  replyTo,
  setReplyTo,
  editMessage,
  setEditMessage,
  handleEdit,
  openDropZoneModal,
  setOpenDropZoneModal,
}: MessageInputProps) => {
  let inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 200);
  }, [replyTo, editMessage]);

 const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      if (value.trim() && isConnected) {
        sendChatMessage(replyTo); 
        setNewMessage("");
        setReplyTo(null);
      }
    } else if (e.key === "Escape") {
      setReplyTo(null);
      setEditMessage(null);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      sendChatMessage(replyTo);
      setNewMessage("");
      setReplyTo(null);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editMessage) {
      setEditMessage({ ...editMessage, content: e.target.value });
    } else {
      setNewMessage(e.target.value);
    }
  };

  const ChooseFiles = () => {
    setOpenDropZoneModal(true);
  }

  return (
    <div className="relative w-full"> 
      {replyTo && (
        <div className="absolute bottom-10 left-0 w-full bg-white p-2 text-sm text-gray-700 flex items-start justify-between rounded-t-lg z-10  border-primary">
          <div className="flex flex-col px-3 gap-1 py-1">
            <div className="flex items-center gap-2">
              <Icons.Reply_small_blue />
              <p className='text-sm font-bold text-primary'>{t("reply-to")} {replyTo.sender_first_name} {replyTo.sender_last_name}</p>
            </div>
            <div>
              <span className="text-sm">
                {replyTo.content.length > 100 ? `${replyTo.content.slice(0, 100)}…` : replyTo.content}
              </span>
            </div>
          </div>
          <button
            onClick={() => setReplyTo(null)}
            className="text-xs h-full"
          >
            <Icons.Close />
          </button>
        </div>
      )}
      {editMessage && (
          <div className="absolute bottom-10 left-0 w-full bg-white p-2 text-sm text-gray-700 flex items-start justify-between rounded-t-lg z-10  border-primary">
            <div className="flex flex-col px-3 gap-1 py-1">
              <div className="flex items-center gap-2">
                <Icons.Edit_small_blue />
                <p className='text-sm font-bold text-primary'>{t("edit-message")}</p>
              </div>
              <div>
                <span className="text-sm">
                  {editMessage.content.length > 100 ? `${editMessage.content.slice(0, 100)}…` : editMessage.content}
                </span>
              </div>
            </div>
            <button
              onClick={() => setEditMessage(null)}
              className="text-xs h-full"
            >
              <Icons.Close />
            </button>
        </div>
      )}
      <form
        onSubmit={(e) => {
          if (editMessage) {
            handleEdit(e);
          } else {
            handleSend(e);
          }
        }}
        className={`flex items-center gap-2 w-full pt-${
          replyTo ? "10" : "0"
        }`} 
      >
        <Input
          ChooseFiles={() => {
            ChooseFiles()
          }}
          ref={inputRef}
          placeholder={t("type-your-message-here")}
          onChange={handleEditChange}
          onKeyDown={handleKeyDown}
          value={editMessage ? editMessage.content : value}
          className="w-full focus:ring-0 focus:border-none border-none focus:outline-none"
          icon={<Icons.Choose_files />}
        />
        <Button  
          disabled={
            editMessage ? !isConnected || !editMessage.content.trim() : !isConnected || !value.trim()
          } 
          type="submit"
        >
          {editMessage ? t("edit") : t("send")}
        </Button>
      </form>
    </div>
  );
};

export default MessageInput;
