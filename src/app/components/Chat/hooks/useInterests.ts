import { get, post } from '@/src/app/api/service/api'
import { createQueryKeys } from '@/src/app/api/service/queryKeys'
import { InterestsResponse } from '@/src/app/types/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'


const interestsKey = createQueryKeys("interests");
const getInterests = () => get<InterestsResponse[]>('/interests/');

export const useInterests = (enabled: boolean = true) => {
	return useQuery({
		queryKey: interestsKey.all,
		queryFn: getInterests,
		enabled,
	})
}

export const addInterestsKey = createQueryKeys("addInterests");
const addInterests = (conditions: {
	interests_id: string[];
	user_id: string;
}) => post<{detail: string}>(`/interests/user/${conditions.user_id}?interest_ids=${conditions.interests_id.join('&interest_ids=')}`);

export const useAddInterests = () => {
	return useMutation({
		mutationFn: addInterests,
		onSuccess: (data) => {
			toast.success(data.detail, {
				duration: 3000,
			})
		},
		onError: (error) => {
			toast.error(error.message, {
				duration: 3000,
			})
		}
	})
}