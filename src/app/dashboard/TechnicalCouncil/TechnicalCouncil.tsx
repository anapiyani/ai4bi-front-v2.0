"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import DeleteMessage from '../../components/Chat/DeleteMessage'
import ChatContent from '../../components/ChatContent'
import { useChatActions } from '../../components/CommonWsActions'
import { useChatWebSocket } from "../../hooks/useChatWebSocket"
import ScreenShareContent from './components/ScreenShareContent'
const BotVisualizer = dynamic(() => import('../../components/Bot/BotVisualizer'), { ssr: false })

interface TechnicalCouncilProps {
  isMicrophoneOn: boolean;
  toggleMicrophone: () => void;
}

const TechnicalCouncil: React.FC<TechnicalCouncilProps> = ({ isMicrophoneOn, toggleMicrophone }) => {
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
  const {
    openMenu,
    isDeleteMessageOpen,
    handleCreateOrOpenChat,
    handleOpenDeleteMessage,
    handleOpenMenu,
    handleDeleteMessage,
    handleCloseDeleteMessage,
  } = useChatActions();
  const t = useTranslations('dashboard');
  const searchParams = useSearchParams();
  const chatId = searchParams.get('id');
  const [openSideMenu, setOpenSideMenu] = useState<boolean>(false);
  
  useEffect(() => {
    if (chatId) {
      setSelectedConversation(chatId);
    }
  }, [chatId, setSelectedConversation]);

  return (
    <div className='w-full flex flex-col lg:flex-row bg-neutral-secondary justify-center px-4'>
     <div className='w-full flex gap-4 mt-4'>
      <div className='lg:basis-[70%] md:basis-[60%] basis-full h-[calc(100vh-8rem)] bg-neutrals-primary rounded-lg p-2'>
      <Tabs defaultValue="demonstration">
        <div className='flex m-1 p-1 w-full bg-neutrals-secondary rounded-lg'>
            <TabsList className='w-full border-none flex justify-start'>
              <TabsTrigger className='data-[state=active]:bg-white data-[state=active]:text-black' value="demonstration">{t("demonstration")}</TabsTrigger>
              <TabsTrigger className='data-[state=active]:bg-white data-[state=active]:text-black' value="protocol_table">{t("protocol_table")}</TabsTrigger>  
            </TabsList>
        </div>
        <div>
            <TabsContent value="demonstration">
              <div className='w-full h-full'>
                <ScreenShareContent />
              </div>
            </TabsContent>
            <TabsContent value="protocol_table">
              <div className='w-full h-full'>
                <p>Protocol Table</p>
              </div>
          </TabsContent>
        </div>
        </Tabs>
      </div>
      <div className='lg:basis-[30%] md:basis-[40%] basis-full h-[calc(100vh-8rem)] flex flex-col rounded-lg gap-1'>
        <h2 className='text-brand-orange text-base font-bold'>{t("Aray")} - {t("bot")}</h2>
        <BotVisualizer stream={null} type='default' small={openSideMenu} />
        <div className='w-full h-full mt-2 bg-neutrals-secondary rounded-lg'>
          <ChatContent
            chatId={chatId || ""}
            openSideMenu={openSideMenu}
            selectedConversation={selectedConversation}
            messages={messagesByChat[selectedConversation || ""] || []}
            isTechnicalCouncil={true}
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
            setOpenSideMenu={setOpenSideMenu}
            setOpenMenu={handleOpenMenu}
            handleForwardMessage={handleForwardMessage}
            openMenu={openMenu}
            typingStatuses={typingStatuses}
            conversations={conversations}
        />
        </div>
      </div> 
     </div>
     <DeleteMessage isOpen={isDeleteMessageOpen} onClose={handleCloseDeleteMessage} onDelete={handleDeleteMessage} />
    </div>
  );
};

export default TechnicalCouncil;
