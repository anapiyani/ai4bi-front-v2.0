import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChatParticipants } from '@/src/app/types/types'
import NotificationBell from '../../Alerts/Notification/NotificationBell'


const AuctionChatMenu = (
	{name, status, region, construction, project_name, portal_id, lot_information, auction_date, technical_council_date, participants, t}
	: 
	{name: string, status: string, region: string, construction: string, project_name: string, portal_id: string, lot_information: string, auction_date: string, technical_council_date: string, participants: ChatParticipants[], t: any}) => {
	return (
		<div className="flex flex-col gap-4 w-full">
			<div className='flex'>
				<p className='text-sm font-medium'>{name}</p>
			</div>
			<div className='flex flex-col gap-0.5'>
				<p className='text-xs text-muted-foreground'>{t("status")}</p>
				<p className='text-xs text-green-500'>{status}</p>
			</div>
			<div className='flex flex-col gap-0.5'>
				<p className='text-xs text-muted-foreground'>{t("region")}</p>
				<p className='text-xs'>{region}</p>
			</div>
			<div className='flex flex-col gap-0.5'>
				<p className='text-xs text-muted-foreground'>{t("construction")}</p>
				<p className='text-xs'>{construction}</p>
			</div>
			<div className='flex flex-col gap-0.5'>
				<p className='text-xs text-muted-foreground'>{t("project-name")}</p>
				<p className='text-xs'>{project_name}</p>
			</div>
			<div className='flex flex-col gap-0.5'>
				<p className='text-xs text-muted-foreground'>{t("portal-id")}</p>
				<p className='text-xs'>{portal_id}</p>
			</div>
			<div className='flex flex-col gap-0.5'>
				<p className='text-xs text-muted-foreground'>{t("lot-information")}</p>
				<a href='#' className='text-xs text-primary'>{t("go to the table")}</a>
			</div>
			<div className='flex'>
				<NotificationBell />
			</div>
			<div className='flex flex-col gap-0.5'>
				<p className='text-xs text-muted-foreground'>{t("technical-council-date")}</p>
				<p className='text-xs'>{technical_council_date}</p>
			</div>
			<div className='flex flex-col gap-0.5'>
				<p className='text-xs text-muted-foreground'>{t("auction-date")}</p>
				<p className='text-xs'>{auction_date}</p>
			</div>
			<div>
				<Tabs defaultValue="participants" className="w-full">
          <TabsList className='w-full flex justify-between items-center bg-transparent border-none rounded-none'>
						<TabsTrigger value="participants" className='w-full bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:bg-transparent'>{t("participants")}</TabsTrigger>
            <TabsTrigger value="photo-video" className='w-full bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:bg-transparent'>{t("photo-video")}</TabsTrigger>
            <TabsTrigger value="file" className='w-full bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:bg-transparent'>{t("file")}</TabsTrigger>
          </TabsList>
					<TabsContent value="participants">
						<div className='flex flex-col gap-2 w-full justify-center items-start'>
							{
								participants.map((participant) => (
									<div className='flex flex-col gap-0.5' key={participant.chat_participant_id}>
										<div className='flex items-center gap-2 justify-center'>
											<div className='w-6 h-6 rounded-full bg-transparent border border-border bg-muted flex items-center justify-center'>
												{participant.username.charAt(0).toUpperCase()}
											</div>
											<p className='text-sm'>{participant.username}</p>
										</div>
									</div>
								))
							}
						</div>
					</TabsContent>
          <TabsContent value="photo-video">
            <div className='flex flex-col gap-2 w-full justify-center items-center'>
              <p className='text-sm text-muted-foreground'>{t("there-are-no-photos-or-videos-yet")}</p>
            </div>
          </TabsContent>
          <TabsContent value="file">
            <div className='flex flex-col gap-2 w-full justify-center items-center'>
              <p className='text-sm text-muted-foreground'>{t("there-are-no-files-yet")}</p>
            </div>
          </TabsContent>
        </Tabs>
			</div>
			<div className='flex justify-center mt-3'>
				<Button className='bg-secondary hover:bg-secondary/80' variant="outline">
					{t("refuse-participation")}
				</Button>
			</div>
		</div>
	)
}

export default AuctionChatMenu;