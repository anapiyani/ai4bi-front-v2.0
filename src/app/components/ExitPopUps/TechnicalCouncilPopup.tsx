import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/Checkbox'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { PopUpHandlers, TechCouncilUser } from '../../types/types'
import Icons from '../Icons'

type TechnicalCouncilLeaveButtonProps = {
	handlers: PopUpHandlers,
	techCouncilUser: TechCouncilUser | null
}
	
const TechnicalCouncilLeaveButton = ({handlers, techCouncilUser}: TechnicalCouncilLeaveButtonProps) => {
	const t = useTranslations("dashboard");
	const [isOpen, setIsOpen] = useState(false)
	const [isFinish, setIsFinish] = useState<boolean>(false)
	const userRole = techCouncilUser?.role

  const handleToggleDialog = () => {
    setIsOpen(!isOpen)
  }

	const handleExit = () => {
		if (isFinish) {
			handlers.exitButtonClick(true);
		} else {
			handlers.exitButtonClick(false);
		}
	}
	
	return (
		<div className="relative">
      <Button 
			className='flex items-center gap-2' 
				variant="destructive"
				onClick={handleToggleDialog}
		>
			<p className='hidden lg:block md:block'>{t("leave-technical-council")}</p>
			<Icons.HeaderClose />
		</Button>	

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-[450px] bg-white rounded-lg shadow-lg overflow-hidden z-50">
          <div className="px-6 pt-6 pb-3">
            <h2 className="text-xl font-medium">{userRole === "project_team" || userRole === "admin" ? t("leave-the-call") : t("<quit></quit>-the-call")}</h2>
            <p className="text-sm text-slate-500 mt-2">{userRole === "project_team" || userRole === "admin" ? t("you-can-quit-the-call") : t("you-can-return-to-the-call")}</p>
          </div>
					{
						userRole === "project_team" || userRole === "admin" ? (
							<div className='flex justify-start items-center px-6 gap-2 mb-2'>
								<Checkbox checked={isFinish} onCheckedChange={(checked) => setIsFinish(checked as boolean)} />
								<p className='text-sm'>{t("finish-the-call")}</p>
							</div>
						) : null
					}
					<div className={`flex justify-between ${userRole === "project_team" || userRole === "admin" ? "mx-4" : "mx-0"}`}>
						<div className='flex my-2 gap-2 w-1/2'>
							<Button
								variant="outline"
								onClick={() => {
									setIsOpen(false)
								}}
								className="flex-1 rounded-md py-6 text-sm font-medium text-slate-800 hover:bg-slate-50"
							>
								{
									userRole === "project_team" || userRole === "admin" ? t("stay") : t("not_exit")
								}
							</Button>
							<Button
								onClick={() => {
									setIsOpen(false)
									handleExit()
								}}
								className="flex-1 rounded-md py-6 text-sm font-medium bg-red-600 hover:bg-red-700 text-white"
							>
							{
								userRole === "project_team" || userRole === "admin" ? t("leave-the-call") : t("quit-the-call")
							}
							</Button>
						</div>
					</div>
        </div>
      )}
    </div>
	)
}

export default TechnicalCouncilLeaveButton;