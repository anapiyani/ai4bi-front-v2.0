import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import BotVisualizer from '../../components/Bot/BotVisualizer'
import UserTechnicalCouncilTalk from '../../components/Chat/UserTechnicalCouncilTalk'
import ChatContent from '../../components/ChatContent'
import useUsers from '../../hooks/useUsers'

const TechnicalCouncil = () => {
	const t = useTranslations('dashboard')
	const searchParams = useSearchParams();
	const chatId = searchParams.get('id');
	const users  = useUsers(chatId || "");

	return (
		<div className='w-full flex flex-col lg:flex-row bg-primary-foreground justify-center'>
			<aside className='w-full lg:w-1/3 bg-primary-foreground h-full px-4 lg:px-6 py-6 lg:py-6'>
				<div className='flex flex-col gap-1'>
					<p className='text-primary font-bold text-base'>{t("aray-bot")}</p>
					<BotVisualizer stream={null} type="default" /> 
				</div>
				<div className='flex flex-col m-2 py-4 px-2 rounded-lg border-2 border-transparent'>
				<UserTechnicalCouncilTalk 
					t={t}
					name={t("you")}
					isMicrophoneOn={true}
					turnOffTheMicrophone={() => {}}
					turnOnTheMicrophone={() => {}}
					isAbsent={false}
					userStream={null}
					LocalUser={true}
				 />
				</div>
				 {users.map((user) => (
					<div className='flex flex-col m-2 py-4 px-2 rounded-lg border-2 border-transparent'>
						<UserTechnicalCouncilTalk 
							t={t}
							key={user.id}
							name={user.name}
							pfp={user.pfp}
							isMicrophoneOn={user.isMicrophoneOn}
							turnOffTheMicrophone={() => {}}
							turnOnTheMicrophone={() => {}}
							isAbsent={user.isAbsent}
							userStream={user.stream}
						/>
					</div>
				 ))}	
			</aside>
			<main className='w-full lg:w-2/3 mt-6 lg:mt-6 mx-4 lg:mr-6 rounded-lg bg-secondary min-h-[calc(100vh-8rem)] py-3 lg:py-3'>
				<ChatContent chatId={chatId || ""} type="technical-council" />
			</main>
		</div>
	)
}

export default TechnicalCouncil;