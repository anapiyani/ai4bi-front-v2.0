"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import useRenderChatTabContent from '../../hooks/useRenderChatTabContent'
import { SearchBar } from './components/SearchBar'
import { CHAT_TABS } from './config/ChatTabs'

const Chat = () => {
  const t = useTranslations("dashboard");
  const router = useRouter();

  return (
    <div className="w-full flex flex-col lg:flex-row bg-primary-foreground justify-center">
      <aside className="w-full lg:w-1/3 bg-primary-foreground h-full px-4 lg:px-6 py-6 lg:py-8">
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
                {/* data is example! */}
                {useRenderChatTabContent({status: tab.value, data: [{
                  id: "1",
                  active: false, 
                  status: "active", 
                  bnect_status: "submission_of_applications", 
                  start_date: "16 ноя", 
                  end_date: "11 ноя", 
                  title: "Открытый тендер насосная станция пожаротушения по проекту Arena Light 1" 
                }]})}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </aside>

      <div className="w-full lg:w-2/3 mt-6 lg:mt-6 mx-4 lg:mr-3 rounded-lg bg-secondary h-full px-4 lg:px-6 py-6 lg:py-8">
					
      </div>
    </div>
  )
}

export default Chat
