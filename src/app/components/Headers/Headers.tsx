"use client"
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { activity_status } from '../../types/types'
import Icons from '../Icons'
import HeaderButtons from './CommonButtons'

type HeaderProps = {
	type: activity_status,
	t: ReturnType<typeof useTranslations>,
	handlers: {
		infoButtonClick: () => void,
		audioButtonClick: () => void,
		exitButtonClick: (type: activity_status) => void
	}
	isMicrophoneOn: boolean
}

const commonHeaderClasses = 'w-full h-20 flex items-center justify-between m-0 px-20'
const commonTitleClasses = 'text-lg font-semibold'

const Header = ({type, t, handlers, isMicrophoneOn}: HeaderProps) => {
	const { InfoButton, AudioButton, ExitButton } = HeaderButtons({isMicrophoneOn});
	const HeaderContent = () => {
		switch(type) {
			case "auction":
				return (
					<div className={`${commonHeaderClasses} bg-slate-100`}>
						<div className='flex items-center gap-2'>
							<div><Icons.Radio /></div>
							<h2 className={`${commonTitleClasses} text-secondary-foreground`}>
								{t("auction-in-progress")}
							</h2>
						</div>
						<div className='flex items-center gap-4'>
							<InfoButton onClick={handlers.infoButtonClick} />
							<AudioButton onClick={handlers.audioButtonClick} />
							<ExitButton 
								text={t("leave-auction")} 
								variant="destructive"
								onClick={() => handlers.exitButtonClick(type)}
							/>
						</div>
					</div>
				)

			case "technical-council":
				return (
					<div className={`${commonHeaderClasses} bg-slate-100`}>
						<div className='flex items-center gap-2'>
							<div><Icons.Radio /></div>
							<h2 className={`${commonTitleClasses} text-secondary-foreground`}>
								{t("technical-council")}
							</h2>
						</div>
						<div className='flex items-center gap-4'>
							<AudioButton onClick={handlers.audioButtonClick} />
							<ExitButton 
								text={t("leave-technical-council")}
								variant="destructive" 
								onClick={() => handlers.exitButtonClick(type)}
							/>
						</div>
					</div>
				)

			case "chat":
				return (
					<div className={`${commonHeaderClasses} bg-muted-foreground`}>
						<div className='flex items-center gap-2'>
							<div><Icons.Data /></div>
							<h2 className={`${commonTitleClasses} text-white`}>
								{t("chat-mode")}
							</h2>
						</div>
						<div className='flex items-center gap-2'>
							<Button className='flex items-center gap-2' variant='secondary' onClick={() => handlers.exitButtonClick(type)}>
								{t("exit-chat-mode")}
								<Icons.Exit />
							</Button>
						</div>
					</div>
				)

			case "auction-results":
				return (
					<div className={`${commonHeaderClasses} bg-slate-100`}>
						<div className='flex items-center gap-2'>
							<div><Icons.Results /></div>
							<h2 className={`${commonTitleClasses} text-secondary-foreground`}>
								{t("auction-results")}
							</h2>
						</div>
						<div className='flex items-center gap-4'>
							<InfoButton onClick={handlers.infoButtonClick} />
							<Button className='flex items-center gap-2' variant='ghost' onClick={() => handlers.exitButtonClick(type)}>
								{t("go-back-chat-mode")}
								<Icons.Exit />
							</Button>
						</div>
					</div>
				)
		}
	}

	return <HeaderContent />
}

export default Header;