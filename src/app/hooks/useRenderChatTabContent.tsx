import { ChatListItemData, ChatStatus } from "@/src/app/types/types"
import { useMemo } from 'react'
import ChatListItem from '../dashboard/Chat/components/ChatListItem'

const useRenderChatTabContent = ({status, data}: {status: ChatStatus, data: ChatListItemData[]}) => {
  const filteredData = useMemo(() => {
    if (status === 'all') return data
    return data.filter(item => item.status === status)
  }, [data, status])

  return (
    <div className="flex flex-col gap-2">
      {filteredData.map((item, index) => (
        <ChatListItem key={item.id || index} data={item} />
      ))}
    </div>
  )
}

export default useRenderChatTabContent