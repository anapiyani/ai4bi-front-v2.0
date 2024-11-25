import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslations } from 'next-intl'
import { useState } from 'react'

interface PaginationControlProps {
  totalItems: number
  initialRowsPerPage?: number
  onRowsPerPageChange?: (rows: number) => void,
	initialCurrentPage: number;
}

const PaginationControl = ({ 
  totalItems, 
  initialRowsPerPage = 10, 
  onRowsPerPageChange,
	initialCurrentPage
}: PaginationControlProps) => {
  const [rowsPerPage, setRowsPerPage] = useState<number>(initialRowsPerPage)
  const t = useTranslations("Dashboard");
	
  const handleRowsPerPageChange = (value: string) => {
    const newRowsPerPage = parseInt(value, 10)
    setRowsPerPage(newRowsPerPage)
    onRowsPerPageChange?.(newRowsPerPage)
  }

  const startItem = (initialCurrentPage - 1) * rowsPerPage + 1
  const endItem = Math.min(initialCurrentPage * rowsPerPage, totalItems)

  return (
			totalItems > 10 && (
				<div className="flex items-center justify-between space-x-4 text-sm">
					<span className="text-muted-foreground">{t('rows-per-page')}</span>
					<Select value={rowsPerPage.toString()} onValueChange={handleRowsPerPageChange}>
						<SelectTrigger className="w-[70px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{[10, 25, 50].map((value) => (
								<SelectItem key={value} value={value.toString()}>
									{value}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<span className="text-muted-foreground">
						{startItem}-{endItem} {t("of")} {totalItems}
					</span>
			</div>
		)
  )
}

export default PaginationControl;