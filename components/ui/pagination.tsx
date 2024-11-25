'use client';
import * as React from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from './input';

type PaginationProps = {
  onPageChange: (page: number) => void
  totalCount: number
  siblingCount?: number
  currentPage: number
  pageSize: number
  className?: string
}

const range = (start: number, end: number) => {
  const length = end - start + 1
  return Array.from({ length }, (_, idx) => idx + start)
}

const Pagination = ({
  onPageChange,
  totalCount,
  siblingCount = 1,
  currentPage,
  pageSize,
  className = '',
}: PaginationProps) => {
  const paginationRange = React.useMemo(() => {
    const totalPageCount = Math.ceil(totalCount / pageSize)
    const totalPageNumbers = siblingCount + 6; 

    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount)
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    )

		const shouldShowLeftDots = leftSiblingIndex > 2;
		const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;		

    const firstPageIndex = 1;
		const secondLastPageIndex = totalPageCount - 1;
    const lastPageIndex = totalPageCount;

		if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 2 + 2 * siblingCount
      let leftRange = range(1, leftItemCount)

      return [...leftRange, 'DOTS', secondLastPageIndex, totalPageCount]
    }
		if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 2 + 2 * siblingCount
      let rightRange = range(
        totalPageCount - rightItemCount + 1,
        totalPageCount
      )
      return [firstPageIndex, 'DOTS', ...rightRange]
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex)
      return [firstPageIndex, 'DOTS', ...middleRange, 'DOTS', lastPageIndex]
    }
  }, [totalCount, pageSize, siblingCount, currentPage])

  if (!paginationRange || paginationRange.length < 2) {
    return null
  }

  const onNext = () => {
    onPageChange(currentPage + 1)
  }

  const onPrevious = () => {
    onPageChange(currentPage - 1)
  }
  const lastPage = paginationRange[paginationRange.length - 1]
  return (
    <nav
      role="navigation"
      aria-label="Pagination Navigation"
      className={`flex items-center justify-center space-x-2 ${className}`}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={onPrevious}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
				className='rounded-full text-xs'
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {paginationRange.map((pageNumber, index) => {
        if (pageNumber === 'DOTS') {
          return <MoreHorizontal key={index} className="h-4 w-4" />
        }
        if (typeof pageNumber === 'number') {
          return (
            <Button
							className={'text-xs rounded-full' + (currentPage === pageNumber ? ' bg-[#007FAA1F] text-[#007FAA]' : '')}
              key={index}
              variant={currentPage === pageNumber ? 'default' : 'outline'}
              size="icon"
              onClick={() => onPageChange(pageNumber)}
              aria-label={`Go to page ${pageNumber}`}
              aria-current={currentPage === pageNumber ? 'page' : undefined}
            >
              {pageNumber}
            </Button>
          )
        }
      })}
      <Button
        variant="outline"
        size="icon"
        onClick={onNext}
        disabled={currentPage === lastPage}
        aria-label="Go to next page"
				className='rounded-full text-xs'
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  )
}

export default Pagination;