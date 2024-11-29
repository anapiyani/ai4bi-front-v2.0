"use client"

import { useTranslations } from 'next-intl'


const Dashboard = () => {
  const t = useTranslations("dashboard")

  return (
    <div className="flex min-h-screen w-full m-4 gap-10">
			<h1>{t("title")}</h1>
    </div>
  )  
}

export default Dashboard

