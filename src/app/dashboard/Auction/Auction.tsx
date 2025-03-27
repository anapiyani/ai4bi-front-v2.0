"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import BotVisualizer from '../../components/Bot/BotVisualizer'
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
  const [auctionMobileChat, setAuctionMobileChat] = useState<string>("protocol") 
  const [openMobileChat, setOpenMobileChat] = useState<boolean>(true)
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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcription]);

  const auctionTable = useMemo(() => {
    return (
      <div className="flex flex-col w-full">
        <div className={`flex lg:hidden md:hidden gap-2`}>
          <Tabs value={auctionMobileChat} onValueChange={setAuctionMobileChat} className="w-full">
            <div className="flex bg-neutrals-secondary rounded-lg gap-2">
              <TabsList className="w-full border-none flex justify-start">
                <TabsTrigger 
                  className="data-[state=active]:bg-white data-[state=active]:text-black text-xs px-2" 
                  value="protocol"
                >
                  {t("protocol_table")}
                </TabsTrigger>
                <TabsTrigger 
                  className="data-[state=active]:bg-white data-[state=active]:text-black text-xs px-2" 
                  value="chat"
                >
                  {t("chat")}
                </TabsTrigger>
                <TabsTrigger 
                  className="data-[state=active]:bg-white data-[state=active]:text-black text-xs px-2" 
                  value="participants"
                >
                  {t("participants")}
                </TabsTrigger>
              </TabsList>       
              <div className='w-full'>
                <BotVisualizer stream={null} longAF={true} />
              </div>
            </div>            
            <TabsContent value="protocol" className={`${auctionMobileChat === "protocol" ? "mt-2" : "hidden"}`}>
              <div className="p-2 w-full">
                <AuctionProtocol t={t} />
              </div>
              <div className="p-2">
                <h2 className="text-brand-gray text-lg font-semibold">{t("call_transcription")}:</h2>
                {transcription.length > 0 ? (
                  transcription.map((textObj, index) => {
                    const isLastItem = index === transcription.length - 1;
                    return (
                      <div 
                        className="mt-1" 
                        key={index} 
                        ref={isLastItem ? messagesEndRef : null}
                      >
                        <Transcriptions
                          time={textObj.time}
                          user={textObj.name}
                          text={textObj.text}
                        />
                      </div>
                    )
                  })
                ) : (
                  <div className="text-muted-foreground text-sm">{t("no_transcriptions_yet")}</div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className="hidden lg:flex md:flex flex-col w-full">
          <div className="p-2 w-full">
            <AuctionProtocol t={t} />
          </div>
          <div className="p-2">
            <h2 className="text-brand-gray text-lg font-semibold">{t("call_transcription")}:</h2> 
              {transcription.length > 0 ? (
                  transcription.map((textObj, index) => {
                    const isLastItem = index === transcription.length - 1;
                      return (
                        <div 
                          className="mt-1" 
                          key={index} 
                          ref={isLastItem ? messagesEndRef : null}
                        >
                          <Transcriptions
                            time={textObj.time}
                            user={textObj.name}
                            text={textObj.text}
                          />
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-muted-foreground text-sm">{t("no_transcriptions_yet")}</div>
                  )}
            </div>
          </div>
      </div>
    )
  }, [transcription, t, auctionMobileChat, openMobileChat])

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
      openMobileChat={auctionMobileChat !== "protocol"}
      setOpenMobileChat={setOpenMobileChat}
      messagesEndRef={messagesEndRef}
      protocols={protocols as Protocol}
      auctionMobileChat={auctionMobileChat}
    >
      {auctionTable}
    </CallsBaseModel>
  )
}

export default Auction
