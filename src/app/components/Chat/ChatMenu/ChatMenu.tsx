
import { Button } from '@/components/ui/button'
import { ChatParticipants } from '@/src/app/types/types'
import { useTranslations } from 'next-intl'
import Icons from '../../Icons'
import AuctionChatMenu from './AuctionChatMenu'
import GroupChatMenu from './GrouChatMenu'
import PrivateChatMenu from './PrivateChatMenu'

interface ChatMenuProps {
  type?: "auction_chat" | "private" | "group";
  setOpenMenu: (open: boolean) => void;
  name: string;
  participants: ChatParticipants[];
  addParticipantsToAuctionChat: (user_ids: string[], is_auction_participant?: boolean) => void;
  chatId: string;
}


const ChatMenu = ({type, setOpenMenu, name, participants, addParticipantsToAuctionChat, chatId}: ChatMenuProps) => {
	const t = useTranslations("dashboard");

  return (
    <div  
      className="w-full h-[calc(100vh-100px)] overflow-y-auto flex">
      <div className='flex flex-col gap-2 py-6 w-full'>
        <div className='flex justify-between items-center'>
          <h2 className='text-primary font-semibold text-lg mb-2'>{type === "private" ? name : type === "group" ? name : t("about-auction")}</h2>
          <Button variant="ghost" size="icon" className='p-1' onClick={() => setOpenMenu(false)}>
            <Icons.Close />
          </Button>
        </div>
        {type === "private" ? 
        <PrivateChatMenu  t={t} participants={participants} chatId={chatId} /> 
        : type === "auction_chat" ? 
        <AuctionChatMenu 
          t={t}
          name={name}
          status={"Подача заявок"} 
          region={"Астана"}
          construction={"Трансформаторная подстанция и распределительный пункт"} 
          project_name={"GreenLine.Astra"} 
          portal_id={"00-090812"} 
          lot_information={"#"} 
          auction_date={"23 января 2025"} 
          technical_council_date={"26 января 2025"} 
          participants={participants} 
          addParticipantsToAuctionChat={addParticipantsToAuctionChat} 
          chatId={chatId}
        />
        : 
        <GroupChatMenu 
          name={name}
          construction_type={"Электрика"}
          city={"Астана"}
          participants={participants}
          t={t}
          addParticipantsToAuctionChat={addParticipantsToAuctionChat}
          chatId={chatId}
        />
        }
      </div>
    </div>
  )
}

export default ChatMenu;