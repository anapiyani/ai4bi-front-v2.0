import { Button } from '@/components/ui/button'
import React from 'react'
import Icons from '../components/Icons'


export const AudioPlayer = ({ src, isUser, name }: { src: string; isUser: boolean; name: string }) => {
	const [isPlaying, setIsPlaying] = React.useState(false)
  const [currentTime, setCurrentTime] = React.useState(0)
  const [duration, setDuration] = React.useState(0)
  const audioRef = React.useRef<HTMLAudioElement>(null)
  const [waveformHeights] = React.useState(() =>
    Array.from({ length: 20 }, () => Math.random() * 20 + 10)
  )

	const togglePlayPause = () => {
		if (!audioRef.current) return
		if (isPlaying) {
			audioRef.current.pause()
		} else {
			audioRef.current.play()
		}
		setIsPlaying(!isPlaying)
	}

	const handleTimeUpdate = () => {
		if (!audioRef.current) return
		setCurrentTime(audioRef.current.currentTime)
	}

	const handleLoadedMetadata = () => {
		setDuration(audioRef.current?.duration || 0)
	}

	const formatTime = (time: number) => {
		const minutes = Math.floor(time / 60)
		const seconds = Math.floor(time % 60)
		return `${minutes}:${seconds.toString().padStart(2, '0')}`
	}
	

	return (
		<div className="flex gap-2 w-full min-w-[250px] justify-between items-center">
			<Button
				variant="outline"
					className={`rounded-full p-2 ${isUser ? 'bg-white hover:bg-white/80' : 'bg-neutrals-muted hover:bg-neutrals-muted/80'}`}
					size="icon"
					onClick={togglePlayPause}
				>
					{isPlaying ? (
						<Icons.Pause className="w-6 h-6" stroke={isUser ? '#64748b' : 'white'} />
					) : (
						<Icons.Play className="w-6 h-6" stroke={isUser ? '#64748b' : 'white'} />
					)}
				</Button>
				{
					isPlaying ? (
						<span className={`text-xs ${isUser ? 'text-white' : 'text-[#B0B3B8]'}`}>
						{formatTime(currentTime)}
						</span>
					) : (
						<span className={`text-xs ${isUser ? 'text-white' : 'text-[#B0B3B8]'}`}>
							{formatTime(duration)}
						</span>
					)
				}
				<div className="flex-1 min-w-0">
					<div className="relative h-8">
						<div className='absolute top-1/2 h-full w-full transform -translate-y-1/2'>
						<div className="flex items-center gap-[5px]">
							{waveformHeights.map((height, i) => (
								<div
									key={i}
									className="w-[3px] rounded-full bg-opacity-50"
									style={{
										height: `${height}px`,
										backgroundColor: isUser ? '#ffff' : '#737373',
									}}
								/>
							))}
						</div>
						</div>
						<div
							className="absolute top-1/2 h-full w-full transform -translate-y-1/2"
							style={{
								clipPath: `inset(0 ${100 - (currentTime / duration) * 100}% 0 0)`,
							}}
						>
							<div className="flex items-center gap-[5px]">
								{waveformHeights.map((height, i) => (
									<div
										key={i}
										className="w-[3px] rounded-full"
										style={{
											height: `${height}px`,
											backgroundColor: isUser ? '#f97316' : '#737373',
										}}
									/>
								))}
							</div>
						</div>
					</div>
				</div>
				<audio
					ref={audioRef}
					src={src} 
					onTimeUpdate={handleTimeUpdate}
					onLoadedMetadata={handleLoadedMetadata}
					onEnded={() => setIsPlaying(false)}
				/>
			</div>
	)
}