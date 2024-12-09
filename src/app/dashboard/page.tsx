"use client"

import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { PopUpFactory } from '../components/ExitPopUps/ExitPopUps'
import Header from '../components/Headers/Headers'
import { activity_status } from '../types/types'
import Auction from './Auction/Auction'
import AuctionResults from './AuctionResults/AuctionResults'
import Chat from './Chat/Chat'
import TechnicalCouncil from './TechnicalCouncil/TechnicalCouncil'

const Dashboard = () => {
  const t = useTranslations("dashboard");
  const searchParams = useSearchParams();
  let active_tab = searchParams.get("active_tab") as activity_status;

  if (
    !active_tab ||
    !["chat", "technical-council", "auction-results", "auction"].includes(active_tab)
  ) {
    active_tab = "chat";
  }

  const [exitType, setExitType] = useState<string | null>(null)

  const handleExitType = (type: activity_status) => {
    if (type === "auction-results") {
      console.log("exiting auction results")
    } else {
      setExitType(type)
    }
  }

  const getActive = (active_tab: activity_status) => {
    const components = {
      chat: () => <Chat />,
      "technical-council": () => <TechnicalCouncil />,
      "auction-results": () => <AuctionResults />,
      auction: () => <Auction />  
    } as const;

    return components[active_tab]?.() ?? components.chat();
  }

  return (
    <div className="flex w-full h-screen flex-col">
      <div className='w-full'>
        <Header type={active_tab} t={t} handlers={{
          infoButtonClick: () => {
            console.log('Info button clicked')
          },
          audioButtonClick: () => {
            console.log('Audio button clicked')
          },  
          exitButtonClick: handleExitType
        }} />
      </div>
      <div className='w-full'>
        {getActive(active_tab)}
      </div>
      <PopUpFactory type={exitType} handlers={{
        stayButtonClick: () => {
          setExitType(null)
          console.log('Staying in popup', exitType)
        },
        exitButtonClick: () => {
          setExitType(null)
          console.log('Exiting popup', exitType)
        }
      }} />
    </div>
  )  
}

export default Dashboard;

