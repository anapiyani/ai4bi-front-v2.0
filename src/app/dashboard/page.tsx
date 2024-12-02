"use client"

import { useTranslations } from 'next-intl'
import Header from '../components/Headers/Headers'
import { HeaderType } from '../types/types'


const Dashboard = () => {
  const t = useTranslations("dashboard")
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
          exitButtonClick: (type: HeaderType) => {
            console.log(`Exiting ${type} mode`)
          }
        }} />
      </div>
    </div>
  )  
}

export default Dashboard

