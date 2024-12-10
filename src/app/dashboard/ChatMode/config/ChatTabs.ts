import { ChatStatus } from "@/src/app/types/types"

export const CHAT_TABS: { value: ChatStatus; translationKey: string }[] = [
  { value: 'all', translationKey: 'all' },
  { value: 'active', translationKey: 'active' },
  { value: 'published', translationKey: 'published' },
  { value: 'in-progress', translationKey: 'in-progress' },
  { value: 'completed', translationKey: 'completed' },
]