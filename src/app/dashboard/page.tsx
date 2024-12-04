"use client"

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import ChangeDates from '../components/Form/ChangeDates'
import Header from '../components/Headers/Headers'
import { PopUpFactory } from '../components/PopUp/PopUp'
import { HeaderType } from '../types/types'

// 2:
// 1. input indicator
// 2. form submits after 1 step

const Dashboard = () => {
  const t = useTranslations("dashboard")
  const [exitType, setExitType] = useState<string | null>(null)
  const handleExitType = (type: HeaderType) => {
    if (type === "auction-results") {
      console.log("exiting auction results")
    } else {
      setExitType(type)
    }
  }

  return (
    <div className="flex w-full h-screen">
      <div className='w-full'>
        <Header type="technical-council" t={t} handlers={{
          infoButtonClick: () => {
            console.log('Info button clicked')
          },
          audioButtonClick: () => {
            console.log('Audio button clicked')
          },  
          exitButtonClick: handleExitType
        }} />
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
      <ChangeDates />
    </div>
  )  
}

export default Dashboard

