import { get } from '@/src/app/api/service/api'
import { createQueryKeys } from '@/src/app/api/service/queryKeys'
import { InterestsResponse } from '@/src/app/types/types'
import { useQuery } from '@tanstack/react-query'


const interestsKey = createQueryKeys("interests");
const getInterests = () => get<InterestsResponse[]>('/interests/');

export const useInterests = (enabled: boolean = true) => {
	return useQuery({
		queryKey: interestsKey.all,
		queryFn: getInterests,
		enabled,
	})
}