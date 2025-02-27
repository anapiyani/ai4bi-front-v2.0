"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { getCookie } from '../../api/service/cookie'
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
  } = useChatActions();
  const t = useTranslations('dashboard');
  const searchParams = useSearchParams();
  const room_id = searchParams.get('id');
  const chatId = selectedConversation;
  const [openSideMenu, setOpenSideMenu] = useState<boolean>(false);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteAudios, setRemoteAudios] = useState<HTMLAudioElement[]>([]);
  const room = room_id || "default";
  const wsRef = useRef<WebSocket | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    let isUnmounting = false;

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        if (isUnmounting) return; 
        setLocalStream(stream);

        const ws = new WebSocket(`wss://rtc.ai4bi.kz/websocket?room=${encodeURIComponent(room || "default")}`);
        ws.onopen = () => {
          console.log('WebSocket for RTC connection established');
          ws.send(JSON.stringify({
            event: 'auth',
            data: `Bearer ${getCookie("access_token")}`
          }));
        }
        const pingInterval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ event: 'ping' }));
          }
        }, 30000);
  
        const peerConnection = new RTCPeerConnection({
          iceTransportPolicy: 'relay',
          iceServers: [
            { urls: "stun:rtc.ai4bi.kz:3478" },
            {
              urls: "turn:rtc.ai4bi.kz:5349?transport=udp",
              username: "test",
              credential: "test123"
            },
            {
              urls: "turn:rtc.ai4bi.kz:5349?transport=tcp",
              username: "test",
              credential: "test123"
            }
          ]
        });
  
        stream.getAudioTracks().forEach(track => peerConnection.addTrack(track, stream))
  
        isMicrophoneOn ? localStream?.getAudioTracks().forEach(track => track.enabled = true) : localStream?.getAudioTracks().forEach(track => track.enabled = false);
  
        peerConnection.ontrack = (event) => {
          if (event.track.kind !== "audio") return;
  
          const audio = document.createElement("audio");
          audio.srcObject = event.streams[0];
          audio.autoplay = true;
          audio.controls = true;

          setRemoteAudios(prev => [...prev, audio]);
          
          event.streams[0].onremovetrack = () => {
            setRemoteAudios(prev => prev.filter(a => a !== audio));
          }
        }
  
        // send ICE candidates to the server
        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            ws.send(JSON.stringify({
              event: 'candidate',
              data: JSON.stringify(event.candidate)
            }));
          }
        }
  
        // Handle incoming signaling messages from the server
        ws.onmessage = async (message) => {
          const msg = JSON.parse(message.data)
          if (!msg) return;
  
          switch (msg.event) {
            case 'offer':
              // Server sent an offer, set as remote, then create/send answer
              await peerConnection.setRemoteDescription(JSON.parse(msg.data));
              const answer = await peerConnection.createAnswer();
              await peerConnection.setLocalDescription(answer);
              ws.send(JSON.stringify({
                event: 'answer',
                data: JSON.stringify(answer)
              }));
              break;
  
            case 'candidate':
              await peerConnection.addIceCandidate(JSON.parse(msg.data));
              break;
          }
        };
  
        ws.onclose = () => {
          console.log('WebSocket closed');
          clearInterval(pingInterval);
        };
  
        ws.onerror = error => {
          console.error('WebSocket error:', error);
        };

      } catch (err) {
        console.log("Error starting RTC connection", err);
      }
    }

    start();

    return () => {
      isUnmounting = true;
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (peerRef.current) {
        peerRef.current.close();
        peerRef.current = null;
      }
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [])

  useEffect(() => {
    if (!localStream) return;
    localStream.getAudioTracks().forEach(track => {
      track.enabled = isMicrophoneOn;
    });
  }, [isMicrophoneOn, localStream]);

  useEffect(() => {
    if (chatId) {
      setSelectedConversation(chatId);
    }
  }, [chatId, setSelectedConversation]);

  return (
    <div className='w-full flex flex-col lg:flex-row bg-neutral-secondary justify-center px-4'>
     <div className='w-full flex gap-4 mt-4'>
      <div className={`${openSideMenu ? "lg:basis-[95%] md:basis-[95%]" : "lg:basis-[70%] md:basis-[60%]"} basis-full h-[calc(100vh-8rem)] bg-neutrals-primary rounded-lg p-2`}>
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
      <div className={`${openSideMenu ? "lg:basis-[5%] md:basis-[5%]" : "lg:basis-[30%] md:basis-[40%]"} h-[calc(100vh-8rem)] flex flex-col rounded-lg gap-1`}>
        <h2 className='text-brand-orange text-base font-bold'>{t("Aray")} - {openSideMenu ? null : t("bot")}</h2>
        <div>
          <BotVisualizer stream={null} type='default' small={openSideMenu} />
        </div>
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
            handlePopUpButtonAction={handlePopUpButtonAction}
            setOpenMenu={handleOpenMenu}
            handleForwardMessage={handleForwardMessage}
            openMenu={openMenu}
            typingStatuses={typingStatuses}
            conversations={conversations}
            popUpsByChat={popUpsByChat}
            conferenceRoomsByChat={conferenceRoomsByChat}
          />
        </div>
      </div> 
     </div>
     <DeleteMessage isOpen={isDeleteMessageOpen} onClose={handleCloseDeleteMessage} onDelete={handleDeleteMessage} />
     {remoteAudios.map((audio, index) => (
      <div key={index} className='audio-container'>
        <audio src={audio.src} autoPlay />
      </div>
     ))}
    </div>
  );
};

export default TechnicalCouncil;
