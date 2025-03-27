"use client"

import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useMemo, useRef, useState } from 'react'
import { useChatWebSocket } from '../../hooks/useChatWebSocket'
import { useWebRTC } from '../../hooks/useWebRTC'
import { Protocol, TechCouncilUser } from '../../types/types'
import CallsBaseModel from '../CallsBaseModel/CallsBaseModel'
import Transcriptions from '../TechnicalCouncil/components/Transcriptions'
import { AuctionProtocol } from './components/AuctionProtocol'

interface AuctionProps {
  isMicrophoneOn: boolean
  toggleMicrophone: () => void
  closingTechnicalCouncil: (closeFunc: () => void) => void
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
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { protocols } = useChatWebSocket()
  const {
    localStream,
    remoteAudios,
    transcription,
    speakingUsers,
    connectedUsers,
    isRTCNotConnected,
    closeRTCConnection,
  } = useWebRTC({ room, isMicrophoneOn })

  const auctionTable = useMemo(() => {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="p-2 overflow-x-auto w-full">
          <AuctionProtocol t={t} />
        </div>
        <div className="p-2 overflow-auto">
          <h2 className="text-brand-gray text-lg font-semibold">{t("call_transcription")}:</h2>
          {transcription.map((textObj, index) => {
            return (
              <div className="mt-1" key={index} ref={messagesEndRef}>
                <Transcriptions
                  time={textObj.time}
                  user={textObj.name}
                  text={textObj.text}
                />
              </div>
            )
          })}
        </div>
      </div>
    )
  }, [transcription, t])

  return (
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
    >
      {auctionTable}
    </CallsBaseModel>
  )
}

export default Auction
