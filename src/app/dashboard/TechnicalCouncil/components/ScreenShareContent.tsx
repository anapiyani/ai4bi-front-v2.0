"use client"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Monitor, RefreshCw, X } from "lucide-react"
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from "react"

type ScreenSource = {
  id: string
  name: string
  thumbnail: string
  type: "screen" | "window"
}

export default function ScreenSharing() {
  const t = useTranslations("dashboard")
  const [isSharing, setIsSharing] = useState(false)
  const [availableSources, setAvailableSources] = useState<ScreenSource[]>([])
  const [selectedSource, setSelectedSource] = useState<ScreenSource | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [browserSupportsSelection, setBrowserSupportsSelection] = useState(true)
  const [browserName, setBrowserName] = useState("")
  const videoRef = useRef<HTMLVideoElement>(null)
  const [previewVisible, setPreviewVisible] = useState(true)
  const [streamActive, setStreamActive] = useState(false)
  const [videoStats, setVideoStats] = useState({ readyState: 0, width: 0, height: 0 })
  const [errorMessage, setErrorMessage] = useState("")
  const currentStreamRef = useRef<MediaStream | null>(null) // will send to the webRTC

  // Detect browser
  useEffect(() => {
    const userAgent = navigator.userAgent
    let browser = "Unknown"

    if (userAgent.indexOf("Chrome") > -1) {
      browser = "Chrome"
      setBrowserSupportsSelection(true)
    } else if (userAgent.indexOf("Firefox") > -1) {
      browser = "Firefox"
      setBrowserSupportsSelection(true)
    } else if (userAgent.indexOf("Safari") > -1) {
      browser = "Safari"
      setBrowserSupportsSelection(false)
    } else if (userAgent.indexOf("Edge") > -1 || userAgent.indexOf("Edg") > -1) {
      browser = "Edge"
      setBrowserSupportsSelection(true)
    }

    setBrowserName(browser)
  }, [])

  useEffect(() => {
    if (!isSharing) return

    const interval = setInterval(() => {
      if (videoRef.current) {
        setVideoStats({
          readyState: videoRef.current.readyState,
          width: videoRef.current.videoWidth,
          height: videoRef.current.videoHeight,
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isSharing])

  useEffect(() => {
    return () => {
      if (currentStreamRef.current) {
        currentStreamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  useEffect(() => {
    if (isDialogOpen && !browserSupportsSelection) {
      const mockScreens: ScreenSource[] = [
        {
          id: "screen-1",
          name: "Main Display",
          thumbnail: "/placeholder.svg?height=180&width=320",
          type: "screen",
        },
        {
          id: "screen-2",
          name: "Secondary Display",
          thumbnail: "/placeholder.svg?height=180&width=320",
          type: "screen",
        },
      ]

      const mockWindows: ScreenSource[] = [
        {
          id: "window-1",
          name: "Browser - Current Tab",
          thumbnail: "/placeholder.svg?height=180&width=320",
          type: "window",
        },
        {
          id: "window-2",
          name: "Code Editor",
          thumbnail: "/placeholder.svg?height=180&width=320",
          type: "window",
        },
        {
          id: "window-3",
          name: "Media Player",
          thumbnail: "/placeholder.svg?height=180&width=320",
          type: "window",
        },
        {
          id: "window-4",
          name: "Chat Application",
          thumbnail: "/placeholder.svg?height=180&width=320",
          type: "window",
        },
      ]

      setAvailableSources([...mockScreens, ...mockWindows])
    }
  }, [isDialogOpen, browserSupportsSelection])

  const startSharing = async () => {
    try {
      setErrorMessage("")

      if (browserSupportsSelection) {
        setIsDialogOpen(false)
        setTimeout(async () => {
          try {
            const stream = await navigator.mediaDevices?.getDisplayMedia({
              video: true, 
              audio: false,
            })
            currentStreamRef.current = stream
            setIsSharing(true)
            setTimeout(() => {
              handleStream(stream)
            }, 100)
          } catch (error) {
            console.error("Error in delayed sharing:", error)
            setErrorMessage(error instanceof Error ? error.message : t('unknown_error_occurred'))
            setIsSharing(false)
          }
        }, 100)
      } else {
        if (!selectedSource) {
          toast({
            title: t('error'),
            description: t('please_select_a_screen_or_application_to_share'),
            variant: "destructive",
          })
          return
        }

        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true, 
          audio: false,
        })
        currentStreamRef.current = stream

        handleStream(stream)
      }
    } catch (error) {
      console.error("Error sharing screen:", error)
      setErrorMessage(error instanceof Error ? error.message : t('unknown_error_occurred'))
      toast({
        title: t('error'),
        description: t('failed_to_start_screen_sharing'),
        variant: "destructive",
      })
    }
  }

  const handleStream = (stream: MediaStream) => {
    const videoTrack = stream?.getVideoTracks()[0]

    if (!videoTrack) {
      setErrorMessage(t('no_video_track_found_in_the_stream'))
      toast({
        title: t('error'),
        description: t('no_video_track_found_in_the_stream'),
        variant: "destructive",
      })
      return
    }

    const settings = videoTrack?.getSettings()
    console.log("Applied settings:", settings)

    if (videoRef.current) {
      if (videoRef.current.srcObject) {
        const oldStream = videoRef.current.srcObject as MediaStream
        oldStream.getTracks().forEach((track) => track.stop())
        videoRef.current.srcObject = null
      }

      videoRef.current.srcObject = stream
      setStreamActive(true)

      const playVideo = () => {
        if (videoRef.current) {
          videoRef.current
            .play()
            .then(() => {
              console.log("Video playing successfully")
              if (videoRef.current) {
                setVideoStats({
                  readyState: videoRef.current.readyState,
                  width: videoRef.current.videoWidth,
                  height: videoRef.current.videoHeight,
                })
              }
            })
            .catch((err) => {
              console.error("Error playing video:", err)
              setTimeout(playVideo, 500)
            })
        }
      }

      videoRef.current.onloadedmetadata = () => {
        console.log("Video metadata loaded")
        playVideo()
      }
      videoRef.current.onerror = (e) => {
        console.error("Video element error:", e)
        setErrorMessage(`Video element error: ${videoRef.current?.error?.message || "Unknown error"}`)
      }
    }

    if (videoTrack) {
      videoTrack.onended = () => {
        stopSharing()
      }
    }

    setIsSharing(true)
    setIsDialogOpen(false)
  }

  const stopSharing = () => {
    if (currentStreamRef.current) {
      currentStreamRef.current.getTracks().forEach((track) => track.stop())
      currentStreamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setIsSharing(false)
    setSelectedSource(null)
    setStreamActive(false)
    setVideoStats({ readyState: 0, width: 0, height: 0 })
    setErrorMessage("")
  }

  const getSourcesByType = (type: "screen" | "window") => {
    return availableSources.filter((source) => source.type === type)
  }

  const togglePreview = () => {
    setPreviewVisible(!previewVisible)
  }

  const retryConnection = () => {
    if (currentStreamRef.current) {
      currentStreamRef.current.getTracks().forEach((track) => track.stop())
      currentStreamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setStreamActive(false)
    setVideoStats({ readyState: 0, width: 0, height: 0 })
    setErrorMessage("")

    startSharing()
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{t('demonstration')}</h2>

          <div className="gap-2 hidden lg:flex md:flex">
            {!isSharing ? (
              <Button onClick={startSharing}>{t('start_demonstration')}</Button>
            ) : (
              <Button variant="destructive" onClick={stopSharing}>
                {t('stop_demonstration')}
              </Button>
            )}
          </div>
        </div>

        {(previewVisible || !isSharing) && (
          <div className="relative rounded-lg overflow-hidden border bg-card min-h-[300px] flex items-center justify-center">
            {isSharing ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-auto"
                  style={{ background: "#f0f0f0" }}
                />

                {/* Show error message if there's an issue */}
                {(errorMessage || videoStats.width === 0) && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white p-4 text-center">
                    <p className="mb-2">{errorMessage || t('screen_capture_not_displaying_properly')}</p>
                    <Button
                      variant="outline"
                      onClick={retryConnection}
                      className="bg-white/20 hover:bg-white/30 text-white border-white/50"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {t('retry_connection')}
                    </Button>
                  </div>
                )}

                <Button variant="destructive" size="sm" className="absolute bottom-4 right-4" onClick={stopSharing}>
                  <X className="h-4 w-4 mr-2" />
                  {t('stop_demonstration')}
                </Button>
              </>
            ) : (
              <div className="text-center p-6">
                <Monitor className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">{t('click_start_demonstration')}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

