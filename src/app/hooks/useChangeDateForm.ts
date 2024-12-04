import { getDateTimeLocale } from '@/lib/utils'
import { getUserLocale } from '@/src/services/locale'
import { Locale } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { useEffect, useState } from 'react'

interface ChangeDateFormState {
  step: number
  locale: Locale
  technicalCouncilDate: Date | undefined
  technicalCouncilTime: string
  auctionDate: Date | undefined	
  auctionTime: string
}

export function useChangeDateForm() {
	const [state, setState] = useState<ChangeDateFormState>({
    step: 1,
    locale: enUS,
    technicalCouncilDate: undefined,
    technicalCouncilTime: '',
    auctionDate: undefined,
    auctionTime: '',
  })

  useEffect(() => {
    const fetchLocale = async () => {
      const localeStr = await getUserLocale()
      setState((prevState) => ({
        ...prevState,
        locale: getDateTimeLocale(localeStr),
      }))
    }
    fetchLocale()
  }, [])

  const updateState = (newState: Partial<ChangeDateFormState>) => {
    setState((prevState) => ({ ...prevState, ...newState }))
  }

  return { state, updateState }
}

