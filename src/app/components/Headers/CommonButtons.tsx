import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import Icons from '../Icons'

const HeaderButtons = ({isMicrophoneOn}: {isMicrophoneOn: boolean}) => {
	const t = useTranslations("dashboard")
	
	const InfoButton = ({onClick}: {onClick?: () => void}) => (
		<Button 
			className='flex flex-col w-12 h-12 justify-center items-center p-0' 
			variant='ghost'
			onClick={onClick}
		>
			<Icons.Info />
			<p className='text-[10px] text-muted-foreground'>{t("about-auction")}</p>
		</Button>
	)
	
	const AudioButton = ({onClick}: {onClick?: () => void}) => (
		<Button 
			className='flex flex-col w-12 h-12 justify-center items-center p-0' 
			variant='ghost'
			onClick={onClick}
		>
			{isMicrophoneOn ? <Icons.MicrophoneOn /> : <Icons.MicrophoneOff />}
			<p className='text-[10px] text-muted-foreground'>{t("audio")}</p>
		</Button>
	)
	
	const ExitButton = ({
		text, 
		variant = 'ghost',
		onClick
	}: {
		text: string, 
		variant?: 'ghost' | 'destructive' | 'secondary',
		onClick?: () => void
	}) => (
		<Button 
			className='flex items-center gap-2' 
			variant={variant}
			onClick={onClick}
		>
			{text}
			<Icons.HeaderClose />
		</Button>
	)

	return { InfoButton, AudioButton, ExitButton }
}

export default HeaderButtons