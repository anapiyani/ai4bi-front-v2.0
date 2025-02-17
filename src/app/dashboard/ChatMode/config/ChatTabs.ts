import { ChatStatus } from "@/src/app/types/types"

export const CHAT_TABS: { value: ChatStatus; translationKey: string }[] = [
  { value: 'all', translationKey: 'all' },
  { value: 'active', translationKey: 'active' },
  { value: 'published', translationKey: 'published' },
  { value: 'in-progress', translationKey: 'in-progress' },
  { value: 'completed', translationKey: 'completed' },
]

export const CONSTRUCT_TABS: { value: string; translationKey: string }[] = [
  { value: 'all', translationKey: 'all' },
  { value: 'Astana', translationKey: 'Astana' },
  { value: 'Almaty', translationKey: 'Almaty' },
  { value: 'Shymkent', translationKey: 'Shymkent' },
  { value: 'Aktobe', translationKey: 'Aktobe' },
]