"use client"

import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useRef, useState } from 'react'
import { useChatWebSocket } from '../../hooks/useChatWebSocket'
import { useWebRTC } from '../../hooks/useWebRTC'
import { Protocol, TechCouncilUser } from '../../types/types'
import CallsBaseModel from '../CallsBaseModel/CallsBaseModel'

interface AuctionProps {
  isMicrophoneOn: boolean
  toggleMicrophone: () => void
  closingTechnicalCouncil: (closeFunc: () => void) => void,
  onUserUpdate?: (user: TechCouncilUser, conferenceId: string | null) => void
}

const Auction = ({
	isMicrophoneOn,
  toggleMicrophone,
  closingTechnicalCouncil,
  onUserUpdate,
}: AuctionProps) => {
  const t = useTranslations("dashboard")
  const searchParams = useSearchParams()
  const chat_id = searchParams.get("chat_id")
  const conference_id = searchParams.get("conference_id")
  const room = conference_id || "default"
  const [openMobileChat, setOpenMobileChat] = useState<boolean>(false)
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    protocols,
  } = useChatWebSocket()
  
  const {
    localStream,
    remoteAudios,
    transcription,
    speakingUsers,
    connectedUsers,
    isRTCNotConnected,
    closeRTCConnection,
  } = useWebRTC({ room, isMicrophoneOn })
	
	return (
		<div>
      <CallsBaseModel
        isMicrophoneOn={isMicrophoneOn}
        toggleMicrophone={toggleMicrophone}
        closingTechnicalCouncil={closingTechnicalCouncil}
        onUserUpdate={onUserUpdate}
        chat_id={chat_id}
        conference_id={conference_id}
        localStream={localStream}
        remoteAudios={remoteAudios}
        transcription={transcription}
        speakingUsers={speakingUsers.current}
        connectedUsers={connectedUsers.current}
        isRTCNotConnected={isRTCNotConnected}
        closeRTCConnection={closeRTCConnection}
        openMobileChat={openMobileChat}
        setOpenMobileChat={setOpenMobileChat}
        messagesEndRef={messagesEndRef}
        protocols={protocols as Protocol}
        children={<h1>{t("Auction")}</h1>}
      />
    </div>
	)
}

export default Auction;