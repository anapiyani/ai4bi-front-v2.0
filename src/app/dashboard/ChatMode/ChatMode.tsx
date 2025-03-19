"use client"

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { useLocale, useTranslations } from "next-intl"
import { useRouter, useSearchParams } from "next/navigation"
import { memo, useCallback, useEffect, useMemo, useState } from "react"
import toast from 'react-hot-toast'
import ChatMenu from "../../components/Chat/ChatMenu/ChatMenu"
import DeleteMessage from "../../components/Chat/DeleteMessage"
import ConstructModal from '../../components/Chat/Forms/ConstructModal'
import { useCreatePrivateChat } from '../../components/Chat/hooks/useCreatePrivateChat'
import ChatContent from "../../components/ChatContent"
import { useChatActions } from '../../components/CommonWsActions'
import Icons from '../../components/Icons'
import { useChatWebSocket } from "../../hooks/useChatWebSocket"
import { AutoCompleteResponse, ReceivedChats } from '../../types/types'
import ChatListItem from "./components/ChatListItem"
import { SearchBar } from "./components/SearchBar"
import { CHAT_TABS, CONSTRUCT_TABS } from "./config/ChatTabs"

const ChatMode = () => {
  const t = useTranslations("dashboard")
  const locale = useLocale()
  const searchParams = useSearchParams()
  const router = useRouter()
  const chatId = searchParams.get("id")
  const [selectedConversationType, setSelectedConversationType] = useState<"auction_chat" | "private" | "group">()
  const [constructModalOpen, setConstructModalOpen] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState("your-auctions");
  const [privateChatResult, setPrivateChatResult] = useState<AutoCompleteResponse[] | null>(null)
  const {mutate: createPrivateChatMutation, isPending: isCreatingPrivateChat} = useCreatePrivateChat();
  const [isProcessingChatSelection, setIsProcessingChatSelection] = useState(false);

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
    addParticipantsToAuctionChat,
    popUpsByChat,
    handlePopUpButtonAction,
    conferenceRoomsByChat,
    startedUserId
  } = useChatWebSocket()
  const {
    openMenu,
    setOpenMenu,
    isDeleteMessageOpen,
    setIsDeleteMessageOpen,
    messageIds,
    handleCreateOrOpenChat,
    handleOpenDeleteMessage,
    handleOpenMenu,
  } = useChatActions();
  
  const auctionChats = useMemo(() => 
    conversations.filter(c => c.chat_type === "auction_chat"),
    [conversations]
  )

  const privateChats = useMemo(() =>
    conversations.filter(c => c.chat_type === "private"), 
    [conversations]
  )

  const constructChats = useMemo(() =>
    conversations.filter(c => c.chat_type === "group"),
    [conversations]
  )

  const handleItemClick = useCallback(async (id: string) => {
    if (isProcessingChatSelection) return;
    
    setIsProcessingChatSelection(true);
    try {
      await router.push(`/dashboard?active_tab=chat&id=${id}`);
      setOpenMenu(false);
    } finally {
      setTimeout(() => {
        setIsProcessingChatSelection(false);
      }, 500);
    }
  }, [router, setOpenMenu, isProcessingChatSelection]);

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

  const onMobileBack = () => {
    router.push(`/dashboard?active_tab=chat`)
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
      <aside className={`lg:max-w-[470px] lg:min-w-[300px] flex-shrink-0 w-full bg-primary-foreground h-full px-3 py-3 lg:px-6 lg:py-6 ${chatId ? "hidden lg:block" : "block"}`}>
        <Tabs defaultValue="your-auctions" onValueChange={setActiveTab}>
          <div className="flex flex-col">
            <div className='flex justify-between items-center'>
              <TabsList className="flex flex-row gap-2 border-none justify-start items-center overflow-x-auto no-scrollbar">
                <TabsTrigger
                  value="your-auctions"
                  className="text-sm text-muted-foreground font-semibold lg:text-base md:text-base data-[state=active]:bg-transparent p-0 data-[state=active]:text-primary"
                >
                  {t("your-auctions")}
                </TabsTrigger>
                <p className="text-border font-semibold text-sm">|</p>
                <TabsTrigger
                  value="private-chats"
                  className="text-sm text-muted-foreground font-semibold lg:text-base md:text-base data-[state=active]:bg-transparent p-0 data-[state=active]:text-primary"
                >
                  {t("private-chats")}
                </TabsTrigger>
                <p className="text-border font-semibold text-sm">|</p>
                <TabsTrigger
                  value="constructs"
                  className="text-sm text-muted-foreground font-semibold lg:text-base md:text-base data-[state=active]:bg-transparent p-0 data-[state=active]:text-primary"
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
            <TabsContent value="your-auctions" className='m-0'>
              <SearchBar  />
              <Tabs className="w-full mt-2" defaultValue="all">
                <TabsList className="flex flex-row gap-2 mb-4 border-none overflow-x-auto no-scrollbar items-center justify-start">
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
                        className={`w-full lg:w-auto ${locale === "kz" ? "text-[13px]" : "text-xs"} whitespace-nowrap lg:text-sm md:text-sm px-[6px]`}
                      >
                        {t(tab.translationKey)}
                      </TabsTrigger>
                    </motion.div>
                  ))}
                </TabsList>
                <div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-300px)] no-scrollbar">
                  {auctionChats.map((conversation, index) => (
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
                  ))}
                </div>
              </Tabs>
            </TabsContent>
            <TabsContent value="private-chats" className='m-0'>
              <SearchBar setPrivateChatResult={setPrivateChatResult} />
              <div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-300px)] no-scrollbar mt-3">
              {privateChatResult !== null ? (
                      <div className="flex flex-col gap-2">
                        {privateChatResult.map((result) => {
                          const chatItemData = {
                            id: result.uuid, 
                            name: `${result.first_name} ${result.last_name}`,
                            lastMessage: null, 
                            unread_count: 0,
                            chat_type: "private",
                          };

                          return (
                            <ChatListItem
                              key={result.uuid}
                              data={chatItemData as ReceivedChats}
                              typingStatuses={typingStatuses}
                              t={t}
                              onClick={() => handleCreateOrOpenChat(result.uuid)}
                              isSelected={false}
                              index={0}
                            />
                          );
                        })}
                      </div>
                    ) : (
                    privateChats.map((conversation, index) => (
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
                    ))
                  )
                }
              </div>
            </TabsContent>
            <TabsContent value="constructs">
              <Tabs className="w-full" defaultValue="all">
              <TabsList className="flex flex-row gap-2 mb-4 border-none overflow-x-auto no-scrollbar items-center justify-start">
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
                        className={`w-full lg:w-auto text-[10px] md:text-sm lg:text-sm ${locale === "kz" ? "text-[13px]" : "text-sm"} whitespace-nowrap`}
                      >
                        {t(tab.translationKey)}
                      </TabsTrigger>
                    </motion.div>
                  ))}
                </TabsList>
              </Tabs>
              <SearchBar />
              <div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-300px)] no-scrollbar mt-3">
                {constructChats.map((conversation, index) => (
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
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </aside>

      <div className={`${chatId ? 'flex' : 'hidden mx-0 mt-0 lg:flex'} w-full lg:w-2/3 lg:mt-6 lg:mx-4 lg:mr-4 rounded-lg bg-secondary min-h-[calc(100dvh-8rem)] lg:py-3 justify-center flex-1
      h-full
      overflow-hidden items-center ${openMenu ? "hidden lg:flex" : "flex"}`}>
        <ChatContent
          chatId={chatId || ""}
          selectedConversation={selectedConversation}
          messages={messagesByChat[selectedConversation || ""] || []}
          title={conversations.find((c) => c.id === selectedConversation)?.name || t("chat")}
          isTechnicalCouncil={false}
          isConnected={isConnected}
          setNewMessage={setNewMessage}
          newMessage={newMessage}
          handleCreateOrOpenChat={handleCreateOrOpenChat}
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
          popUpsByChat={popUpsByChat}
          handlePopUpButtonAction={handlePopUpButtonAction}
          conferenceRoomsByChat={conferenceRoomsByChat}
          startedUserId={startedUserId}
          onMobileBack={onMobileBack}
        />
      </div>
      {openMenu && selectedConversation && (
        <div
          className="w-full lg:block lg:w-[300px] flex-shrink-0 overflow-y-auto px-4 lg:px-0">  
          <ChatMenu
            type={selectedConversationType}
            setOpenMenu={setOpenMenu}
            name={conversations.find((c) => c.id === selectedConversation)?.name || t("chat")}
            participants={conversations.find((c) => c.id === selectedConversation)?.participants || []}
            addParticipantsToAuctionChat={addParticipantsToAuctionChat}
            chatId={selectedConversation}
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