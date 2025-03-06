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
import ProtocolTable from '../../components/Form/ProtocolTable'
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
  } = useChatActions();
  const t = useTranslations('dashboard');
  const searchParams = useSearchParams();
  const chat_id = searchParams.get('chat_id');
  const conference_id = searchParams.get('conference_id');
  const [openSideMenu, setOpenSideMenu] = useState<boolean>(false);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteAudios, setRemoteAudios] = useState<HTMLAudioElement[]>([]);
  const room = conference_id || "default";
  const wsRef = useRef<WebSocket | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const connectedUsers = useRef<Map<string, any>>(new Map());
  const [transcription, setTranscription] = useState<{text: string, user_id: string, name: string, username: string}[]>([]);

  useEffect(() => {
    let isUnmounting = false;

    const updateAudioElements = () => {
      connectedUsers.current.forEach((user) => {
        const audio = document.createElement("audio");
        audio.srcObject = user.stream;
        audio.autoplay = true;
        audio.controls = true;
        setRemoteAudios(prev => [...prev, audio]);
      });
    }
    
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
            case "user_connected":  
              console.log("User connected", msg.user.user_id);
              break;
            
            case "users_updated":
              console.log("Users updated", msg.users);
              connectedUsers.current.clear();
              msg.users.forEach((user: any) => {
                connectedUsers.current.set(user.user_id, user);
              });
              updateAudioElements();
              break;

            case 'offer':
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
              console.log("Candidate added", msg);
              break;
            
            case 'python_response':
              console.log(`Audio Server response from user ${msg}:`, msg.text, msg.user_id);
              Array.from(connectedUsers.current.values()).map((user) => {
                if (user.user_id === msg.user_id) {
                  setTranscription((prev) => [...prev, {text: msg.text, user_id: user.user_id, name: user.name, username: user.username}]);
                }
              });
              break;
                
            case 'python_binary_response':
                console.log(`Audio Server binary response from user ${msg}`);
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
    if (chat_id) {
      setSelectedConversation(chat_id);
    }
  }, [chat_id, setSelectedConversation]);

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
                <div className='w-full h-[300px] rounded-lg p-2 flex flex-col gap-2'>
                  {transcription.map((text, index) => (
                    <p key={index} className='text-sm text-wrap text-muted-foreground'>{text.name}: {text.text}</p>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="protocol_table">
              <ProtocolTable protocols={protocols} />
          </TabsContent>
        </div>
        </Tabs>
      </div>
      <div className={`${openSideMenu ? "lg:basis-[5%] md:basis-[5%]" : "lg:basis-[30%] md:basis-[40%]"} h-[calc(100vh-15.5rem)] flex flex-col rounded-lg gap-1`}>
        <h2 className='text-brand-orange text-base font-bold'>{t("Aray")} - {openSideMenu ? null : t("bot")}</h2>
        <div>
          <BotVisualizer stream={null} type='default' small={openSideMenu} />
        </div>
        <div className='w-full h-full mt-2 bg-neutrals-secondary rounded-lg'>
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
