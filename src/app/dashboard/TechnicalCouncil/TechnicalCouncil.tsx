"use client"

import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import UserTechnicalCouncilTalk from '../../components/Chat/UserTechnicalCouncilTalk'
import ChatContent from '../../components/ChatContent'
import { useSpeechDetection } from '../../hooks/useSpeechDetection'
import useUsers from '../../hooks/useUsers'
import RenderUsers from './components/RenderUsers'

const BotVisualizer = dynamic(() => import('../../components/Bot/BotVisualizer'), { ssr: false })

interface TechnicalCouncilProps {
  isMicrophoneOn: boolean;
  toggleMicrophone: () => void;
}

const TechnicalCouncil: React.FC<TechnicalCouncilProps> = ({ isMicrophoneOn, toggleMicrophone }) => {
  const t = useTranslations('dashboard');
  const searchParams = useSearchParams();
  const chatId = searchParams.get('id');
  
  const users = useUsers(chatId || ""); // Move hook to the top level

  const [userStream, setUserStream] = useState<MediaStream | null>(null);

  const isSpeaking = useSpeechDetection(isMicrophoneOn, setUserStream);

  return (
    <div className='w-full flex flex-col lg:flex-row bg-primary-foreground justify-center'>
      <aside className='w-full lg:w-1/3 bg-primary-foreground h-full px-2 lg:px-6 py-6 lg:py-6'>
        <div className='flex flex-col gap-1'>
          <p className='text-primary font-bold text-base'>{t("aray-bot")}</p>
          <BotVisualizer stream={null} type="default" /> 
        </div>
        <div className={`flex flex-col m-2 py-4 px-2 rounded-lg border-2 ${isSpeaking ? 'border-primary' : 'border-transparent'}`}>
          <UserTechnicalCouncilTalk 
            t={t}
            name={t("you")}
            isMicrophoneOn={isMicrophoneOn}
            turnOffTheMicrophone={toggleMicrophone}
            turnOnTheMicrophone={toggleMicrophone}
            isAbsent={false}
            LocalUser={true}
          />
        </div>
        <RenderUsers users={users} t={t} />
      </aside>
      <main className='w-full lg:w-2/3 mt-6 lg:mt-6 mx-4 lg:mr-6 rounded-lg bg-secondary min-h-[calc(100vh-8rem)] py-3 lg:py-3'>
        <ChatContent chatId={chatId || ""} type="technical-council" />
      </main>
    </div>
  );
};

export default TechnicalCouncil;
