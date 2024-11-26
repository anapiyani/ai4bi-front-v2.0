"use client";
import { useTranslations } from 'next-intl'

const Dashboard = () => {
	const t = useTranslations("dashboard");

	return (
		<div className="relative flex flex-col items-start justify-start min-h-screen bg-back w-full">
			<h1 className='text-xl bg-primary text-primary-foreground'>{t("title")}</h1>
		</div>
	)  
}

export default Dashboard;