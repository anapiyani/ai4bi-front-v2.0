"use client";

import { useTranslations } from "next-intl"
import { useState } from "react"
import toast from "react-hot-toast"
import { getCookie } from "../api/service/cookie"
import { useChatWebSocket } from "../hooks/useChatWebSocket"
import { useCreatePrivateChat } from "./Chat/hooks/useCreatePrivateChat"

export const useChatActions = () => {
  const t = useTranslations("dashboard")
  const { deleteMessage } = useChatWebSocket()
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [isDeleteMessageOpen, setIsDeleteMessageOpen] = useState<boolean>(false);
  const [messageIds, setMessageIds] = useState<string[] | null>(null);

  const { mutate: createPrivateChatMutation } = useCreatePrivateChat();

  const handleCreateOrOpenChat = (toUser: string) => {
    const user_id = getCookie("user_id");
    if (!user_id) return;
    createPrivateChatMutation(
      { user_id, toUser },
      {
        onSuccess: (data: any) => {
          window.location.href = `/dashboard?active_tab=chat&id=${data.chat_id}`;
        },
        onError: (error: any) => {
          toast.error(error.message);
        },
      }
    );
  };

  const handleOpenDeleteMessage = (messageId: string | string[]) => {
    setIsDeleteMessageOpen(true);
    setMessageIds(Array.isArray(messageId) ? messageId : [messageId]);
  };

  const handleOpenMenu = () => {
    setOpenMenu(true);
  };

  const handleDeleteMessage = () => {
    setIsDeleteMessageOpen(false)
    if (messageIds) {
      messageIds.forEach((id) => {
        deleteMessage(id)
      })
      toast.success(t("message-deleted"))
    }
  }

  const handleCloseDeleteMessage = () => {
    setIsDeleteMessageOpen(false)
  }


  return {
    openMenu,
    setOpenMenu,
    isDeleteMessageOpen,
    setIsDeleteMessageOpen,
    messageIds,
    handleCreateOrOpenChat,
    handleOpenDeleteMessage,
    handleOpenMenu,
    handleDeleteMessage,
    handleCloseDeleteMessage,
  };
};
