import { Button } from '@/components/ui/button'
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Icons from '@/src/app/components/Icons'


export const AuctionProtocol = ({
	t
}: {
	t: any
}) => {
	return (
		<div className='w-full h-full flex flex-col gap-2'>
			<div className="flex w-full justify-between">
				<div>
					<h1 className='text-brand-gray font-semibold text-lg'>{t("auction_protocol")}</h1>
				</div>
				<div className='flex items-center gap-2'>
					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<PaginationLink href="#" isActive>
									1
								</PaginationLink>
							</PaginationItem>
							<PaginationItem>
								<PaginationLink href="#">
									2
								</PaginationLink>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
					<p className='text-brand-gray text-sm mr-3'>{t("total")}</p>
					<Button variant="outline" className='p-2 gap-2 text-sm'>
						<Icons.Edit_protocol />
						{t("make_changes")}
					</Button>
				</div>
			</div>
			<div className='border border-gray-300 rounded-lg py-1'>
				<Table className="w-full md:table overflow-x-auto no-scrollbar">
          <TableHeader>
            <TableRow className="bg-gray-50 border-b border-gray-300">
              <TableHead className="px-4 py-2 text-center">{t("partner")}</TableHead>
              <TableHead className="px-4 py-2 text-center whitespace-nowrap">
                {t("product_manufacturer").length > 8 
                  ? `${t("product_manufacturer").slice(0,8)}...` 
                  : t("product_manufacturer")}
              </TableHead>
              <TableHead className="px-4 py-2 text-center">{t("materials")}</TableHead>
              <TableHead className="px-4 py-2 text-center">{t("work")}</TableHead>
              <TableHead className="px-4 py-2 text-center">{t("total")}</TableHead>
              <TableHead className="px-4 py-2 text-center">{t("advance")}</TableHead>
              <TableHead className="px-4 py-2 text-center whitespace-nowrap">
                {t("advance_type").length > 8
                  ? `${t("advance_type").slice(0,8)}...`
                  : t("advance_type")}
              </TableHead>
              <TableHead className="px-4 py-2 text-center whitespace-nowrap">
                {t("amount_after_auction").length > 8
                  ? `${t("amount_after_auction").slice(0,8)}...`
                  : t("amount_after_auction")}
              </TableHead>
              <TableHead className="px-4 py-2 text-center">{t("notes")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="border-b border-gray-300 last:border-0">
              <TableCell className="py-2 ">
                <p className='text-brand-gray text-sm'>Some long ass name i dont know what to do with it</p>
              </TableCell>
              <TableCell className="px-4 py-2">
                <p className='text-brand-gray text-sm'>Somewhere in the world</p>
              </TableCell>
              <TableCell className="px-4 py-2">
								<p className='text-brand-gray text-sm'>7, 000 000 KZT</p>
							</TableCell>
              <TableCell className="px-4 py-2">
								<p className='text-brand-gray text-sm'>3, 000 000 KZT</p>
              </TableCell>
              <TableCell className="px-4 py-2">
								<p className='text-brand-gray text-sm'>10, 000 000 KZT</p>
              </TableCell>
							<TableCell className="px-4 py-2">
								<p className='text-brand-gray text-sm'>0</p>
              </TableCell>
							<TableCell className="px-4 py-2">
								<p className='text-brand-gray text-sm'>Bank transfer</p>
              </TableCell>
							<TableCell className="px-4 py-2">
								<p className='text-brand-gray text-sm'>13, 000 000 KZT</p>
              </TableCell>
							<TableCell className="px-4 py-2">
								<p className='text-brand-gray text-sm'>Some notes</p>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
			</div>
		</div>
	)
}