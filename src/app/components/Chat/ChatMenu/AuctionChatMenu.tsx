import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import NotificationBell from '../../Alerts/Notification/NotificationBell'


const AuctionChatMenu = ({t}: {t: any}) => {
	return (
		<div className="flex flex-col gap-2">
			<div>
				<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius molestias non accusamus similique porro neque.</p>
			</div>
			<div>
				<p>Status</p>
				<p>Icon and text</p>
			</div>
			<div>
				<p>Region</p>
				<p>Text</p>
			</div>
			<div>
				<p>Construction</p>
				<p>Lorem ipsum dolor sit amet consectetur.</p>
			</div>
			<div>
				<p>Project name</p>
				<p>Something and something</p>
			</div>
			<div>
				<p>Portal ID</p>
				<p>1234567890</p>
			</div>
			<div>
				<p>Lot information</p>
				<p>Here will be link to table</p>
			</div>
			<div>
				<NotificationBell />
			</div>
			<div>
				<p>Technical concuil date</p>
				<p>23 january 2025</p>
			</div>
			<div>
				<p>Auction date</p>
				<p>23 january 2025</p>
			</div>
			<div>
				<Tabs defaultValue="participants" className="w-full">
          <TabsList className='w-full flex justify-between items-center bg-transparent border-none rounded-none'>
						<TabsTrigger value="participants" className='w-full bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:bg-transparent'>{t("participants")}</TabsTrigger>
            <TabsTrigger value="photo-video" className='w-full bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:bg-transparent'>{t("photo-video")}</TabsTrigger>
            <TabsTrigger value="file" className='w-full bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:bg-transparent'>{t("file")}</TabsTrigger>
          </TabsList>
					<TabsContent value="participants">
						<div className='flex flex-col gap-2 w-full justify-center items-center'>
							<p className='text-sm text-muted-foreground'>{t("there-are-no-participants-yet")}</p>
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
			<div>
				<Button variant="outline">
					Отказаться от участия в тендере
				</Button>
			</div>
		</div>
	)
}

export default AuctionChatMenu;