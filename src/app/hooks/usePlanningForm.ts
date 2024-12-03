import { getDateTimeLocale } from '@/lib/utils'
import { getUserLocale } from '@/src/services/locale'
import { Locale } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { useEffect, useState } from 'react'

interface PlanningFormState {
  step: number
  locale: Locale
  technicalCouncilDate: Date | undefined
  technicalCouncilTime: string
  auctionDate: Date | undefined
  auctionTime: string
}

export function usePlanningForm() {
  const [state, setState] = useState<PlanningFormState>({
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

  const updateState = (newState: Partial<PlanningFormState>) => {
    setState((prevState) => ({ ...prevState, ...newState }))
  }

  return { state, updateState }
}

