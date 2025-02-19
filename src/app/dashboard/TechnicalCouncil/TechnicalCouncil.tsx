"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'

const BotVisualizer = dynamic(() => import('../../components/Bot/BotVisualizer'), { ssr: false })

interface TechnicalCouncilProps {
  isMicrophoneOn: boolean;
  toggleMicrophone: () => void;
}

const TechnicalCouncil: React.FC<TechnicalCouncilProps> = ({ isMicrophoneOn, toggleMicrophone }) => {
  const t = useTranslations('technical_council');
  const searchParams = useSearchParams();
  const chatId = searchParams.get('id');

  return (
    <div className='w-full flex flex-col lg:flex-row bg-neutral-secondary justify-center px-4'>
     <div className='w-full flex gap-4 mt-4'>
      <div className='basis-[70%] h-[calc(100vh-10rem)] bg-neutrals-primary rounded-lg p-2'>
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
                <p>Demonstration</p>
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
      <div className='basis-[30%] h-[calc(100vh-10rem)] bg-neutrals-primary rounded-lg p-4'>
        <p>Technical Council</p>
      </div>
     </div>
    </div>
  );
};

export default TechnicalCouncil;
