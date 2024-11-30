"use client"

import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import BotSpeakingVisualizer from '../components/Bot/BotSpeakingVisualizer'


const Dashboard = () => {
  const t = useTranslations("dashboard")
  const [stream, setStream] = useState<MediaStream | null>(null)

  const startStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true })
    setStream(stream)
  }

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  return (
    <div className="flex w-full h-screen justify-center items-center">
      <div className='w-1/3'>
        <Button onClick={startStream}>Start Stream</Button>
        <Button onClick={stopStream}>Stop Stream</Button>
        <BotSpeakingVisualizer stream={stream} />
      </div>
    </div>
  )  
}

export default Dashboard

