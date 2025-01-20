"use client"

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import dayjs from 'dayjs'
import { motion } from "framer-motion"
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import ChatContent from '../../components/ChatContent'
import { useChatWebSocket } from '../../hooks/useChatWebSocket'
import { ChatListItemData } from '../../types/types'
import { SearchBar } from './components/SearchBar'
import { CHAT_TABS } from './config/ChatTabs'


{/* data is example! */}
export const EXAMPLE_DATA: ChatListItemData[] = [
  {
    id: "d7d69048-ed7e-49d2-adb8-fa3276e6ee2c",
    active: false, 
    status: "active", 
    bnect_status: "submission_of_applications", 
    start_date: "16 ноя",
    end_date: "11 ноя",
    title: "Открытый тендер насосная станция пожаротушения по проекту Arena Light 1" 
  },
  {
    id: "d7123322-ed7e-123jk-adb8-ed7e123jk",
    active: false, 
    status: "published", 
    bnect_status: "bid_submission", 
    start_date: "13 дек", 
    end_date: "18 дек", 
    title: "Открытый тендер (СМР) по СС проект Atamura Comfort 2" 
  },
  {
    id: "sodm-kwowmd-232md-123mdss-213ds",
    active: false, 
    status: "published", 
    bnect_status: "bid_submission", 
    start_date: "13 янв", 
    end_date: "18 янв", 
    title: "Открытый тендер по проекту Arena Light 2" 
  }
];

const ChatMode = () => {
  const t = useTranslations("dashboard");
  const searchParams = useSearchParams();
  const router = useRouter();
  const chatId = searchParams.get("id");
  const { isConnected,
    conversations,
    setSelectedConversation,
    messages,
    selectedConversation,
    setNewMessage,
    newMessage,
    sendChatMessage,
    scrollRef,
  } = useChatWebSocket();

  const handleItemClick = (id: string) => {
    router.push(`/dashboard?active_tab=chat&id=${id}`);
  }

  useEffect(() => {
    if (chatId) {
      setSelectedConversation(chatId);
    }
  }, [chatId, setSelectedConversation]);

  // For use in future
  // const activeData = EXAMPLE_DATA.map(item => ({
  //   ...item,
  //   active: item.id === chatId
  // }));

  // const tabContents = useRenderChatTabContent({
  //   status: 'all',
  //   data: activeData,
  //   handleItemClick,
  //   t
  // });

  return (
    <div className="w-full flex flex-col lg:flex-row bg-primary-foreground justify-center">
      <aside className="w-full lg:w-1/3 bg-primary-foreground h-full px-4 lg:px-6 py-6 lg:py-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-secondary-foreground mb-4">
            {t("your-auctions")}
          </h2>
          
          <Tabs className="w-full" defaultValue="all">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:flex lg:flex-row gap-2 lg:gap-0 mb-4">
              {CHAT_TABS.map((tab) => (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value}
                  className="w-full lg:w-auto text-sm whitespace-nowrap"
                >
                  {t(tab.translationKey)}
                </TabsTrigger>
              ))}
            </TabsList>

            <SearchBar />
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-300px)] no-scrollbar">
              {conversations.map((conversation, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    handleItemClick(conversation.id)
                  }}
                  className={`flex flex-col gap-2 hover:bg-secondary p-2 rounded-lg cursor-pointer ${conversation.id === selectedConversation ? "bg-secondary" : ""}`}
                  key={conversation.id}
                >
                  <div className="flex flex-row gap-2">
                    <div 
                      className="flex flex-col gap-2 w-full"
                    >
                      <p className="break-words">{conversation.name}</p>
                      <p className="break-words">{
                        typeof conversation.lastMessage === 'object' ? (
                          <span className="text-sm text-muted-foreground">
                            {conversation.lastMessage?.sender_first_name && (
                              <span className="font-medium">{conversation.lastMessage.sender_first_name}: </span>
                            )}
                            {conversation.lastMessage?.content ? conversation.lastMessage.content.length > 70 ? conversation.lastMessage.content.slice(0, 70) + "..." : conversation.lastMessage.content : t("no-messages-yet")}
                            {conversation.lastMessage?.send_at && (
                              <span className="ml-2 text-xs opacity-70">
                                {dayjs(conversation.lastMessage.send_at).format("HH:mm")}
                              </span>
                            )}
                          </span>
                        ) : (
                          typeof conversation.lastMessage === 'string' ? (
                            <span className="text-sm text-muted-foreground">
                              {conversation.lastMessage ? conversation.lastMessage.length > 100 ? conversation.lastMessage.slice(0, 100) + "..." : conversation.lastMessage : t("no-messages-yet")}
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              {t("no-messages-yet")}
                            </span>
                          )
                        )
                      }</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            {/* for use in future 
            {CHAT_TABS.map((tab) => (
              <TabsContent 
                key={tab.value} 
                value={tab.value}
                className="mt-4"
              >
                {tabContents}
              </TabsContent>
            ))}
            {
              activeData.length === 0 && (
                <div className="mt-4">
                  <p className="text-center text-sm text-gray-500">{t("you-have-no-auctions")}</p>
                </div>
              )
            } */}
          </Tabs>
        </div>
      </aside>

      <div className="w-full lg:w-2/3 mt-6 lg:mt-6 mx-4 lg:mr-6 rounded-lg bg-secondary min-h-[calc(100vh-8rem)] py-3 lg:py-3">
					<ChatContent chatId={chatId || ""} selectedConversation={selectedConversation} messages={messages} title={conversations.find((c) => c.id === selectedConversation)?.name || t("chat")} isConnected={isConnected} setNewMessage={setNewMessage} newMessage={newMessage} sendChatMessage={sendChatMessage} scrollRef={scrollRef} />
      </div>
    </div>
  )
}

export default ChatMode
