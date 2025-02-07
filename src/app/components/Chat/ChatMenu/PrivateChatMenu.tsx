import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getCookie } from '@/src/app/api/service/cookie'
import { ChatParticipants } from '@/src/app/types/types'
import NotificationBell from '../../Alerts/Notification/NotificationBell'

const PrivateChatMenu = ({t, participants}: {t: any, participants: ChatParticipants[]}) => {
	return (
		<>
		 <div 
      className='flex flex-col gap-2'>
          <div className='flex flex-col '>
            <p className='text-sm text-muted-foreground'>{t("contact-info")}</p>
            <p className='text-sm'>{participants.find((p) => p.user_id !== getCookie("user_id"))?.username}@gmail.com</p>
          </div>
        </div>
        <div className='flex flex-col gap-2 mt-8'>
          <NotificationBell />
        </div>
        <div className='flex flex-col gap-2 mt-8 w-full'>
          <Tabs defaultValue="photo-video" className="w-full">
            <TabsList className='w-full flex justify-between items-center bg-transparent border-none rounded-none'>
              <TabsTrigger value="photo-video" className='w-full bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:bg-transparent'>{t("photo-video")}</TabsTrigger>
              <TabsTrigger value="file" className='w-full bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:bg-transparent'>{t("file")}</TabsTrigger>
            </TabsList>
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
		</>
	)
}

export default PrivateChatMenu;