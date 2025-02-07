import { toast } from '@/components/ui/use-toast'
import { post } from '@/src/app/api/service/api'
import { createQueryKeys } from '@/src/app/api/service/queryKeys'
import { CreatePrivateChatResponse } from '@/src/app/types/types'
import { useMutation } from '@tanstack/react-query'

export const PrivateChatKeys = createQueryKeys("privateChat");

const createPrivateChat = (credentials: {user_id: string, toUser: string}) =>post<CreatePrivateChatResponse>(`/chats/private_chat?first_user=${credentials.user_id}&second_user=${credentials.toUser}`)

export const useCreatePrivateChat = () => {
	return useMutation({
		mutationFn: createPrivateChat,
		onSuccess(data) {
			return data;
		},
		onError(error) {
			toast({
				title: "Ошибка при создании чата",
				description: error.message,
			})
		},
	})
}