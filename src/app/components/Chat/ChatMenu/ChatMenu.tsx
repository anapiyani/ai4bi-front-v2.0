
import { Button } from '@/components/ui/button'
import { motion } from "framer-motion"
import { useTranslations } from 'next-intl'
import Icons from '../../Icons'
import AuctionChatMenu from './AuctionChatMenu'
import PrivateChatMenu from './PrivateChatMenu'

const ChatMenu = ({type, setOpenMenu, name}: {type?: "auction_chat" | "private", setOpenMenu: (open: boolean) => void, name: string}) => {
	const t = useTranslations("dashboard");

  return (
    <motion.div className="w-full px-2">
      <div className='flex flex-col gap-2 py-6 px-4 w-full'>
        <div className='flex justify-between items-center'>
          <h2 className='text-primary font-semibold text-lg mb-2'>{name}</h2>
          <Button variant="ghost" size="icon" className='p-1' onClick={() => setOpenMenu(false)}>
            <Icons.Close />
          </Button>
        </div>
        {type === "private" ? <PrivateChatMenu t={t} /> : <AuctionChatMenu t={t} />}
      </div>
    </motion.div>
  )
}

export default ChatMenu;