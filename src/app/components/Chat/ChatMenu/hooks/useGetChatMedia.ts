import { post } from '@/src/app/api/service/api'
import { createQueryKeys } from '@/src/app/api/service/queryKeys'
import { ChatPanelMedia } from '@/src/app/types/types'
import { useQuery } from '@tanstack/react-query'

export const getChatMediaKey = createQueryKeys("getChat")
export const getChatMedia = (credentials: {chat_id: string, type: "file" | "image"}) => 
	post<ChatPanelMedia>(`/chats/get_chat_media?page=1&page_size=20&chat_id=${credentials.chat_id}`,
		[credentials.type]
	)

export const useGetChatMedia = (chatId: string, type: "file" | "image") => {
	return useQuery<ChatPanelMedia, Error, ChatPanelMedia>(
    {
      queryKey: [getChatMediaKey, { chat_id: chatId, type }],
			queryFn: async () => {
				const data = await getChatMedia({ chat_id: chatId, type });
				return {
					...data,
					type,
				};
			},
      staleTime: Infinity,
      gcTime: 1000 * 60 * 5,
      enabled: Boolean(chatId && type),
			refetchOnWindowFocus: true,
			refetchOnMount: true,
		}
  );
}