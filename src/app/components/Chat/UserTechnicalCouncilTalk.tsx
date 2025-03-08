// "use client"

// import { Button } from '@/components/ui/button'
// import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
// import Image from 'next/image'
// import Icons from '../Icons'

// const UserTechnicalCouncilTalk = ({
// 	name,
// 	pfp,
// 	isMicrophoneOn,
// 	turnOffTheMicrophone,
// 	turnOnTheMicrophone,
// 	isAbsent,
// 	t,
// 	LocalUser,
// }: {
// 	name: string;
// 	pfp?: string;
// 	isMicrophoneOn: boolean;
// 	turnOffTheMicrophone: () => void;
// 	turnOnTheMicrophone: () => void;
// 	isAbsent: boolean;
// 	t: any;
// 	LocalUser?: boolean;
// }) => {
// 	return (
// 		<div className={`flex justify-between relative`}>
// 			{
// 				LocalUser && (
// 					<span className="absolute right-0 h-full rounded-full w-1 bg-primary"></span>
// 				)
// 			}
// 			<div className='flex gap-2 items-center'>
// 				<div className='flex'>
// 					{
// 						pfp ? <Image className='rounded-full' src={pfp} alt={name} width={40} height={40} /> : <div className='w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-primary font-bold text-base'>{name.slice(0,2)}</div>
// 					}
// 				</div>
// 				<div className='flex ml-3 items-center'>
// 					<p className='text-sm font-medium text-secondary-foreground'>{name}</p>
// 					{
// 						isMicrophoneOn ? <div className='w-1 h-1 bg-[#22C55E] rounded-full ml-2'>
// 						</div> : <div className='w-1 h-1 bg-[#CE0900] rounded-full ml-2'></div>
// 					}
// 				</div>
// 				<div>
// 					{
// 						isMicrophoneOn ? <div onClick={turnOffTheMicrophone}><Icons.SmallMicrophoneOn /></div>
//  							: <div onClick={turnOnTheMicrophone}><Icons.smallMicrophoneOff /></div>
// 					}
// 				</div>
// 			</div>
// 			<div className='flex items-center gap-4'>
// 				<p className='text-sm text-muted-foreground'>{isAbsent && t("absent")}</p>
// 				{
// 					!LocalUser && (
// 						<DropdownMenu>
// 							<DropdownMenuTrigger>
// 							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
// 								<path d="M16 12.25V11.75" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
// 								<path d="M12 12.25V11.75" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
// 								<path d="M8 12.25V11.75" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
// 							</svg>
// 							</DropdownMenuTrigger>
// 							<DropdownMenuContent className='bg-primary-foreground'>
// 								<div className='flex items-center flex-col gap-2 w-full'>
// 									{
// 										isAbsent && <Button variant="ghost" className='text-sm text-muted-foreground w-full'>{t("call-again")}</Button>
// 									}
// 									{
// 										isMicrophoneOn && <Button variant="ghost" className='text-sm text-muted-foreground w-full'>{t("turn-off-microphone")}</Button>
// 									}
// 									<Button variant="ghost" className='text-sm w-full text-destructive'>{t("delete")}</Button>
// 								</div>
// 							</DropdownMenuContent>
// 						</DropdownMenu>
// 					)
// 				}
// 			</div>
// 		</div>
// 	)
// }

// export default UserTechnicalCouncilTalk;