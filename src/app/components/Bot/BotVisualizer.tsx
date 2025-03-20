import botListening from "@/public/assets/bot/botListening.json"
import botProgress from "@/public/assets/bot/botProgess.json"
import lottie from 'lottie-web'
import { useEffect, useRef } from 'react'
interface AudioVisualizerProps {
	type?: "speaking" | "progress" | "default" | "listening" | "user-paused"
  stream: MediaStream | null
  small?: boolean
  userSpeaking?: boolean
  recordingDuration?: number
	longAF?: boolean
}

const BotVisualizer = ({ type = "default", stream, small = false, userSpeaking = false, recordingDuration = 0, longAF }: AudioVisualizerProps) => {
	switch (type) {
		case "speaking":
			const BotSpeaking = ({ stream, small = false }: AudioVisualizerProps) => {
				const canvasRef = useRef<HTMLCanvasElement>(null)
				const animationFrameRef = useRef<number>(0)
					const audioContextRef = useRef<AudioContext | null>(null)
					const analyserRef = useRef<AnalyserNode | null>(null)
				
					useEffect(() => {
						const canvas = canvasRef.current
						const ctx = canvas?.getContext('2d')
				
						if (!canvas || !ctx) return
			
						const containerWidth = small
						? 76
						: userSpeaking
						? 785
						: 392
						const containerHeight = userSpeaking ? 47 : 76
						const dpr = window.devicePixelRatio || 1
						canvas.width = containerWidth * dpr
						canvas.height = containerHeight * dpr
						ctx.scale(dpr, dpr)
				
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
				
							const bufferLength = small ? 3 : userSpeaking ? 30 : 23
							const dataArray = new Uint8Array(bufferLength)
							analyserRef.current.getByteFrequencyData(dataArray)
				
							ctx.clearRect(0, 0, containerWidth, containerHeight)
				
							const barWidth = small ? 3 : userSpeaking ? 3 : 5
							const barGap = small ? 4 : userSpeaking ? 8 : 8
							const centerX = containerWidth / 2
							const centerY = containerHeight / 2
				
							dataArray.forEach((value, index) => {
								const barHeight = Math.max((value / 255) * containerHeight * 0.7, small ? 5 : userSpeaking ? 4 : 10)
								
								const leftX = centerX - (index + 1) * (barWidth + barGap) + barGap / 2
								const rightX = centerX + index * (barWidth + barGap) + barGap / 2
				
								ctx.fillStyle = userSpeaking ? '#737373' : 'white'
								
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
				
								ctx.fillStyle = userSpeaking ? '#737373' : 'white'
								
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
					
					return (
						<div
						className={
							"flex justify-center items-center overflow-hidden p-px rounded-lg " +
							(userSpeaking
								? "w-full h-[40px] bg-white relative" 
								: small
								? "w-[76px] h-[76px] bg-gradient-to-r from-[#F96D31] to-[#FFBA6A]" 
								: "w-full h-20 bg-gradient-to-r from-[#F96D31] to-[#FFBA6A]" + (longAF ? " h-full" : "")
							)
						}
					>
						<canvas ref={canvasRef} className="w-full h-full" />
						{userSpeaking && (
								<p className="text-xs text-muted-foreground absolute bottom-3 right-3">
									{
										`${Math.floor(recordingDuration / 60000).toString().padStart(2, '0')}:` +
										`${Math.floor((recordingDuration % 60000) / 1000).toString().padStart(2, '0')}`
									}
								</p>
							)}
					</div>
					)
			}

			return <BotSpeaking stream={stream} small={small} />;
		case "progress":
			const BotProgress = ({ small }: { small?: boolean }) => {
				const lottieRef = useRef<HTMLDivElement>(null)

				useEffect(() => {
					const instance = lottie.loadAnimation({
						container: lottieRef.current as Element,
						renderer: 'svg',
						loop: true,
						autoplay: true,
						animationData: botProgress
					})

					return () => instance.destroy()
				}, [])

				return (
					<div className={"flex justify-center items-center bg-gradient-to-r from-[#F96D31] to-[#FFBA6A] overflow-hidden relative p-px rounded-lg " + (small ? "w-[76px] h-[76px]" : "w-full h-20" + (longAF ? " h-full" : ""))}>
						<div ref={lottieRef} className={small ? "w-[76px] h-[76px]" : "w-full h-40"}></div>
						{userSpeaking && (
							<span className="text-xs text-muted-foreground absolute bottom-3 right-2">
								{
									`${Math.floor(recordingDuration / 60000).toString().padStart(2, '0')}:` +
									`${Math.floor((recordingDuration % 60000) / 1000).toString().padStart(2, '0')}`
								}
							</span>
						)}
					</div>
				)
			}
			return <BotProgress small={small} />;
		case "listening":
			const BotListening = ({ small }: { small?: boolean }) => {
				const lottieRef = useRef<HTMLDivElement>(null)

				useEffect(() => {
					const instance = lottie.loadAnimation({
						container: lottieRef.current as Element,
						renderer: 'svg',
						loop: true,
						autoplay: true,
						animationData: botListening
					})

					instance.resize();
					return () => instance.destroy()
				})

				return (
					<div className={"flex justify-center items-center bg-gradient-to-r from-[#F96D31] to-[#FFBA6A] overflow-hidden p-px rounded-lg " + (small ? "w-[76px] h-[76px]" : "w-full h-20" + (longAF ? " h-full" : ""))}>
						<div ref={lottieRef} className={small ? "w-[76px] h-[76px]" : "w-full h-40"}></div>
					</div>
				)
			}
			return <BotListening small={small} />;
		case "user-paused":
			const BotUserPaused = ({ small }: { small?: boolean }) => {
				return (
					<div className='flex justify-center items-center bg-white overflow-hidden p-px rounded-lg h-10 w-full gap-1 px-14 relative'>
						{
							Array(65).fill('.').map((dot, i) => (
								<span key={i} className="text-muted-foreground flex items-center justify-center h-full w-full">
									<span className="w-[3px] h-1 bg-muted-foreground rounded-full"></span>
								</span>
							))
						}
						{userSpeaking && (
							<p className="text-xs text-muted-foreground absolute bottom-3 right-3">
								{
									`${Math.floor(recordingDuration / 60000).toString().padStart(2, '0')}:` +
									`${Math.floor((recordingDuration % 60000) / 1000).toString().padStart(2, '0')}`
								}
							</p>
						)}
					</div>
				)
			}
			return <BotUserPaused small={small} />;

		case "default":
		default:
			const BotDefault = ({ small }: { small?: boolean }) => {
				return (
					<div className={"flex justify-center items-center bg-gradient-to-r from-[#F96D31] to-[#FFBA6A] overflow-hidden p-px rounded-lg " + (small ? "w-[76px] h-[76px]" : "w-full h-20" + (longAF ? " h-full" : ""))}>
						<div className='w-full border-y-[1px] border-white'></div>
					</div>
				)
			}

			return <BotDefault small={small} />;
	}
}

export default BotVisualizer