import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import BotVisualizer from '../../components/Bot/BotVisualizer'
import UserTechnicalCouncilTalk from '../../components/Chat/UserTechnicalCouncilTalk'
import ChatContent from '../../components/ChatContent'
import useUsers from '../../hooks/useUsers'

interface TechnicalCouncilProps {
  isMicrophoneOn: boolean;
  toggleMicrophone: () => void;
}

const TechnicalCouncil: React.FC<TechnicalCouncilProps> = ({ isMicrophoneOn, toggleMicrophone }) => {
  const t = useTranslations('dashboard')
  const searchParams = useSearchParams();
  const chatId = searchParams.get('id');
  const users = useUsers(chatId || "");

  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const dataArray = useRef<Uint8Array | null>(null);
  const animationFrame = useRef<number | null>(null);
  const speakingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const [userStream, setUserStream] = useState<MediaStream | null>(null);

  const detectSound = useCallback(() => {
    if (!analyser.current || !dataArray.current) return;

    analyser.current.getByteFrequencyData(dataArray.current);
    const average = dataArray.current.reduce((a, b) => a + b) / dataArray.current.length;
    
    if (average > 30) {
      setIsSpeaking(true);
      if (speakingTimeoutRef.current) {
        clearTimeout(speakingTimeoutRef.current);
      }
      speakingTimeoutRef.current = setTimeout(() => setIsSpeaking(false), 500);
    }

    animationFrame.current = requestAnimationFrame(detectSound);
  }, []);

  useEffect(() => {
    if (isMicrophoneOn) {
      const setupAudio = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const context = new (window.AudioContext || (window as any).webkitAudioContext)();
          audioContext.current = context;
          const source = context.createMediaStreamSource(stream);
          const analyserNode = context.createAnalyser();
          analyser.current = analyserNode;
          source.connect(analyserNode);
          analyserNode.fftSize = 256;
          dataArray.current = new Uint8Array(analyserNode.frequencyBinCount);
					setUserStream(stream);
          detectSound();
        } catch (err) {
          console.error("Error accessing the microphone", err);
        }
      };

      setupAudio();
    }

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      if (audioContext.current) {
        audioContext.current.close();
      }
      if (speakingTimeoutRef.current) {
        clearTimeout(speakingTimeoutRef.current);
      }
    };
  }, [isMicrophoneOn, detectSound]);

  return (
    <div className='w-full flex flex-col lg:flex-row bg-primary-foreground justify-center'>
      <aside className='w-full lg:w-1/3 bg-primary-foreground h-full px-4 lg:px-6 py-6 lg:py-6'>
        <div className='flex flex-col gap-1'>
          <p className='text-primary font-bold text-base'>{t("aray-bot")}</p>
          <BotVisualizer stream={null} type="default" /> 
					{/* <BotVisualizer stream={userStream} type="speaking" /> */}
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
         {users.map((user) => (
          <div key={user.id} className='flex flex-col m-2 py-4 px-2 rounded-lg border-2 border-transparent'>
            <UserTechnicalCouncilTalk 
              t={t}
              name={user.name}
              isMicrophoneOn={user.isMicrophoneOn}
              turnOffTheMicrophone={() => {}}
              turnOnTheMicrophone={() => {}}
              isAbsent={user.isAbsent}
            />
          </div>
         ))}  
      </aside>
      <main className='w-full lg:w-2/3 mt-6 lg:mt-6 mx-4 lg:mr-6 rounded-lg bg-secondary min-h-[calc(100vh-8rem)] py-3 lg:py-3'>
        <ChatContent chatId={chatId || ""} type="technical-council" />
      </main>
    </div>
  )
}

export default TechnicalCouncil;

