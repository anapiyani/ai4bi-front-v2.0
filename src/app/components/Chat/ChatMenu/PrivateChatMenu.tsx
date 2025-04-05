import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getCookie } from '@/src/app/api/service/cookie'
import useRenderMediaContent from '@/src/app/hooks/useRenderMediaContent'
import { ChatParticipants } from '@/src/app/types/types'
import { useState } from 'react'
import NotificationBell from '../../Alerts/Notification/NotificationBell'
import { useGetChatMedia } from './hooks/useGetChatMedia'

const PrivateChatMenu = ({t, participants, chatId}: {t: any, participants: ChatParticipants[], chatId: string}) => {
  const [openedTab, setOpenedTab] = useState<"image" | "file">("image");
  const { data: chatMedia, isLoading, isError, refetch } = useGetChatMedia(
    chatId, 
    openedTab === "file" ? "file" : "image"
  );
  const renderedMedia = useRenderMediaContent(chatMedia?.media, t, false, true);
  
  const handleTabChange = (value: "image" | "file") => {
    setOpenedTab(value);
    refetch();
  };

	return (
		<>
		 <div 
      className='flex flex-col gap-2'>
          <div className='flex flex-col gap-1'>
            <p className='text-sm text-muted-foreground'>{t("contact-info")}</p>
            {/* here will be email but for now it's just username */}
            <p className='text-sm'>{participants.find((p) => p.user_id !== getCookie("user_id"))?.username}@gmail.com</p> 
          </div>
        </div>
        <div className='flex flex-col gap-2 mt-8'>
          <NotificationBell />
        </div>
        <div className='flex flex-col gap-2 mt-8 w-full'>
          <Tabs defaultValue="image" onValueChange={(value) => handleTabChange(value as "image" | "file")} className="w-full">
            <TabsList className='w-full flex justify-between items-center bg-transparent border-none rounded-none'>
              <TabsTrigger value="image" disabled={isLoading} className='w-full bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:bg-transparent'>{t("photo-video")}</TabsTrigger>
              <TabsTrigger value="file" disabled={isLoading} className='w-full bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:bg-transparent'>{t("file")}</TabsTrigger>
            </TabsList>
            <TabsContent value="image">
              <div className='flex flex-col gap-2 w-full justify-center items-center'>
              {
								chatMedia?.type === "image" && chatMedia?.media.length && chatMedia?.media.length > 0 && !isLoading ? (
									<div className='grid grid-cols-3 gap-2 w-full justify-center items-center'>
										{renderedMedia}
									</div>
								) : (
									<p className='text-sm text-muted-foreground'>{t("there-are-no-photos-or-videos-yet")}</p>
								)
							}
							{
								isLoading && (
									<div className='flex flex-col gap-2 w-full justify-center items-center'>
										<Skeleton className='w-full h-[300px] rounded-lg' />
									</div>
								)
							}
              </div>
            </TabsContent>
            <TabsContent value="file">
              <div className='flex flex-col gap-2 w-full justify-center items-center'>
                  {
                    chatMedia?.type === "file" && chatMedia?.media.length && chatMedia?.media.length > 0 && !isLoading ? (
                      <div className='flex flex-col gap-2 w-full justify-center items-center'>
                        {renderedMedia}
                      </div>
                    ) : (
                      <p className='text-sm text-muted-foreground'>{t("there-are-no-files-yet")}</p>
                    )
                  }
                  {
                    isLoading && (
                      <div className='flex flex-col gap-2 w-full justify-center items-center'>
                        <Skeleton className='w-full h-[300px] rounded-lg' />
                      </div>
                    )
                  }
              </div>
            </TabsContent>
          </Tabs>
        </div>
		</>
	)
}

export default PrivateChatMenu;