import { ChatListItemData, ChatStatus } from "@/src/app/types/types"
import { useMemo } from 'react'
import ChatListItem from '../dashboard/ChatMode/components/ChatListItem'

type UseRenderChatTabContentProps = {
	status: ChatStatus,
	data: ChatListItemData[],
	handleItemClick: (id: string) => void
  t: any;
}

const useRenderChatTabContent = ({status, data, handleItemClick, t}: UseRenderChatTabContentProps) => {
  const filteredData = useMemo(() => {
    if (status === 'all') return data
    return data.filter(item => item.status === status)
  }, [data, status])

  return (
    <div className="flex flex-col gap-2">
      {filteredData.map((item, index) => (
        <ChatListItem key={item.id || index} data={item} onClick={() => handleItemClick(item.id)} isSelected={false} index={index} />
      ))}
      {filteredData.length === 0 && (
        <div className="mt-4">
          <p className="text-center text-sm text-gray-500">{t("you-have-no-auctions-in-this-status")}</p>
        </div>
      )}
    </div>
  )
}

export default useRenderChatTabContent