import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"

// using example: <TechnicalComitteeNoticeDialog />

const TechnicalComitteeNoticeDialog = () => {
  const t = useTranslations("dashboard")
  return (
    <div className="border p-4 max-w-md rounded-lg bg-background border-border flex justify-between items-center">
      <div className="h-full flex items-center">
        <h4 className="text-sm font-medium leading-5 items-center mr-1">
          У вас есть 24 часа для изменения предложения перед итогами тендера
        </h4>
      </div>
      <div className="flex justify-end space-x-2">
        <Button>{t("understood")}</Button>
      </div>
    </div>
  )
}

export default TechnicalComitteeNoticeDialog;