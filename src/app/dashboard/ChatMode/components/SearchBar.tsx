import { Input } from "@/components/ui/input"
import useAutoComplete from "@/src/app/components/Chat/ChatMenu/hooks/useAutocomplete"
import Icons from '@/src/app/components/Icons'
import { AutoCompleteResponse } from '@/src/app/types/types'
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { useEffect } from "react"

export function SearchBar({
  setPrivateChatResult,
  onSearch
}: {
  setPrivateChatResult?: (result: AutoCompleteResponse[] | null) => void
  onSearch?: (term: string) => void
}) {
  const t = useTranslations("dashboard")
  const { results, handleSearch } = useAutoComplete();

  useEffect(() => {
    if (setPrivateChatResult) {
      setPrivateChatResult(results.length ? results : null);
    }
  }, [results, setPrivateChatResult]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (onSearch) {
      onSearch(value)
    }
    handleSearch(e)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className='flex mt-0 lg:mt-3 md:mt-3 w-full'
    > 
      <Input 
        placeholder={t("search")} 
        className='w-full' 
        type='text'
        icon={Icons.SearchInput()}
        onChange={handleInputChange}
      /> 
    </motion.div>
  )
}
