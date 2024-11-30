"use client"

import { useTranslations } from 'next-intl'
import BotMutedVisualizer from '../components/Bot/BotMutedVisualizer'


const Dashboard = () => {
  const t = useTranslations("dashboard")
  return (
    <div className="flex w-full h-screen justify-center items-center">
      <div className='w-1/3'>
        <BotMutedVisualizer />
      </div>
    </div>
  )  
}

export default Dashboard

