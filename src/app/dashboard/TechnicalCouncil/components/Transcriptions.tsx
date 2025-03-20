import { convertTo24HourFormat } from '@/src/app/hooks/useConvertTo24HourFormat'

const Transcriptions = ({
	time,
	user,
	text,
}: {
	time: string
	user: string
	text: string
}) => {
  return (
		<div className='w-full flex flex-col gap-1 min-h-14 bg-neutrals-secondary rounded-lg p-2'>
			<div className='flex gap-2'>
				<p className='text-brand-gray text-sm'>{convertTo24HourFormat(time)}</p>
				<p className='text-brand-gray font-semibold text-sm'>{user}</p>
			</div>
			<div>
				<p className='text-brand-gray text-sm'>{text}</p>
			</div>
		</div>
	)
}

export default Transcriptions
