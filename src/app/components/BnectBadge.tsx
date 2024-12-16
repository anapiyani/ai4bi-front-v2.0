import { Badge } from '@/components/ui/Badge'
import { BnectStatuses } from '../types/types'


const BnectBadge = ({status}: {status: BnectStatuses}) => {
	switch (status) {
		case "submission_of_applications":
			return (
				<Badge variant="outline" className='m-0 p-0'>
					<div className='bg-[#22C55E] rounded-full w-2 h-2'></div>
				</Badge>
			)
		case "bid_submission":
			return (
				<Badge variant="outline" className='m-0 p-0'>
					<div className='bg-[#0891B2] rounded-full w-2 h-2'></div>
				</Badge>
			)
		default:
			return <div className="bg-primary text-white px-2 py-1 rounded-md">Unknown status</div>
	}
}

export default BnectBadge;