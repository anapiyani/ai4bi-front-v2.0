"use client"

import type React from "react"

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTranslations } from 'next-intl'
import dynamic from "next/dynamic"
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import ProtocolTable from '../../components/Form/ProtocolTable'
import Icons from '../../components/Icons'
import { useChatWebSocket } from '../../hooks/useChatWebSocket'
import { useWebRTC } from '../../hooks/useWebRTC'
import { Protocol, TechCouncilUser } from '../../types/types'
import ScreenShareContent from './components/ScreenShareContent'
import Transcriptions from './components/Transcriptions'
const BotVisualizer = dynamic(() => import("../../components/Bot/BotVisualizer"), { ssr: false })
const CallsBaseModel = dynamic(() => import("../CallsBaseModel/CallsBaseModel"), { ssr: false })
interface TechnicalCouncilProps {
  isMicrophoneOn: boolean
  toggleMicrophone: () => void
  closingTechnicalCouncil: (closeFunc: () => void) => void,
  onUserUpdate?: (user: TechCouncilUser, conferenceId: string | null) => void
}

const TechnicalCouncil: React.FC<TechnicalCouncilProps> = ({
  isMicrophoneOn,
  toggleMicrophone,
  closingTechnicalCouncil,
  onUserUpdate,
}) => {
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

  console.log("[TechnicalCouncil] protocols:", protocols);
  
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

  const technicalCouncilTabs = useMemo(() => {
    return (
      <Tabs defaultValue="demonstration">
          <div className="flex w-full bg-neutrals-secondary rounded-lg">
            <TabsList className="w-full border-none flex justify-start">
              <TabsTrigger
                disabled={openMobileChat}
                className="data-[state=active]:bg-white data-[state=active]:text-black"
                value="demonstration"
              >
                {t("demonstration")}
              </TabsTrigger>
              <TabsTrigger
                disabled={openMobileChat}
                className="data-[state=active]:bg-white data-[state=active]:text-black"
                value="protocol_table"
              >
                {t("protocol_table")}
              </TabsTrigger>
              </TabsList>
              {openMobileChat ? (
                <div className="flex justify-end items-center md:hidden lg:hidden px-2">
                  <Button variant="ghost" onClick={() => setOpenMobileChat(false)} className="p-1">
                    <Icons.SideMenu_Open />
                  </Button>
                </div>
              ) : (
                <div className="flex justify-end items-center md:hidden lg:hidden px-2">
                  <Button variant="ghost" onClick={() => setOpenMobileChat(true)} className="p-1">
                    <Icons.SideMenu  />
                  </Button>
                </div>
              )}
            </div>

            <TabsContent value="demonstration">
              <div
                className={`w-full h-[calc(100vh-10.5rem)] overflow-y-auto ${openMobileChat ? "hidden md:block lg:block" : ""}`}
              >
                <ScreenShareContent />
                <div className="w-full h-[280px] overflow-y-auto rounded-lg p-2 flex flex-col gap-2">
                  <h2 className="text-brand-gray text-lg font-semibold">{t("call_transcription")}:</h2>
                  {transcription.length > 0 ? (
                    transcription.map((textObj, index) => {
                      const isLastItem = index === transcription.length - 1;
                      return (
                        <div 
                          className='mt-1' 
                          key={index} 
                          ref={isLastItem ? messagesEndRef : null}
                        >
                          <Transcriptions
                            time={textObj.time}
                            user={textObj.name}
                            text={textObj.text}
                          />
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-muted-foreground text-sm">{t("no_transcriptions_yet")}</div>
                  )}
              </div>
            </div>
          </TabsContent>
          <TabsContent className={`${openMobileChat ? "hidden md:block lg:block" : ""}`} value="protocol_table">
          <ProtocolTable protocol={protocols} />
        </TabsContent>
      </Tabs>
    )
  }, [transcription, protocols, t, openMobileChat])
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
      >
        {technicalCouncilTabs}
      </CallsBaseModel>
    </div>
  )
}

export default TechnicalCouncil
