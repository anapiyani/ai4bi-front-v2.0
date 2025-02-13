"use client"

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { useLocale, useTranslations } from "next-intl"
import { useRouter, useSearchParams } from "next/navigation"
import { memo, useEffect, useState } from "react"
import toast from 'react-hot-toast'
import ChatMenu from "../../components/Chat/ChatMenu/ChatMenu"
import ConstructModal from '../../components/Chat/ConstructModal'
import DeleteMessage from "../../components/Chat/DeleteMessage"
import ChatContent from "../../components/ChatContent"
import Icons from '../../components/Icons'
import { useChatWebSocket } from "../../hooks/useChatWebSocket"
import { ReceivedChats } from '../../types/types'
import ChatListItem from "./components/ChatListItem"
import { SearchBar } from "./components/SearchBar"
import { CHAT_TABS, CONSTRUCT_TABS } from "./config/ChatTabs"

const ChatMode = () => {
  const t = useTranslations("dashboard")
  const locale = useLocale()
  const searchParams = useSearchParams()
  const router = useRouter()
  const chatId = searchParams.get("id")
  const [openMenu, setOpenMenu] = useState<boolean>(false)
  const [selectedConversationType, setSelectedConversationType] = useState<"auction_chat" | "private">()
  const [constructModalOpen, setConstructModalOpen] = useState<boolean>(false)
  const [messageIds, setMessageIds] = useState<string[] | null>(null)
  const [isDeleteMessageOpen, setIsDeleteMessageOpen] = useState<boolean>(false)
  const {
    isConnected,
    conversations,
    setSelectedConversation,
    messagesByChat,
    setMessagesByChat,
    selectedConversation,
    setNewMessage,
    newMessage,
    sendChatMessage,
    deleteMessage,
    createPrivateChat,
    sendEditMessage,
    handlePinMessage,
    handleUnpinMessage,
    handleForwardMessage,
    handleTyping,
    typingStatuses,
    handleReadMessage,
    addParticipantsToAuctionChat
  } = useChatWebSocket()

  const handleItemClick = (id: string) => {
    router.push(`/dashboard?active_tab=chat&id=${id}`)
    setOpenMenu(false)
  }

  const handleOpenDeleteMessage = (messageId: string | string[]) => {
    setIsDeleteMessageOpen(true)
    if (Array.isArray(messageId)) {
      setMessageIds(messageId)
    } else {
      setMessageIds([messageId])
    }
  }

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

  const handleOpenMenu = () => {
    setOpenMenu(true)
  }

  useEffect(() => {
    if (chatId) {
      setSelectedConversation(chatId)
      setOpenMenu(false)
    }
  }, [chatId, setSelectedConversation])

  useEffect(() => {
    if (selectedConversation) {
      const selectedConvo = conversations.find((c) => c.id === selectedConversation)
      setSelectedConversationType(selectedConvo?.chat_type)
      setOpenMenu(false) 
    }
  }, [selectedConversation, conversations])

  return (
    <div className="w-full flex flex-col lg:flex-row bg-primary-foreground justify-center">
      <aside className="w-full lg:w-1/3 bg-primary-foreground h-full px-3 py-6 lg:py-6">
        <Tabs defaultValue="your-auctions">
          <div className="flex flex-col gap-1">
            <div className='flex justify-between items-center'>
              <TabsList className="flex flex-row gap-2 border-none justify-start">
                <TabsTrigger
                  value="your-auctions"
                  className="text-muted-foreground font-semibold text-base data-[state=active]:bg-transparent p-0 data-[state=active]:text-primary"
                >
                  {t("your-auctions")}
                </TabsTrigger>
                <p className="text-border font-semibold text-sm">|</p>
                <TabsTrigger
                  value="private-chats"
                  className="text-muted-foreground font-semibold text-base data-[state=active]:bg-transparent p-0 data-[state=active]:text-primary"
                >
                  {t("private-chats")}
                </TabsTrigger>
                <p className="text-border font-semibold text-sm">|</p>
                <TabsTrigger
                  value="constructs"
                  className="text-muted-foreground font-semibold text-base data-[state=active]:bg-transparent p-0 data-[state=active]:text-primary"
                >
                  {t("constructs")}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="constructs" className="h-full flex justify-center items-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="w-full h-full flex justify-center items-center"
                >
                  <Button onClick={() => setConstructModalOpen(true)} className="w-full h-full p-1 border-none bg-neutrals-secondary" variant="outline" size="icon">
                    <Icons.Plus fill="#4F4F4F" />
                  </Button>
                </motion.div>
              </TabsContent>
            </div>
            <SearchBar />
            <TabsContent value="your-auctions">
              <Tabs className="w-full" defaultValue="all">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:flex lg:flex-row gap-2 lg:gap-0 mb-4 border-none justify-start">
                  {CHAT_TABS.map((tab, index) => (
                    <motion.div
                      key={tab.value}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className={`w-full lg:w-auto  ${locale === "kz" ? "text-[13px]" : "text-sm"} whitespace-nowrap`}
                      >
                        {t(tab.translationKey)}
                      </TabsTrigger>
                    </motion.div>
                  ))}
                </TabsList>
                <div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-300px)] no-scrollbar">
                  {conversations.map((conversation, index) =>
                    conversation.chat_type === "auction_chat" ? (
                      <ChatListItem
                        key={conversation.id}
                        data={conversation as ReceivedChats}
                        typingStatuses={typingStatuses}
                        t={t}
                        onClick={() => {
                          handleItemClick(conversation.id)
                          setSelectedConversationType(conversation.chat_type)
                        }}
                        isSelected={conversation.id === selectedConversation}
                        index={index}
                      />
                    ) : null,
                  )}
                </div>
              </Tabs>
            </TabsContent>
            <TabsContent value="private-chats">
              <div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-300px)] no-scrollbar">
                {conversations.map((conversation, index) => 
                  conversation.chat_type === "private" ? (
                    <ChatListItem
                      key={conversation.id}
                      data={conversation as ReceivedChats}
                      typingStatuses={typingStatuses}
                      t={t}
                      onClick={() => {
                        handleItemClick(conversation.id)
                        setSelectedConversationType(conversation.chat_type)
                      }}
                      isSelected={conversation.id === selectedConversation}
                      index={index}
                    />
                  ) : null,
                )}
              </div>
            </TabsContent>
            <TabsContent value="constructs">
              <Tabs className="w-full" defaultValue="all">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:flex lg:flex-row gap-2 lg:gap-0 mb-4 border-none justify-start ">
                  {CONSTRUCT_TABS.map((tab, index) => (
                    <motion.div
                      key={tab.value}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className={`w-full lg:w-auto  ${locale === "kz" ? "text-[13px]" : "text-sm"} whitespace-nowrap`}
                      >
                        {t(tab.translationKey)}
                      </TabsTrigger>
                    </motion.div>
                  ))}
                </TabsList>
              </Tabs>
              <div>
                Here will be chats for the selected construct...
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </aside>

      <div className="w-full lg:w-2/3 mt-6 lg:mt-6 mx-4 lg:mr-6 rounded-lg bg-secondary min-h-[calc(100vh-8rem)] py-3 lg:py-3 flex justify-center">
        <ChatContent
          chatId={chatId || ""}
          selectedConversation={selectedConversation}
          messages={messagesByChat[selectedConversation || ""] || []}
          title={conversations.find((c) => c.id === selectedConversation)?.name || t("chat")}
          isConnected={isConnected}
          setNewMessage={setNewMessage}
          newMessage={newMessage}
          sendChatMessage={sendChatMessage}
          handleTyping={handleTyping}
          participants={conversations.find((c) => c.id === selectedConversation)?.participants || []}
          handleOpenDeleteMessage={handleOpenDeleteMessage}
          handlePinMessage={handlePinMessage}
          handleUnpinMessage={handleUnpinMessage}
          createPrivateChat={createPrivateChat}
          handleReadMessage={handleReadMessage}
          sendEditMessage={sendEditMessage}
          setOpenMenu={handleOpenMenu}
          handleForwardMessage={handleForwardMessage}
          openMenu={openMenu}
          typingStatuses={typingStatuses}
          conversations={conversations}
        />
      </div>
      {openMenu && selectedConversation && (
        <div
          className="w-2/5">
          <ChatMenu
            type={selectedConversationType}
            setOpenMenu={setOpenMenu}
            name={conversations.find((c) => c.id === selectedConversation)?.name || t("chat")}
            participants={conversations.find((c) => c.id === selectedConversation)?.participants || []}
            addParticipantsToAuctionChat={addParticipantsToAuctionChat}
          />
        </div>
      )}
      {
        constructModalOpen && (
          <ConstructModal 
            constructModalOpen={constructModalOpen} 
            setConstructModalOpen={setConstructModalOpen}
            t={t}
          />
        )
      }
      <DeleteMessage isOpen={isDeleteMessageOpen} onClose={handleCloseDeleteMessage} onDelete={handleDeleteMessage} />
    </div>
  )
}

export default memo(ChatMode);