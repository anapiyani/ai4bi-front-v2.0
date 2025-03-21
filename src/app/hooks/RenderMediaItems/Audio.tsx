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
  const { data: audioBlob, isLoading } = useShowInlineAudio(mediaId)
  const audioUrl = useMemo(() => {
    if (audioBlob instanceof Blob) {
      return URL.createObjectURL(audioBlob)
    }
    return null
  }, [audioBlob])

  const waveformRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const waveSurferRef = useRef<WaveSurfer | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const [loadError, setLoadError] = useState(false)

  const cleanupResources = useCallback(() => {
    if (waveSurferRef.current) {
      try {
        waveSurferRef.current.destroy()
        waveSurferRef.current = null
      } catch (err) {
        console.error("Error destroying WaveSurfer:", err)
      }
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }, [])

  const togglePlay = useCallback(() => {
    if (!waveSurferRef.current) return
    waveSurferRef.current.playPause()
    setIsPlaying((prev) => !prev)
  }, [])

  const reloadAudio = useCallback(() => {
    
  }, [])

  useEffect(() => {
    setIsPlaying(false)
    setDuration(0)
    setCurrentTime(0)
    setLoadError(false)

    cleanupResources()

    abortControllerRef.current = new AbortController()

    if (!audioUrl || !waveformRef.current) return

    let waveSurfer: WaveSurfer | null = null
    try {
      waveSurfer = WaveSurfer.create({
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
        fetchParams: {
          signal: abortControllerRef.current.signal,
        },
      })

      waveSurferRef.current = waveSurfer

      waveSurfer.on("ready", () => {
        try {
          setDuration(waveSurfer?.getDuration() || 0)
          setLoadError(false)
        } catch (err) {
          toast.error(t("error_audio"))
          setDuration(0)

        }
      })

      waveSurfer.on("error", (err) => {
        toast.error(t("error_audio"))
        setLoadError(true)
      })

      waveSurfer.on("audioprocess", (time) => {
        try {
          setCurrentTime(time)
        } catch (err) {
          toast.error(t("error_audio"))
        }
      })

      waveSurfer.on("finish", () => {
        setIsPlaying(false)
      })

      waveSurfer.load(audioUrl)

      const waveformEl = waveformRef.current
      if (waveformEl) {
        waveformEl.addEventListener("click", togglePlay)
      }

      return () => {
        if (waveformEl) {
          waveformEl.removeEventListener("click", togglePlay)
        }

        cleanupResources()

        if (audioUrl) {
          URL.revokeObjectURL(audioUrl)
        }
      }
    } catch (err) {
      console.error("Error initializing WaveSurfer:", err)
      setLoadError(true)
      return () => {
        cleanupResources()
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl)
        }
      }
    }
  }, [audioUrl, isUser, togglePlay, cleanupResources, mediaId])

  useEffect(() => {
    return () => {
      cleanupResources()
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [cleanupResources, audioUrl])

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

  if (loadError) {
    return (
      <div className="flex items-center gap-3 mb-2 rounded-lg p-2 w-fit">
        <Button
          onClick={() => {
            setLoadError(false)
            reloadAudio()
          }}
          variant="outline"
          className={`rounded-full p-2 ${isUser ? "bg-white hover:bg-white/80" : "bg-neutrals-muted hover:bg-neutrals-muted/80"}`}
          size="icon"
        >
          <Icons.RefreshCcw className="w-6 h-6" stroke={isUser ? "#64748b" : "white"} />
        </Button>
        <div className={`text-xs ${isUser ? "text-white/60" : "text-black/60"}`}>
          {
            t("error_audio")
          }
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

