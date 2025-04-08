import { get } from '@/src/app/api/service/api'
import { createQueryKeys } from '@/src/app/api/service/queryKeys'
import { AutoCompleteResponse } from '@/src/app/types/types'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

const autoCompleteKey = createQueryKeys("autoComplete");

const autoCompleteReq = (input: string): Promise<AutoCompleteResponse[]> => {
  return get(`/user/search?query=${input}`, {
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    }
  });
}

const useAutoComplete = () => {
  const [search, setSearch] = useState<string>("");
  const [results, setResults] = useState<AutoCompleteResponse[]>([]);

  const { refetch } = useQuery({
    queryKey: [...autoCompleteKey.all, search],
    queryFn: () => autoCompleteReq(search),
    enabled: false, // we trigger manually
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    if (search.trim() === "") {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      refetch().then((res) => {
        if (res.data) {
          setResults(res.data);
        }
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [search, refetch]);

  return { 
    search, 
    results, 
    handleSearch, 
    setResults,
    setSearch
  };
};

export default useAutoComplete;
