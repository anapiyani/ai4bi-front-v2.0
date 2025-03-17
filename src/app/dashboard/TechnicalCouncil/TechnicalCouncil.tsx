"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import DeleteMessage from '../../components/Chat/DeleteMessage'
import ChatContent from '../../components/ChatContent'
import { useChatActions } from '../../components/CommonWsActions'
import ProtocolTable from '../../components/Form/ProtocolTable'
import { useChatWebSocket } from '../../hooks/useChatWebSocket'
import ScreenShareContent from './components/ScreenShareContent'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import { useWebRTC } from '../../hooks/useWebRTC'
const BotVisualizer = dynamic(() => import('../../components/Bot/BotVisualizer'), { ssr: false })

interface TechnicalCouncilProps {
  isMicrophoneOn: boolean
  toggleMicrophone: () => void,
  closingTechnicalCouncil: (closeFunc: () => void) => void
}

const TechnicalCouncil: React.FC<TechnicalCouncilProps> = ({
  isMicrophoneOn,
  toggleMicrophone,
  closingTechnicalCouncil
}) => {
  const router = useRouter()
  const t = useTranslations('dashboard')
  const searchParams = useSearchParams()
  const chat_id = searchParams.get('chat_id')
  const conference_id = searchParams.get('conference_id')
  const [openSideMenu, setOpenSideMenu] = useState<boolean>(false)

  const {
    isConnected,
    conversations,
    setSelectedConversation,
    messagesByChat,
    selectedConversation,
    setNewMessage,
    newMessage,
    sendChatMessage,
    createPrivateChat,
    sendEditMessage,
    handlePinMessage,
    handleUnpinMessage,
    handleForwardMessage,
    handleTyping,
    typingStatuses,
    handleReadMessage,
    popUpsByChat,
    conferenceRoomsByChat,
    protocols,
    handlePopUpButtonAction,
  } = useChatWebSocket()

  const {
    openMenu,
    isDeleteMessageOpen,
    handleCreateOrOpenChat,
    handleOpenDeleteMessage,
    handleOpenMenu,
    handleDeleteMessage,
    handleCloseDeleteMessage,
  } = useChatActions()

  const room = conference_id || 'default'
  const { 
    localStream,
    remoteAudios,
    transcription,
    speakingUsers,
    connectedUsers,
    isRTCNotConnected,
    closeRTCConnection,
  } = useWebRTC({ room, isMicrophoneOn })

  useEffect(() => {
    closingTechnicalCouncil(() => closeRTCConnection)

    if (chat_id) {
      setSelectedConversation(chat_id)
    }
  }, [chat_id, setSelectedConversation, closingTechnicalCouncil, closeRTCConnection])

  useEffect(() => {
    if (chat_id) {
      setSelectedConversation(chat_id)
    }
  }, [chat_id, setSelectedConversation])

  const councilConversation = conversations.find(
    (c) => c.id === selectedConversation
  )
  const allParticipants = councilConversation?.participants || []

  const mergedCouncilUsers = allParticipants.map((participant) => {
    const { user_id, user_first_name, user_last_name, username } = participant
    const is_connected = connectedUsers.current.has(user_id)
    const is_speaking = speakingUsers.current.get(user_id) || false
    const mic_on = connectedUsers.current.get(user_id)?.mic_on || false
    return {
      user_id,
      first_name: user_first_name || '',
      last_name: user_last_name || '',
      username: username || '',
      is_connected,
      is_speaking,
      mic_on,
      role: participant.role
    }
  })

  return (
    <div className='w-full flex flex-col lg:flex-row bg-neutral-secondary justify-center px-0 lg:px-4'>
      <div className='w-full flex gap-4 lg:mt-4'>
        <div
          className={`${
            openSideMenu ? 'lg:basis-[95%] md:basis-[95%]' : 'lg:basis-[70%] md:basis-[60%]'
          } basis-full h-[calc(100vh-8rem)] lg:bg-neutrals-primary rounded-lg p-2`}
        >
          <Tabs defaultValue="demonstration">
            <div className='flex w-full bg-neutrals-secondary rounded-lg'>
              <TabsList className='w-full border-none flex justify-start'>
                <TabsTrigger className='data-[state=active]:bg-white data-[state=active]:text-black' value="demonstration">
                  {t('demonstration')}
                </TabsTrigger>
                <TabsTrigger className='data-[state=active]:bg-white data-[state=active]:text-black' value="protocol_table">
                  {t('protocol_table')}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="demonstration">
              <div className='w-full h-[calc(100vh-15.5rem)] overflow-y-auto'>
                <ScreenShareContent />
                <div className='w-full h-[200px] overflow-y-auto rounded-lg p-2 flex flex-col gap-2'>
                  <h2 className='text-brand-gray text-lg font-semibold'>{t('call_transcription')}</h2>
                  {transcription.map((textObj, index) => (
                    <p key={index} className='text-sm text-wrap text-muted-foreground'>
                      {textObj.name}: {textObj.text}
                    </p>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="protocol_table">
              <ProtocolTable protocols={protocols} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right side content */}
        <div
          className={`${
            openSideMenu ? 'lg:basis-[5%] md:basis-[5%]' : 'lg:basis-[30%] md:basis-[40%]'
          } h-[calc(100vh-15.5rem)] flex-col rounded-lg gap-1 hidden lg:flex md:flex md:mr-2`}
        >
          <h2 className='text-brand-orange text-base font-bold'>
            {t('Aray')} - {openSideMenu ? null : t('bot')}
          </h2>
          <div>
            <BotVisualizer stream={null} type='default' small={openSideMenu} />
          </div>
          <div className='w-full h-full mt-2 bg-neutrals-secondary rounded-lg'>
            <ChatContent
              chatId={chat_id || ''}
              openSideMenu={openSideMenu}
              selectedConversation={selectedConversation}
              messages={messagesByChat[selectedConversation || ''] || []}
              isTechnicalCouncil={true}
              isConnected={isConnected}
              setNewMessage={setNewMessage}
              newMessage={newMessage}
              handleCreateOrOpenChat={handleCreateOrOpenChat}
              sendChatMessage={sendChatMessage}
              handleTyping={handleTyping}
              participants={
                conversations.find((c) => c.id === selectedConversation)?.participants || []
              }
              handleOpenDeleteMessage={handleOpenDeleteMessage}
              handlePinMessage={handlePinMessage}
              handleUnpinMessage={handleUnpinMessage}
              createPrivateChat={createPrivateChat}
              handleReadMessage={handleReadMessage}
              sendEditMessage={sendEditMessage}
              setOpenSideMenu={setOpenSideMenu}
              handlePopUpButtonAction={handlePopUpButtonAction}
              setOpenMenu={handleOpenMenu}
              handleForwardMessage={handleForwardMessage}
              openMenu={openMenu}
              typingStatuses={typingStatuses}
              conversations={conversations}
              popUpsByChat={popUpsByChat}
              conferenceRoomsByChat={conferenceRoomsByChat}
              technicalCouncilUsers={mergedCouncilUsers}
            />
          </div>
        </div>
      </div>
      <DeleteMessage
        isOpen={isDeleteMessageOpen}
        onClose={handleCloseDeleteMessage}
        onDelete={handleDeleteMessage}
      />

      {/* Render remote <audio> elements */}
      {remoteAudios.map((audio, index) => (
        <div key={index} className='audio-container'>
          <audio src={audio.src} autoPlay />
        </div>
      ))}
      {isRTCNotConnected ? (
        <Dialog open={isRTCNotConnected}>
          <DialogContent className='w-full flex justify-center items-center flex-col gap-2 bg-white'>
            <DialogHeader>
              <DialogTitle className='text-brand-orange text-base font-bold'>
                {t('rtc_not_connected_please_try_later')}
              </DialogTitle>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => router.push('/')}>
                {t('go_back')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  )
}

export default TechnicalCouncil
