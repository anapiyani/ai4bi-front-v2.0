import { get } from '@/src/app/api/service/api'
import { createQueryKeys } from '@/src/app/api/service/queryKeys'
import { AutoCompleteResponse } from '@/src/app/types/types'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

const autoCompleteKey = createQueryKeys("autoComplete");
const autoCompleteReq = (input: string): Promise<AutoCompleteResponse[]> => {
	return get(`/user/search?query=${input}`);
}

const useAutoComplete = () => {
	const [search, setSearch] = useState<string>("");
	const [results, setResults] = useState<AutoCompleteResponse[]>([]);

	const { refetch, isFetching }: UseQueryResult<AutoCompleteResponse[], Error> = useQuery({
		queryKey: [...autoCompleteKey.all, search],
		queryFn: () => autoCompleteReq(search),
		enabled: false
	});

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setSearch(e.target.value);
	}

	useEffect(() => {
		const timer = setTimeout(() => {
			if (search) {
				refetch().then((res: UseQueryResult<AutoCompleteResponse[], Error>) => {
					if (res.data) {
						setResults(res.data);
					}
				});
			}
		}, 1000);
		return () => clearTimeout(timer);
	}, [search, refetch]);

	const handleResults = async (): Promise<void> => {
		const result = await refetch();
		if (result.data) {
			setResults(result.data);
		}
	}

	return { 
		search, 
		results, 
		handleSearch, 
		handleResults,
		isFetching,
	};
}

export default useAutoComplete;
