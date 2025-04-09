
import { Button } from '@/components/ui/button'
import {ChatInfo, ChatParticipants} from '@/src/app/types/types'
import { useTranslations } from 'next-intl'
import Icons from '../../Icons'
import AuctionChatMenu from './AuctionChatMenu'
import GroupChatMenu from './GrouChatMenu'
import PrivateChatMenu from './PrivateChatMenu'
import dayjs from "dayjs";

interface ChatMenuProps {
  type?: "auction_chat" | "private" | "group";
  setOpenMenu: (open: boolean) => void;
  name: string;
  participants: ChatParticipants[];
  addParticipantsToAuctionChat: (user_ids: string[], is_auction_participant?: boolean) => void;
  chatId: string;
  chatInfo: ChatInfo | null;
}

const ChatMenu = ({type, setOpenMenu, name, participants, addParticipantsToAuctionChat, chatId, chatInfo}: ChatMenuProps) => {
	const t = useTranslations("dashboard");
  console.log(chatInfo)
  return (
    <div  
      className="w-full h-[calc(100vh-100px)] overflow-y-auto flex">
      <div className='flex flex-col gap-2 py-6 w-full items-center px-3'>
        <div className='w-full flex justify-between'>
          <h2 className='text-primary font-semibold text-lg mb-2'>{type === "private" ? name : type === "group" ? name : t("about-auction")}</h2>
          <Button variant="ghost" size="icon" className='p-1' onClick={() => setOpenMenu(false)}>
            <Icons.Close />
          </Button>
        </div>
        {type === "private" ? 
        <div className={"w-full"}>
          <PrivateChatMenu  t={t} participants={participants} chatId={chatId} />
        </div>
        : type === "auction_chat" ? 
        <AuctionChatMenu 
          t={t}
          name={chatInfo?.chat.chat_entity.name || name}
          status={chatInfo?.chat.status || "no-data"}
          region={chatInfo?.auction.auction_division || t("no-data")}
          construction={chatInfo?.auction.auction_constructive || t("no-data")}
          project_name={chatInfo?.auction.name || name}
          portal_id={chatInfo?.auction.doc_guid || t("no-data")}
          lot_information={"#"} 
          auction_date={dayjs(chatInfo?.chat.auction_start_time).format("DD.MM.YYYY") || t("no-data")}
          technical_council_date={dayjs(chatInfo?.chat.tech_council_start_time).format("DD.MM.YYYY") || t("no-data")}
          participants={participants} 
          addParticipantsToAuctionChat={addParticipantsToAuctionChat} 
          chatId={chatId}
          muted={chatInfo?.muted || false}
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