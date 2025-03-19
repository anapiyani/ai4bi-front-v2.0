"use client"
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { activity_status, TechCouncilUser } from '../../types/types'
import TechnicalCouncilLeaveButton from '../ExitPopUps/TechnicalCouncilPopup'
import Icons from '../Icons'
import HeaderButtons from './CommonButtons'
import LocaleSwitcher from './LocaleSwitcher'
import Notifications from './Notifications'

type HeaderProps = {
	type: activity_status,
	t: ReturnType<typeof useTranslations>,
	handlers: {
		infoButtonClick: () => void,
		audioButtonClick: () => void,
		exitButtonClick: (type: activity_status, isFinish?: boolean) => void,
	}
	techCouncilUser: TechCouncilUser | null
	isMicrophoneOn: boolean
}

const commonHeaderClasses = 'w-full h-20 flex items-center justify-between m-0 px-2 lg:px-20 md:px-20'
const commonTitleClasses = 'font-semibold text-sm lg:text-lg md:text-lg'

const Header = ({type, t, handlers, isMicrophoneOn, techCouncilUser}: HeaderProps) => {
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
							<h2 className={`${commonTitleClasses} text-brand-gray`}>
								{t("technical-council")}
							</h2>
						</div>
						<div className='flex items-center gap-4'>
							<AudioButton onClick={handlers.audioButtonClick} />
							<TechnicalCouncilLeaveButton
								handlers={{
									stayButtonClick: () => {},
									exitButtonClick: (isFinish?: boolean) => {
										handlers.exitButtonClick(type, isFinish)
									},
								}}
								techCouncilUser={techCouncilUser}
							/>
						</div>
					</div>
				)

			case "chat":
				return (
					<div className={`${commonHeaderClasses} bg-brand-gray`}>
						<div className='flex items-center gap-2'>
							<div><Icons.Data /></div>
							<h2 className={`${commonTitleClasses} text-white`}>
								{t("chat-mode")}
							</h2>
						</div>
						<div className='flex items-center gap-2'>
							<Notifications t={t} />
							<LocaleSwitcher />
							<Button className='flex items-center gap-2' variant='secondary' onClick={() => handlers.exitButtonClick(type)}>
								<p className='hidden lg:block md:block'>{t("exit-chat-mode")}</p>
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