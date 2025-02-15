import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import Icons from '../../components/Icons'
import { useShowInlineAudio } from '../useUploadMedia'

const AudioMedia = ({ mediaId, name, small, t, isUser }: { mediaId: string, name: string, small: boolean | undefined, t: any, isUser: boolean }) => {
  const { data: audioBlob, isLoading } = useShowInlineAudio(mediaId)
  console.log(audioBlob);
	const audioUrl = useMemo(() => {
		if (audioBlob instanceof Blob) {
			return URL.createObjectURL(audioBlob);
		}
		return null;
	}, [audioBlob]);

  console.log(audioUrl);
  
  const waveformRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const waveSurferRef = useRef<WaveSurfer | null>(null)

  const togglePlay = useCallback(() => {
    if (!waveSurferRef.current) return
    waveSurferRef.current.playPause()
    setIsPlaying(prev => !prev)
  }, [])

	
  useEffect(() => {
    if (!audioUrl || !waveformRef.current) return
    const waveSurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: isUser ? '#ffffff80' : '#00000040',
      progressColor: isUser ? '#F97316' : '#F97316',
      height: 30,
      barWidth: 4,
      barGap: 3,
      barRadius: 3,
      cursorWidth: 0,
      normalize: true,
      fillParent: true
    })

    waveSurferRef.current = waveSurfer

    waveSurfer.load(audioUrl)

    waveSurfer.on('ready', () => {
      setDuration(waveSurfer.getDuration())
    })

    waveSurfer.on('audioprocess', (time) => {
      setCurrentTime(time)
    })

    waveSurfer.on('finish', () => {
      setIsPlaying(false)
    })

    const waveformEl = waveformRef.current
    waveformEl.addEventListener('click', togglePlay)

    return () => {
      waveSurfer.destroy()
      waveformEl.removeEventListener('click', togglePlay)
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl, isUser, togglePlay])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

	if (isLoading) {
		return (
			<div className='flex items-center gap-3 mb-2 rounded-lg p-2 w-fit min-w-[300px] max-w-[400px]'>
				<Skeleton className='w-20 h-10 rounded-full' />
				<Skeleton className='w-[50px] h-[30px]' />
				<Skeleton className='w-full h-[30px]' />
			</div>
		)
	}

  return (
    <div className='flex items-center gap-3 mb-2 rounded-lg p-2 w-fit'>
      <Button 
        onClick={togglePlay}
        variant="outline"
					className={`rounded-full p-2 ${isUser ? 'bg-white hover:bg-white/80' : 'bg-neutrals-muted hover:bg-neutrals-muted/80'}`}
					size="icon"
      >
        {isPlaying ? (
						<Icons.Pause className="w-6 h-6" stroke={isUser ? '#64748b' : 'white'} />
					) : (
						<Icons.Play className="w-6 h-6" stroke={isUser ? '#64748b' : 'white'} />
				)}
      </Button>
      <div className={`text-xs mt-1 ${isUser ? 'text-white/60' : 'text-black/60'}`}>
          {
            isPlaying && currentTime > 0 ? (
              `${formatTime(currentTime)} / ${formatTime(duration)}`
            ) : (
              `${formatTime(duration)}`
            )
          }
        </div>
      <div className='flex flex-col'>
        <div className="flex-grow" style={{ minWidth: '200px', maxWidth: '200px' }}>
          <div ref={waveformRef} className='w-full' />
        </div>
      </div>
    </div>
  )
	
}

export default AudioMedia
