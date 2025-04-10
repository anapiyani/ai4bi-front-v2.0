"use client"

import { Button } from "@/components/ui/button"
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Icons from "@/src/app/components/Icons"
import { useEffect, useRef, useState } from "react"
import { auctionTableHeaders } from "./data"
import type { TAuctionProtocol } from "@/src/app/types/types"

export const AuctionProtocol = ({ t, protocols }: { t: any; protocols?: TAuctionProtocol[] }) => {
  const [lockedHeaders, setLockedHeaders] = useState<string[]>([])
  const headersRef = useRef<{ [key: string]: HTMLTableCellElement | null }>({})
  const [leftOffsets, setLeftOffsets] = useState<{ [key: string]: number }>({})
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const handleOnLock = (headerName: string) => {
    setLockedHeaders((prev) =>
        prev.includes(headerName) ? prev.filter((h) => h !== headerName) : [...prev, headerName],
    )
  }
  useEffect(() => {
    if (protocols && protocols.length > 0) {
      setIsLoading(false)
    } else {
      const timer = setTimeout(() => setIsLoading(true), 100)
      return () => clearTimeout(timer)
    }
  }, [protocols])

  useEffect(() => {
    const newOffsets: { [key: string]: number } = {}
    let cumulativeLeft = 0

    lockedHeaders.forEach((headerName) => {
      const el = headersRef.current[headerName]
      if (el) {
        newOffsets[headerName] = cumulativeLeft
        cumulativeLeft += el.offsetWidth
      }
    })

    setLeftOffsets(newOffsets)
  }, [lockedHeaders])

  const orderedHeaders = [...lockedHeaders, ...auctionTableHeaders.filter((h) => !lockedHeaders.includes(h))]

  // Helper function to get cell value based on header name
  const getCellValue = (protocol: TAuctionProtocol, headerName: string) => {
    try {
      switch (headerName) {
        case "partner":
          return protocol.commercial_offer_name
        case "product_manufacturer":
          return protocol.info || "-"
        case "materials":
          return `${protocol.amount_materials.toLocaleString()} KZT`
        case "work":
          return `${protocol.amount_work.toLocaleString()} KZT`
        case "total":
          return `${protocol.total_price.toLocaleString()} KZT`
        case "advance":
          return protocol.advance
        case "advance_type":
          return protocol.guarantee || "-"
        case "amount_after_auction":
          return `${protocol.price_after.toLocaleString()} KZT`
        case "notes":
          return protocol.comments || "-"
        default:
          return "-"
      }
    } catch (error) {
      console.error(`Error getting value for ${headerName}:`, error)
      return "-"
    }
  }

  return (
      <div className="w-full flex flex-col gap-2">
        <div className="flex w-full flex-col md:flex-row justify-between">
          <h1 className="text-brand-gray font-semibold text-lg">{t("auction_protocol")}</h1>
          <div className="flex items-center gap-2">
            <Pagination className="justify-start">
              <PaginationContent>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
              </PaginationContent>
              <p className="text-brand-gray text-sm mr-3 flex items-center">{t("total")}</p>
            </Pagination>
            <Button variant="outline" className="p-2 gap-2 text-xs md:text-sm lg:text-sm">
              <Icons.Edit_protocol width="16" height="16" />
              {t("make_changes")}
            </Button>
          </div>
        </div>
        <div className="rounded-lg overflow-auto border border-gray-300">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-gray-50 border-b border-gray-300">
                {orderedHeaders.map((headerName) => {
                  const isLocked = lockedHeaders.includes(headerName)
                  return (
                      <TableHead
                          key={headerName}
                          ref={(el) => {
                            headersRef.current[headerName] = el
                          }}
                          className={`px-4 py-2 text-center sticky bg-white z-20`}
                          style={{
                            left: isLocked ? leftOffsets[headerName] : undefined,
                            minWidth: "150px",
                            zIndex: isLocked ? 30 : 20,
                          }}
                      >
                        {t(headerName)}
                      </TableHead>
                  )
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={orderedHeaders.length} className="py-8 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
                        <span className="ml-2 text-gray-500">{t ? t("loading") : "Loading..."}</span>
                      </div>
                    </TableCell>
                  </TableRow>
              ) : protocols && protocols.length > 0 ? (
                  protocols.map((protocol, index) => (
                      <TableRow key={protocol.auction_id + "-" + index} className="border-b border-gray-300 last:border-0">
                        {orderedHeaders.map((headerName) => {
                          const isLocked = lockedHeaders.includes(headerName)
                          return (
                              <TableCell
                                  key={headerName}
                                  className="py-2 text-brand-gray text-sm text-center bg-white"
                                  style={{
                                    left: isLocked ? leftOffsets[headerName] : undefined,
                                    minWidth: "150px",
                                    position: isLocked ? "sticky" : "relative",
                                    zIndex: isLocked ? 25 : 1,
                                  }}
                              >
                                {getCellValue(protocol, headerName)}
                              </TableCell>
                          )
                        })}
                      </TableRow>
                  ))
              ) : (
                  <TableRow>
                    <TableCell colSpan={orderedHeaders.length} className="py-4 text-center text-gray-500">
                      {t ? t("no_protocol_data") : "No protocol data available"}
                    </TableCell>
                  </TableRow>
              )}
            </TableBody>
            <TableFooter className="w-full bg-transparent lg:hidden">
              <TableRow>
                {orderedHeaders.map((headerName) => {
                  const isLocked = lockedHeaders.includes(headerName)
                  return (
                      <TableCell
                          onClick={() => handleOnLock(headerName)}
                          key={headerName}
                          className="bg-white cursor-pointer sticky"
                          style={{
                            left: isLocked ? leftOffsets[headerName] : undefined,
                            minWidth: "150px",
                            zIndex: isLocked ? 30 : 20,
                            backgroundColor: "white",
                          }}
                      >
                        {isLocked ? <Icons.Lock_open /> : <Icons.Lock />}
                      </TableCell>
                  )
                })}
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
  )
}
