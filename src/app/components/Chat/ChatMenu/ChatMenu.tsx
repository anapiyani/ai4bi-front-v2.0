
import { Button } from '@/components/ui/button'
import { ChatParticipants } from '@/src/app/types/types'
import { useTranslations } from 'next-intl'
import Icons from '../../Icons'
import AuctionChatMenu from './AuctionChatMenu'
import PrivateChatMenu from './PrivateChatMenu'

const ChatMenu = ({type, setOpenMenu, name, participants}: {type?: "auction_chat" | "private", setOpenMenu: (open: boolean) => void, name: string, participants: ChatParticipants[]}) => {
	const t = useTranslations("dashboard");

  return (
    <div  
      className="w-full px-2 h-[calc(100vh-100px)] overflow-y-auto">
      <div className='flex flex-col gap-2 py-6 px-4 w-full'>
        <div className='flex justify-between items-center'>
          <h2 className='text-primary font-semibold text-lg mb-2'>{type === "private" ? name : t("about-auction")}</h2>
          <Button variant="ghost" size="icon" className='p-1' onClick={() => setOpenMenu(false)}>
            <Icons.Close />
          </Button>
        </div>
        {type === "private" ? <PrivateChatMenu t={t} participants={participants} /> : <AuctionChatMenu t={t} />}
      </div>
    </div>
  )
}

export default ChatMenu;