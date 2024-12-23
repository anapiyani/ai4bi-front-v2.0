"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import ChatContent from '../../components/ChatContent'
import useRenderChatTabContent from '../../hooks/useRenderChatTabContent'
import { ChatListItemData } from '../../types/types'
import { SearchBar } from './components/SearchBar'
import { CHAT_TABS } from './config/ChatTabs'

{/* data is example! */}
export const EXAMPLE_DATA: ChatListItemData[] = [
  {
    id: "d7d69048-ed7e-49d2-adb8-fa3276e6ee2c",
    active: false, 
    status: "active", 
    bnect_status: "submission_of_applications", 
    start_date: "16 ноя", 
    end_date: "11 ноя", 
    title: "Открытый тендер насосная станция пожаротушения по проекту Arena Light 1" 
  },
  {
    id: "d7123322-ed7e-123jk-adb8-ed7e123jk",
    active: false, 
    status: "published", 
    bnect_status: "bid_submission", 
    start_date: "13 дек", 
    end_date: "18 дек", 
    title: "Открытый тендер (СМР) по СС проект Atamura Comfort 2" 
]

const ChatMode = () => {
  const t = useTranslations("dashboard");
  const searchParams = useSearchParams();
  const router = useRouter();
  const chatId = searchParams.get("id");

  const handleItemClick = (id: string) => {
    router.push(`/dashboard?active_tab=chat&id=${id}`);
  }

  const activeData = EXAMPLE_DATA.map(item => ({
    ...item,
    active: item.id === chatId
  }));

  return (
    <div className="w-full flex flex-col lg:flex-row bg-primary-foreground justify-center">
      <aside className="w-full lg:w-1/3 bg-primary-foreground h-full px-4 lg:px-6 py-6 lg:py-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-secondary-foreground mb-4">
            {t("your-auctions")}
          </h2>
          
          <Tabs className="w-full" defaultValue="all">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:flex lg:flex-row gap-2 lg:gap-0 mb-4">
              {CHAT_TABS.map((tab) => (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value}
                  className="w-full lg:w-auto text-sm whitespace-nowrap"
                >
                  {t(tab.translationKey)}
                </TabsTrigger>
              ))}
            </TabsList>

            <SearchBar />

            {CHAT_TABS.map((tab) => (
              <TabsContent 
                key={tab.value} 
                value={tab.value}
                className="mt-4"
              >
                {useRenderChatTabContent({status: tab.value, data: activeData, handleItemClick: handleItemClick, t: t})}
              </TabsContent>
            ))}
            {
              activeData.length === 0 && (
                <div className="mt-4">
                  <p className="text-center text-sm text-gray-500">{t("you-have-no-auctions")}</p>
                </div>
              )
            }
          </Tabs>
        </div>
      </aside>

      <div className="w-full lg:w-2/3 mt-6 lg:mt-6 mx-4 lg:mr-6 rounded-lg bg-secondary min-h-[calc(100vh-8rem)] py-3 lg:py-3">
					<ChatContent chatId={chatId || ""} type="chat" />
      </div>
    </div>
  )
}

export default ChatMode
