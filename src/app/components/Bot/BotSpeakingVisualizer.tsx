"use client"

import { useEffect, useRef } from 'react'

interface AudioVisualizerProps {
  stream: MediaStream | null
  small?: boolean
}

const BotSpeakingVisualizer = ({ stream, small = false }: AudioVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>(0)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')

    if (!canvas || !ctx) return

    // Set the correct size for the canvas
    const containerWidth = small ? 76 : 392
    const containerHeight = 76
    const dpr = window.devicePixelRatio || 1
    canvas.width = containerWidth * dpr
    canvas.height = containerHeight * dpr
    ctx.scale(dpr, dpr)

    // Set the CSS size
    canvas.style.width = `${containerWidth}px`
    canvas.style.height = `${containerHeight}px`

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

      const bufferLength = small ? 3 : 23
      const dataArray = new Uint8Array(bufferLength)
      analyserRef.current.getByteFrequencyData(dataArray)

      ctx.clearRect(0, 0, containerWidth, containerHeight)

      const barWidth = small ? 3 : 5
      const barGap = small ? 4 : 8
      const centerX = containerWidth / 2
      const centerY = containerHeight / 2

      dataArray.forEach((value, index) => {
        const barHeight = Math.max((value / 255) * containerHeight * 0.7, small ? 5 : 10)
        
        const leftX = centerX - (index + 1) * (barWidth + barGap) + barGap / 2
        const rightX = centerX + index * (barWidth + barGap) + barGap / 2

        ctx.fillStyle = 'white'
        
        ctx.beginPath()
        ctx.roundRect(
          leftX,
          centerY - barHeight / 2,
          barWidth,
          barHeight,
          barWidth / 1.5
        )
        ctx.fill()

        ctx.beginPath()
        ctx.roundRect(
          rightX,
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
      if (!ctx) return
      
      ctx.clearRect(0, 0, containerWidth, containerHeight)
      
      const bufferLength = small ? 3 : 23 
      const barWidth = small ? 5 : 5
      const barGap = small ? 4 : 8
      const centerX = containerWidth / 2
      const centerY = containerHeight / 2
      const totalWidth = bufferLength * barWidth + (bufferLength - 1) * barGap

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = small ? 5 : 10
        const leftX = centerX - (i + 1) * (barWidth + barGap) + barGap / 2
        const rightX = centerX + i * (barWidth + barGap) + barGap / 2

        ctx.fillStyle = 'white'
        
        ctx.beginPath()
        ctx.roundRect(
          leftX,
          centerY - barHeight / 2,
          barWidth,
          barHeight,
          barWidth / 1.5
        )
        ctx.fill()

        ctx.beginPath()
        ctx.roundRect(
          rightX,
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
  }, [stream, small])
  

  const containerClasses = small
    ? "w-[76px] h-[76px] bg-gradient-to-r from-[#0284C7] to-[#77BAAA] overflow-hidden rounded-lg"
    : "w-full h-20 flex justify-center items-center bg-gradient-to-r from-[#0284C7] to-[#77BAAA] overflow-hidden rounded-lg"

  return (
    <div className={containerClasses}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}

export default BotSpeakingVisualizer;

