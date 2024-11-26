"use client"

import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"

// using example: <AdminTechnicalCommitteeDialog />

const AdminTechnicalCommitteeDialog = () => {
  const t = useTranslations("dashboard")
  return (
    <div className="border p-4 sm:max-w-xl rounded-lg bg-background border-border">
      <div className="space-y-2 py-3">
        <h4 className="text-base font-semibold leading-5">
          Время начать Технический Совет
        </h4>
        <p className="text-sm text-muted-foreground leading-5">
          11 декабря, 2024 г. в 16:00
        </p>
      </div>
      <div className="flex justify-end space-x-2 mt-2 w-115">
        <Button variant="outline">{t("decline")}</Button>
				<Button variant="outline">{t("reschedule")}</Button>
        <Button>{t("accept")}</Button>
      </div>
    </div>
  )
}

export default AdminTechnicalCommitteeDialog;