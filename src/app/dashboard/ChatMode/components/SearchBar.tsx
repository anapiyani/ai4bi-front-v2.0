import { Input } from "@/components/ui/input"
import Icons from '@/src/app/components/Icons'
import { useTranslations } from "next-intl"

export function SearchBar() {
  const t = useTranslations("dashboard")
  
  return (
    <div className='flex mt-3 w-full'> <Input placeholder={t("search")} className='w-full' type='text' icon={Icons.SearchInput()} /> </div>
  )
}