import { getDateTimeLocale } from '@/lib/utils'
import { getUserLocale } from '@/src/services/locale'
import { Locale } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { useEffect, useState } from 'react'

interface ChangeDateFormState {
  locale: Locale
  date: Date | undefined
  time: string
}

export function useChangeDateForm() {
	const [state, setState] = useState<ChangeDateFormState>({
    locale: enUS,
    date: undefined,
    time: '',
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

