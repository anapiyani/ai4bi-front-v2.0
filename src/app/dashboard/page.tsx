"use client"

import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'
import { useRouter, useSearchParams } from 'next/navigation'
import {MutableRefObject, useEffect, useRef, useState} from 'react'
import { Toaster } from "react-hot-toast"
import { get } from '../api/service/api'
import { deleteCookie, getCookie, setCookie } from '../api/service/cookie'
import BlockNavigation from '../components/BlockNavigation/BlockNavigation'
import { PopUpFactory } from '../components/ExitPopUps/ExitPopUps'
import Header from '../components/Headers/Headers'
import { useAuthHeader } from '../hooks/useAuthHeader'
import { finishAuction } from '../hooks/useFinishAuction'
import { activity_status, MyData, TechCouncilUser } from '../types/types'

const Auction = dynamic(() => import('./Auction/Auction'), { ssr: false })
const AuctionResults = dynamic(() => import('./AuctionResults/AuctionResults'), { ssr: false })
const ChatMode = dynamic(() => import('./ChatMode/ChatMode'), { ssr: false })
const TechnicalCouncil = dynamic(() => import('./TechnicalCouncil/TechnicalCouncil'), { ssr: false })

export default function Dashboard() {
  const t = useTranslations("dashboard")
  const searchParams = useSearchParams()
  const router = useRouter()
  const authHeader: Record<string, string> = useAuthHeader()
  const chatId: string | null = searchParams.get("id")
  let active_tab: activity_status = searchParams.get("active_tab") as activity_status
  const closeRTCConnection  = useRef<(() => void) | null>(null)
  const [techCouncilUser, setTechCouncilUser] = useState<TechCouncilUser | null>(null)
  const [conferenceId, setConferenceId] = useState<string | null>(null)

  if (
    !active_tab ||
    !["chat", "technical-council", "auction-results", "auction"].includes(active_tab)
  ) {
    active_tab = "chat"
  }

  const [exitType, setExitType] = useState<string | null>(null)
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(false)

  useEffect((): void => {
    if (typeof window === 'undefined') {
      return;
    }
    if (active_tab === "technical-council") {
      setIsMicrophoneOn(false)
    }
  }, [active_tab])

  const handleExitType = (type: activity_status, isFinish?: boolean) => {
    if (type === "auction-results") {
      router.push('/dashboard?active_tab=chat')
    } else if (type === "technical-council" || type === "auction") {
      if (isFinish) {
        if (conferenceId) {
          finishAuction(conferenceId)
        }
        if (!closeRTCConnection.current) {
        } else {
          closeRTCConnection.current()
        }
        setConferenceId(null)
        setTechCouncilUser(null)
        setIsMicrophoneOn(false)
        router.push('/dashboard?active_tab=chat')
      } else {
        if (closeRTCConnection.current) {
          closeRTCConnection.current()
        }
        setIsMicrophoneOn(false)
        router.push('/dashboard?active_tab=chat')
      }
    } else {
      setExitType(type)
    }
  }

  const toggleMicrophone: () => void = () => {
    if (typeof window !== 'undefined') {
      setIsMicrophoneOn(prev => !prev)
    }
  }

  const {
    data: userData,
    isLoading,
    isError,
    error,
  } = useQuery<MyData>({
    queryKey: ['me'],
    queryFn: async () => {
      return get<MyData>('user/me', { headers: authHeader })
    },
    enabled: typeof window !== 'undefined',
  })

  const getActive = (active_tab: activity_status) => {
    const components = {
      chat: () => <ChatMode />, 
      "technical-council": () => 
        <TechnicalCouncil
          isMicrophoneOn={isMicrophoneOn}
          toggleMicrophone={toggleMicrophone}
          closingTechnicalCouncil={(closeFunc) => {
            closeRTCConnection.current = closeFunc
          }}
          onUserUpdate={(user: TechCouncilUser, conferenceId: string | null) => {
            setTechCouncilUser(user)
            setConferenceId(conferenceId)
          }}
    />,
      "auction-results": () => <AuctionResults goBack={() => handleExitType("auction-results")} />,
      auction: () => <Auction 
        isMicrophoneOn={isMicrophoneOn}
        toggleMicrophone={toggleMicrophone}
        closingTechnicalCouncil={(closeFunc) => {
          closeRTCConnection.current = closeFunc
        }}
        onUserUpdate={(user, conferenceId) => {
          setTechCouncilUser(user)
          setConferenceId(conferenceId)
        }}
      />  
    } as const
    return components[active_tab]?.() ?? components.chat()
  }

  useEffect(() => {
    if (typeof window === 'undefined' || !userData) return
    try {
      setCookie('user_id', userData.uuid)
      setCookie('role', userData.role)
      setCookie('first_name', userData.first_name)
      if (!getCookie('access_token')) {
        window.location.href = '/login'
      }
    } catch (error) {
      console.error('Error accessing Cookies:', error)
    }
  }, [userData])
  
  const ExitTo = (type: activity_status) => {
    switch (type) {
      case "auction":
        if (closeRTCConnection.current) {
          closeRTCConnection.current()
        }
        setIsMicrophoneOn(false)
        router.push('/dashboard?active_tab=chat')
        break
      case "technical-council":
        if (closeRTCConnection.current) {
          closeRTCConnection.current()
        }
        setIsMicrophoneOn(false)
        router.push('/dashboard?active_tab=chat')
        break
      case "auction-results":
        router.push('/dashboard?active_tab=chat')
        break
      case "chat":
        if (typeof window !== 'undefined') {
          deleteCookie('access_token');
          deleteCookie('refresh_token');
          deleteCookie('user_id');
          window.location.href = 'https://bnect.pro/'
        }
        break
      default:
        break
    }
    setExitType(null)
  }

  return (
    <div className="flex w-full h-full flex-col">
      <BlockNavigation />
      <div className={`w-full ${chatId ? "hidden lg:block" : "block"}`}>
        <Header 
          type={active_tab} 
          t={t} 
          handlers={{
            infoButtonClick: () => {
              console.log('Info button clicked')
            },
            audioButtonClick: toggleMicrophone,  
            exitButtonClick: handleExitType,
          }} 
          isMicrophoneOn={isMicrophoneOn}
          techCouncilUser={techCouncilUser}
        />
      </div>
      <div className='w-full'>
        {getActive(active_tab)}
        <Toaster />
      </div>
      <PopUpFactory 
        type={exitType} 
        handlers={{
          stayButtonClick: () => {
            setExitType(null)
          },
          exitButtonClick: () => {
            ExitTo(exitType as activity_status)
          }
        }} 
      />
    </div>
  )
}
