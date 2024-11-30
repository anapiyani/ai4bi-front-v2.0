"use client"

import { useTranslations } from 'next-intl'
import BotVisualizer from '../components/Bot/BotVisualizer'



const Dashboard = () => {
  const t = useTranslations("dashboard")
  return (
    <div className="flex w-full h-screen justify-center items-center">
      <div className='w-1/3'>
        <BotVisualizer type="speaking" stream={null}  />
      </div>
    </div>
  )  
}

export default Dashboard

