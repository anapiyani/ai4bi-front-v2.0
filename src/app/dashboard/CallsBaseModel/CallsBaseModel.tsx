"use client"

import { useTranslations } from "next-intl"
import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"
import DeleteMessage from "../../components/Chat/DeleteMessage"
import ChatContent from "../../components/ChatContent"
import { useChatActions } from "../../components/CommonWsActions"
import { useChatWebSocket } from "../../hooks/useChatWebSocket"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { getCookie } from '../../api/service/cookie'
import { Protocol, TechCouncilUser, Transcription } from '../../types/types'
const BotVisualizer = dynamic(() => import("../../components/Bot/BotVisualizer"), { ssr: false })

type CallsBaseModelProps = {
	isMicrophoneOn: boolean
  toggleMicrophone: () => void
  close: (closeFunc: () => void) => void,
  onUserUpdate?: (user: TechCouncilUser, conferenceId: string | null) => void
	chat_id: string | null
	conference_id: string | null
	localStream: MediaStream | null
	remoteAudios: HTMLAudioElement[]
	transcription: Transcription[]
	speakingUsers: Map<string, boolean>
	connectedUsers: Map<string, any>
	isRTCNotConnected: boolean
	closeRTCConnection: () => void
	openMobileChat: boolean
	setOpenMobileChat: (open: boolean) => void
	messagesEndRef: React.RefObject<HTMLDivElement>
	protocols: Protocol
	children: React.ReactNode
	auctionMobileChat?: string,
    type?: "auction" | "technical-council"
}

const CallsBaseModel = ({
	isMicrophoneOn,
  toggleMicrophone,
  close,
  onUserUpdate,
	chat_id,
	conference_id,
	localStream,
	remoteAudios,
	transcription,
	speakingUsers,
	connectedUsers,
	isRTCNotConnected,
	closeRTCConnection,
	openMobileChat,
	protocols,
	setOpenMobileChat,
	messagesEndRef,
	children,
	auctionMobileChat,
    type
}: CallsBaseModelProps) => {
	const router = useRouter()
  const t = useTranslations("dashboard")
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
  const userId = getCookie("user_id")

  useEffect(() => {
      close(() => closeRTCConnection)

    if (chat_id) {
      setSelectedConversation(chat_id)
    }
  }, [chat_id, setSelectedConversation, close, closeRTCConnection])

  useEffect(() => {
    if (chat_id) {
      setSelectedConversation(chat_id)
    }
  }, [chat_id, setSelectedConversation])
  const councilConversation = conversations.find((c) => c.id === selectedConversation)
  const allParticipants = councilConversation?.participants || []

  const mergedCouncilUsers = allParticipants.map((participant) => {
    const { user_id, user_first_name, user_last_name, username } = participant
    const is_connected = connectedUsers.has(user_id)
    const is_speaking = speakingUsers.get(user_id) || false
    const mic_on = connectedUsers.get(user_id)?.mic_on || false
    return {
      user_id,
      first_name: user_first_name || "",
      last_name: user_last_name || "",
      username: username || "",
      is_connected,
      is_speaking,
      mic_on,
      role: participant.role,
    }
  })

  const prevUserRef = useRef<string | null>(null)

  useEffect(() => {
    if (onUserUpdate && userId) {
      const user = mergedCouncilUsers.find((user) => user.user_id === userId)
      if (user) {
        const userRoleString = JSON.stringify(user.role)
        if (prevUserRef.current !== userRoleString) {
          prevUserRef.current = userRoleString
          onUserUpdate(user, conference_id || null)
        }
      }
    }
  }, [mergedCouncilUsers, onUserUpdate, userId])
                    
  useEffect(() => {
    if (!messagesEndRef.current?.scrollTop) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesEndRef, transcription]);

  return (
    <div className="w-full flex flex-col lg:flex-row bg-neutral-secondary justify-center px-0 lg:px-4">
      <div className="w-full flex gap-4 lg:mt-4">
        <div
          className={`${
            openSideMenu ? "lg:basis-[95%] md:basis-[95%]" : "lg:basis-[70%] md:basis-[60%]"
          } basis-full ${openMobileChat ? "h-full pt-2 px-2" : "h-[calc(100vh-8rem)] p-2"} lg:bg-neutrals-primary rounded-lg overflow-auto`}
        > 
					{children}
        </div>
        <div
          className={`${
            openSideMenu ? "lg:basis-[5%] md:basis-[5%]" : "lg:basis-[30%] md:basis-[40%]"
          } h-[calc(100vh-15.5rem)] flex-col rounded-lg gap-1 hidden lg:flex md:flex md:mr-2`}
        >
          <h2 className="text-brand-orange text-base font-bold">
            {t("Aray")} - {openSideMenu ? null : t("bot")}
          </h2>
          <div>
            <BotVisualizer stream={null} type="default" small={openSideMenu} />
          </div>
          <div className="w-full h-full mt-2 bg-neutrals-secondary rounded-lg">
            <ChatContent
              chatId={chat_id || ""}
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
      <DeleteMessage isOpen={isDeleteMessageOpen} onClose={handleCloseDeleteMessage} onDelete={handleDeleteMessage} />

      {/* Render remote <audio> elements */}
      {remoteAudios.map((audio, index) => (
        <div key={index} className="audio-container">
          <audio src={audio.src} autoPlay />
        </div>
      ))}
      {isRTCNotConnected ? (
        <Dialog open={isRTCNotConnected}>
          <DialogContent className="w-full flex justify-center items-center flex-col gap-2 bg-white">
            <DialogHeader>
              <DialogTitle className="text-brand-orange text-base font-bold text-center">
                  {
                     t("process_not_connected", {type: type === "auction" ? t("auction-lowercase") : t("technical-council-lowercase") })
                  }
              </DialogTitle>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => router.push("/")}>
                {t("go_back")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : null}
      {openMobileChat && (
        <div className="w-full h-[calc(100vh-15.5rem)] md:hidden lg:hidden">
          <ChatContent
            chatId={chat_id || ""}
            openSideMenu={false}
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
            handlePopUpButtonAction={handlePopUpButtonAction}
            setOpenMenu={handleOpenMenu}
            handleForwardMessage={handleForwardMessage}
            openMenu={openMenu}
            typingStatuses={typingStatuses}
            conversations={conversations}
            popUpsByChat={popUpsByChat}
            conferenceRoomsByChat={conferenceRoomsByChat}
            technicalCouncilUsers={mergedCouncilUsers}
            onMobileBack={() => setOpenMobileChat(false)}
            openMobileChat={openMobileChat}
            auctionMobileChat={auctionMobileChat}
          />
        </div>
      )}
    </div>
  )
}

export default CallsBaseModel