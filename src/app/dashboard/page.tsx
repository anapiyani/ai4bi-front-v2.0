"use client"

import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { PopUpFactory } from '../components/ExitPopUps/ExitPopUps'
import Header from '../components/Headers/Headers'
import { activity_status } from '../types/types'
import Auction from './Auction/Auction'
import AuctionResults from './AuctionResults/AuctionResults'
import ChatMode from './ChatMode/ChatMode'
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
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(false)

  useEffect(() => {
    if (active_tab === "technical-council") {
      setIsMicrophoneOn(true)
    }
  }, [active_tab])

  const handleExitType = (type: activity_status) => {
    if (type === "auction-results") {
      console.log("exiting auction results")
    } else {
      setExitType(type)
    }
  }

  const toggleMicrophone = () => {
    setIsMicrophoneOn(prev => !prev)
  }


  const getActive = (active_tab: activity_status) => {
    const components = {
      chat: () => <ChatMode />, 
      "technical-council": () => <TechnicalCouncil isMicrophoneOn={isMicrophoneOn} toggleMicrophone={toggleMicrophone} />,
      "auction-results": () => <AuctionResults />,
      auction: () => <Auction />  
    } as const;

    return components[active_tab]?.() ?? components.chat();
  }

  const ExitTo = (type: activity_status) => {
    switch (type) {
      case "auction":
        window.location.href = `dashboard?active_tab=chat`        
        break;
      case "technical-council":
        window.location.href = `dashboard?active_tab=chat`
        break;
      case "chat":
        window.location.href = `https://bnect.pro/`
        break;
      default:
        break;
    }
    setExitType(null)
  }

  return (
    <div className="flex w-full h-screen flex-col">
      <div className='w-full'>
        <Header type={active_tab} t={t} handlers={{
          infoButtonClick: () => {
            console.log('Info button clicked')
          },
          audioButtonClick: toggleMicrophone,  
          exitButtonClick: handleExitType
        }} isMicrophoneOn={isMicrophoneOn} />
      </div>
      <div className='w-full'>
        {getActive(active_tab)}
      </div>
      <PopUpFactory type={exitType} handlers={{
        stayButtonClick: () => {
          setExitType(null)
        },
        exitButtonClick: () => {
          ExitTo(exitType as activity_status)
        }
      }} />
    </div>
  )  
}

export default Dashboard;

