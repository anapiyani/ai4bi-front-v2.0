"use client"

import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import AudioVisualizer from "../components/AudioVisualizer"


const Dashboard = () => {
  const t = useTranslations("dashboard")
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isRecording, setIsRecording] = useState(false)

  const handleOpenMicrophone = async () => {
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setStream(userStream)
      setIsRecording(true)
    } catch (error) {
      console.error("Microphone access error:", error)
      alert("Unable to access microphone. Please check permissions.")
    }
  }

  const handleCloseMicrophone = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
      setIsRecording(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full">
      <div className='flex items-center justify-center w-full flex-col gap-4'>
        <Button variant="outline" onClick={() => isRecording ? handleCloseMicrophone() : handleOpenMicrophone()}>
          {isRecording ? "Close microphone" : "Open microphone"}
        </Button>
        <div className='flex items-center justify-center gap-4 w-full max-w-2xl'>
          <AudioVisualizer stream={stream} />
        </div>
      </div>
    </div>
  )  
}

export default Dashboard

