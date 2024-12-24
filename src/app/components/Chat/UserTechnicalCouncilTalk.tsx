import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Stream } from 'stream'

const UserTechnicalCouncilTalk = ({
	name,
	pfp,
	isMicrophoneOn,
	turnOffTheMicrophone,
	turnOnTheMicrophone,
	isAbsent,
	userStream,
	t,
	LocalUser,
}: {
	name: string;
	pfp?: string;
	isMicrophoneOn: boolean;
	turnOffTheMicrophone: () => void;
	turnOnTheMicrophone: () => void;
	isAbsent: boolean;
	userStream: Stream | null;
	t: any;
	LocalUser?: boolean;
}) => {
	return (
		<div className='flex justify-between'>
			<div className='flex gap-2 items-center'>
				<div className='flex'>
					{
						pfp ? <img className='rounded-full' src={pfp} alt={name} width={40} height={40} /> : <div className='w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-primary font-bold text-base'>{name.slice(0,2)}</div>
					}
				</div>
				<div className='flex ml-3 items-center'>
					<p className='text-sm font-medium text-secondary-foreground'>{name}</p>
					{
						isMicrophoneOn ? <div className='w-1 h-1 bg-[#22C55E] rounded-full ml-2'>
						</div> : <div className='w-1 h-1 bg-[#CE0900] rounded-full ml-2'></div>
					}
				</div>
				<div>
					{
						isMicrophoneOn ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M5.33203 14H10.6654" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
							<path d="M8 12V14" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
							<path d="M10.6654 4.28571C10.6654 3.02335 9.47146 2 7.9987 2C6.52594 2 5.33203 3.02335 5.33203 4.28571V7.71429C5.33203 8.97665 6.52594 10 7.9987 10C9.47146 10 10.6654 8.97665 10.6654 7.71429V4.28571Z" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
							<path d="M3.33203 7.33325C3.33203 9.91059 5.42136 11.9999 7.9987 11.9999C10.576 11.9999 12.6654 9.91059 12.6654 7.33325" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
 							: 
							<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M5.33203 14H10.6654" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
								<path d="M8 12V14" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
								<path d="M5.33333 7.71429V4.28571C5.33333 3.02335 6.52724 2 8 2C8.87238 2 9.64692 2.35907 10.1334 2.91418M3.33333 7.33333C3.33333 8.03086 3.48637 8.69264 3.76069 9.28693M12.6667 7.33333C12.6667 9.91067 10.5773 12 8 12C6.88112 12 5.8542 11.6062 5.05028 10.9497M2 14L5.05028 10.9497M14 2L10.6667 5.33333M10.6667 5.33333V7.71429C10.6667 8.97665 9.47276 10 8 10C7.41524 10 6.87445 9.83867 6.43489 9.56511M10.6667 5.33333L6.43489 9.56511M6.43489 9.56511L5.05028 10.9497" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
					}
				</div>
			</div>
			<div className='flex items-center gap-4'>
				<p className='text-sm text-muted-foreground'>{isAbsent && t("absent")}</p>
				{
					!LocalUser && (
						<DropdownMenu>
							<DropdownMenuTrigger>
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M16 12.25V11.75" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
								<path d="M12 12.25V11.75" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
								<path d="M8 12.25V11.75" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
							</DropdownMenuTrigger>
							<DropdownMenuContent className='bg-primary-foreground'>
								<div className='flex items-center flex-col gap-2 w-full'>
									{
										isAbsent && <Button variant="ghost" className='text-sm text-muted-foreground w-full'>{t("call-again")}</Button>
									}
									<Button variant="ghost" className='text-sm text-muted-foreground w-full'>{t("turn-off-microphone")}</Button>
									<Button variant="ghost" className='text-sm text-muted-foreground w-full text-destructive'>{t("delete")}</Button>
								</div>
							</DropdownMenuContent>
						</DropdownMenu>
					)
				}
			</div>
		</div>
	)
}

export default UserTechnicalCouncilTalk;