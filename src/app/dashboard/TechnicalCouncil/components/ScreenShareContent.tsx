"use client"

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from '@/components/ui/use-toast'
import { Check, Info, Layout, Monitor, Settings, X } from "lucide-react"
import Image from "next/image"; // <-- Import from next/image
import { useEffect, useRef, useState } from "react"

type ScreenSource = {
  id: string
  name: string
  thumbnail: string
  type: "screen" | "window"
}

type QualityPreset = {
  width: number
  height: number
  frameRate: number
  label: string
}

const QUALITY_PRESETS: Record<string, QualityPreset> = {
  "480p-15": { width: 854, height: 480, frameRate: 15, label: "480p (15 fps)" },
  "480p-30": { width: 854, height: 480, frameRate: 30, label: "480p (30 fps)" },
  "720p-15": { width: 1280, height: 720, frameRate: 15, label: "720p (15 fps)" },
  "720p-30": { width: 1280, height: 720, frameRate: 30, label: "720p (30 fps)" },
  "720p-60": { width: 1280, height: 720, frameRate: 60, label: "720p (60 fps)" },
  "1080p-30": { width: 1920, height: 1080, frameRate: 30, label: "1080p (30 fps)" },
  "1080p-60": { width: 1920, height: 1080, frameRate: 60, label: "1080p (60 fps)" },
}

export default function ScreenSharing() {
  const [isSharing, setIsSharing] = useState(false)
  const [availableSources, setAvailableSources] = useState<ScreenSource[]>([])
  const [selectedSource, setSelectedSource] = useState<ScreenSource | null>(null)
  const [selectedQuality, setSelectedQuality] = useState("720p-30")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [browserSupportsSelection, setBrowserSupportsSelection] = useState(true)
  const [browserName, setBrowserName] = useState("")
  const videoRef = useRef<HTMLVideoElement>(null)

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

  // Mock data for screen sources (only used if browser doesn't have built-in UI)
  useEffect(() => {
    if (isDialogOpen && !browserSupportsSelection) {
      // In a real implementation, we would get actual thumbnails from the system
      // For this demo, we'll use placeholder images
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
      const quality = QUALITY_PRESETS[selectedQuality]

      // For browsers with built-in screen selection UI
      if (browserSupportsSelection) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            // Apply quality constraints
            width: { ideal: quality.width },
            height: { ideal: quality.height },
            frameRate: { ideal: quality.frameRate },
          },
          audio: false,
        })

        handleStream(stream)
      }
      // For browsers without built-in UI or if we want to use our custom UI
      else {
        if (!selectedSource) {
          toast({
            title: "Error",
            description: "Please select a screen or application to share",
            variant: "destructive",
          })
          return
        }

        // In a real implementation, we would use the selected source ID
        // This is a simplified version that still uses getDisplayMedia
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            width: { ideal: quality.width },
            height: { ideal: quality.height },
            frameRate: { ideal: quality.frameRate },
          },
          audio: false,
        })

        handleStream(stream)
      }
    } catch (error) {
      console.error("Error sharing screen:", error)
      toast({
        title: "Error",
        description: "Failed to start screen sharing",
        variant: "destructive",
      })
    }
  }

  const handleStream = (stream: MediaStream) => {
    // Get actual constraints that were applied
    const videoTrack = stream.getVideoTracks()[0]
    const settings = videoTrack.getSettings()
    console.log("Applied settings:", settings)

    // Set the stream to the video element
    if (videoRef.current) {
      videoRef.current.srcObject = stream
    }

    // Listen for the end of the stream
    videoTrack.onended = () => {
      stopSharing()
    }

    setIsSharing(true)
    setIsDialogOpen(false)
  }

  const stopSharing = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setIsSharing(false)
    setSelectedSource(null)
  }

  const getSourcesByType = (type: "screen" | "window") => {
    return availableSources.filter((source) => source.type === type)
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Screen Sharing</h2>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className='lg:flex hidden'
                variant={isSharing ? "destructive" : "default"}
                onClick={() => (isSharing ? stopSharing() : null)}
              >
                {isSharing ? "Stop Sharing" : "Share Your Screen"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] bg-white">
              <DialogHeader>
                <DialogTitle>Screen Share Settings</DialogTitle>
              </DialogHeader>

              {browserSupportsSelection ? (
                <div className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      {browserName} will show you a screen selection dialog after you click &quot;Start Sharing&quot;.
                    </AlertDescription>
                  </Alert>

                  <div className="flex items-center justify-between p-3 rounded-md border">
                    <div className="flex items-center">
                      <Settings className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Stream Quality</span>
                    </div>

                    <Select value={selectedQuality} onValueChange={setSelectedQuality}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select quality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="480p-15">480p (15 fps)</SelectItem>
                        <SelectItem value="480p-30">480p (30 fps)</SelectItem>
                        <SelectItem value="720p-15">720p (15 fps)</SelectItem>
                        <SelectItem value="720p-30">720p (30 fps)</SelectItem>
                        <SelectItem value="720p-60">720p (60 fps)</SelectItem>
                        <SelectItem value="1080p-30">1080p (30 fps)</SelectItem>
                        <SelectItem value="1080p-60">1080p (60 fps)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={startSharing}>Start Sharing</Button>
                  </div>
                </div>
              ) : (
                // Custom UI for browsers without built-in screen selection
                <>
                  <Tabs defaultValue="screens" className="mt-4">
                    <TabsList className="mb-4">
                      <TabsTrigger value="screens">
                        <Monitor className="h-4 w-4 mr-2" />
                        Screens
                      </TabsTrigger>
                      <TabsTrigger value="applications">
                        <Layout className="h-4 w-4 mr-2" />
                        Applications
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="screens" className="mt-0">
                      <div className="grid grid-cols-2 gap-4">
                        {getSourcesByType("screen").map((screen) => (
                          <div
                            key={screen.id}
                            className={`relative rounded-md overflow-hidden cursor-pointer border-2 ${
                              selectedSource?.id === screen.id ? "border-primary" : "border-transparent"
                            }`}
                            onClick={() => setSelectedSource(screen)}
                          >
                            <Image
                              src={screen.thumbnail || "/placeholder.svg"}
                              alt={screen.name}
                              width={320}
                              height={180}
                              className="w-full h-auto"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 flex items-center">
                              <span className="text-sm text-white truncate flex-1">{screen.name}</span>
                              {selectedSource?.id === screen.id && <Check className="h-4 w-4 text-primary" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="applications" className="mt-0">
                      <div className="grid grid-cols-2 gap-4">
                        {getSourcesByType("window").map((window) => (
                          <div
                            key={window.id}
                            className={`relative rounded-md overflow-hidden cursor-pointer border-2 ${
                              selectedSource?.id === window.id ? "border-primary" : "border-transparent"
                            }`}
                            onClick={() => setSelectedSource(window)}
                          >
                            <Image
                              src={window.thumbnail || "/placeholder.svg"}
                              alt={window.name}
                              width={320}
                              height={180}
                              className="w-full h-auto"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 flex items-center">
                              <span className="text-sm text-white truncate flex-1">{window.name}</span>
                              {selectedSource?.id === window.id && <Check className="h-4 w-4 text-primary" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex items-center justify-between mt-4 p-3 rounded-md border">
                    <div className="flex items-center">
                      <Settings className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Stream Quality</span>
                    </div>

                    <Select value={selectedQuality} onValueChange={setSelectedQuality}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select quality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="480p-15">480p (15 fps)</SelectItem>
                        <SelectItem value="480p-30">480p (30 fps)</SelectItem>
                        <SelectItem value="720p-15">720p (15 fps)</SelectItem>
                        <SelectItem value="720p-30">720p (30 fps)</SelectItem>
                        <SelectItem value="720p-60">720p (60 fps)</SelectItem>
                        <SelectItem value="1080p-30">1080p (30 fps)</SelectItem>
                        <SelectItem value="1080p-60">1080p (60 fps)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={startSharing} disabled={!selectedSource}>
                      Start Sharing
                    </Button>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative rounded-lg overflow-hidden border bg-card min-h-[300px] flex items-center justify-center">
          {isSharing ? (
            <>
              <video ref={videoRef} autoPlay className="w-full h-auto" />
              <Button variant="destructive" size="sm" className="absolute bottom-4 right-4" onClick={stopSharing}>
                <X className="h-4 w-4 mr-2" />
                Stop Sharing
              </Button>
            </>
          ) : (
            <div className="text-center p-6">
              <Monitor className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Click &quot;Share Your Screen&quot; to begin</p>
            </div>
          )}
        </div>

        {isSharing && (
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-medium">
              Currently sharing with {QUALITY_PRESETS[selectedQuality].label} quality
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Resolution: {QUALITY_PRESETS[selectedQuality].width}x{QUALITY_PRESETS[selectedQuality].height}, Frame
              rate: {QUALITY_PRESETS[selectedQuality].frameRate} fps
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
