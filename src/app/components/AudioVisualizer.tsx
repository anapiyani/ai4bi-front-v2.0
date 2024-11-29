"use client"

import { useEffect, useRef } from 'react'

interface AudioVisualizerProps {
  stream: MediaStream | null
}

export default function AudioVisualizer({ stream }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>(0)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')

    if (!canvas || !ctx) return

    const setupAudioContext = () => {
      if (!stream) return

      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)
      analyserRef.current.fftSize = 64
    }

    const draw = () => {
      if (!ctx || !analyserRef.current) return

      const bufferLength = analyserRef.current.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      analyserRef.current.getByteFrequencyData(dataArray)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const barWidth = 5
      const barGap = 8
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      dataArray.forEach((value, index) => {
        const barHeight = Math.max((value / 255) * canvas.height * 0.7, 10)
        const x = centerX + (index - bufferLength / 2) * (barWidth + barGap)
				
        ctx.fillStyle = 'white'
        ctx.beginPath()
        ctx.roundRect(
          x,
          centerY - barHeight / 2,
          barWidth,
          barHeight,
          barWidth / 1.5
        )
        ctx.fill()
      })

      animationFrameRef.current = requestAnimationFrame(draw)
    }

    const drawStatic = () => {
      if (!ctx || !canvas) return
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const bufferLength = 32 
      const barWidth = 5
      const barGap = 8
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = 10
        const x = centerX + (i - bufferLength / 2) * (barWidth + barGap)

        ctx.fillStyle = 'white'
        ctx.beginPath()
        ctx.roundRect(
          x,
          centerY - barHeight / 2,
          barWidth,
          barHeight,
          barWidth / 1.5
        )
        ctx.fill()
      }
    }

    if (stream) {
      setupAudioContext()
      draw()
    } else {
      drawStatic()
    }

    return () => {
      cancelAnimationFrame(animationFrameRef.current)
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [stream])

  return (
    <div className="w-full h-20 bg-gradient-to-r from-[#0284C7] to-[#77BAAA] rounded-full overflow-hidden">
      <canvas ref={canvasRef} width={600} height={80} className="w-full h-full" />
    </div>
  )
}

