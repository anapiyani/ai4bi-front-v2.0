"use client"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import toast from 'react-hot-toast'
import WaveSurfer from "wavesurfer.js"
import Icons from "../../components/Icons"
import { useShowInlineAudio } from "../useUploadMedia"

const AudioMedia = ({
                      mediaId,
                      name,
                      small,
                      t,
                      isUser,
                    }: {
  mediaId: string
  name: string
  small: boolean | undefined
  t: any
  isUser: boolean
}) => {
  const { data: audioBlob, isLoading, refetch } = useShowInlineAudio(mediaId)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  // Manage audio URL lifecycle
  useEffect(() => {
    if (audioBlob instanceof Blob) {
      const url = URL.createObjectURL(audioBlob)
      setAudioUrl(url)

      return () => {
        URL.revokeObjectURL(url)
      }
    } else {
      setAudioUrl(null)
    }
  }, [audioBlob])

  const waveformRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const waveSurferRef = useRef<WaveSurfer | null>(null)
  const [loadError, setLoadError] = useState(false)

  const cleanupResources = useCallback(() => {
    if (waveSurferRef.current) {
      try {
        waveSurferRef.current.destroy()
      } catch (err) {
        console.error("Error destroying WaveSurfer:", err)
      }
      waveSurferRef.current = null
    }
  }, [])

  const togglePlay = useCallback(() => {
    if (!waveSurferRef.current) return
    waveSurferRef.current.playPause()
    setIsPlaying((prev) => !prev)
  }, [])

  const reloadAudio = useCallback(() => {
    cleanupResources()
    setLoadError(false)
    setRetryCount(prev => prev + 1)
    refetch()
  }, [cleanupResources, refetch])

  // Initialize WaveSurfer
  useEffect(() => {
    if (!audioUrl || !waveformRef.current) return

    setIsPlaying(false)
    setDuration(0)
    setCurrentTime(0)

    const waveSurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: isUser ? "#ffffff80" : "#00000040",
      progressColor: isUser ? "#F97316" : "#F97316",
      height: 30,
      barWidth: 4,
      barGap: 3,
      barRadius: 3,
      cursorWidth: 0,
      normalize: true,
      fillParent: true,
    })

    waveSurferRef.current = waveSurfer

    const handleReady = () => {
      try {
        setDuration(waveSurfer.getDuration() || 0)
        setLoadError(false)
      } catch (err) {
        console.error("Error getting duration:", err)
        setLoadError(true)
        toast.error(t("error_audio"))
      }
    }

    const handleError = (err: Error) => {
      console.error("WaveSurfer error:", err)
      setLoadError(true)
      toast.error(t("error_audio"))
    }

    const handleAudioProcess = (time: number) => {
      setCurrentTime(time)
    }

    const handleFinish = () => {
      setIsPlaying(false)
    }

    waveSurfer.on('ready', handleReady)
    waveSurfer.on('error', handleError)
    waveSurfer.on('audioprocess', handleAudioProcess)
    waveSurfer.on('finish', handleFinish)

    // Load the audio with error handling
    const loadAudio = async () => {
      try {
        await waveSurfer.load(audioUrl)
      } catch (err) {
        console.error("Error loading audio:", err)
        setLoadError(true)
        toast.error(t("error_audio"))
      }
    }

    loadAudio()

    return () => {
      waveSurfer.un('ready', handleReady)
      waveSurfer.un('error', handleError)
      waveSurfer.un('audioprocess', handleAudioProcess)
      waveSurfer.un('finish', handleFinish)
      cleanupResources()
    }
  }, [audioUrl, isUser, t, retryCount])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  if (isLoading) {
    return (
        <div className="flex items-center gap-3 mb-2 rounded-lg p-2 w-fit min-w-[300px] max-w-[400px]">
          <Skeleton className="w-20 h-10 rounded-full" />
          <Skeleton className="w-[50px] h-[30px]" />
          <Skeleton className="w-full h-[30px]" />
        </div>
    )
  }

  if (loadError || !audioUrl) {
    return (
        <div className="flex items-center gap-3 mb-2 rounded-lg p-2 w-fit">
          <Button
              onClick={reloadAudio}
              variant="outline"
              className={`rounded-full p-2 ${isUser ? "bg-white hover:bg-white/80" : "bg-neutrals-muted hover:bg-neutrals-muted/80"}`}
              size="icon"
          >
            <Icons.RefreshCcw className="w-6 h-6" stroke={isUser ? "#64748b" : "white"} />
          </Button>
          <div className={`text-xs ${isUser ? "text-white/60" : "text-black/60"}`}>
            {t("error_audio")}
          </div>
        </div>
    )
  }

  return (
      <div className="flex items-center gap-3 mb-2 rounded-lg p-2 w-fit">
        <Button
            onClick={togglePlay}
            variant="outline"
            className={`rounded-full p-2 ${isUser ? "bg-white hover:bg-white/80" : "bg-neutrals-muted hover:bg-neutrals-muted/80"}`}
            size="icon"
        >
          {isPlaying ? (
              <Icons.Pause className="w-6 h-6" stroke={isUser ? "#64748b" : "white"} />
          ) : (
              <Icons.Play className="w-6 h-6" stroke={isUser ? "#64748b" : "white"} />
          )}
        </Button>
        <div className={`text-xs mt-1 ${isUser ? "text-white/60" : "text-black/60"}`}>
          {isPlaying && currentTime > 0
              ? `${formatTime(currentTime)} / ${formatTime(duration)}`
              : `${formatTime(duration)}`}
        </div>
        <div className="flex flex-col">
          <div className="flex-grow" style={{ minWidth: "200px", maxWidth: "200px" }}>
            <div ref={waveformRef} className="w-full" />
          </div>
        </div>
      </div>
  )
}

export default AudioMedia