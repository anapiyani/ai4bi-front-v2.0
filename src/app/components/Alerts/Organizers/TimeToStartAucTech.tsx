import { Button } from '@/components/ui/button'
import dayjs from 'dayjs'
import { useTranslations } from 'next-intl'
const TimeToStartAucTech = ({
	body,
	buttons,
	chat_id,
	created_at,
	expiration_time,
	header,
}: {
	body: string,
	buttons: any[],
	chat_id: string,
	created_at: string,
	expiration_time: string,
	header: string,
}) => {
	const t = useTranslations('dashboard')
	return (
			<div className="flex items-center justify-center w-full mt-3">
				<div className="w-[500px] bg-white rounded-lg p-6">
					<div className="space-y-4">
						<div>
							<h2 className="text-lg font-semibold">
								{body}
							</h2>
							<p className="text-sm text-gray-500">
								{dayjs(created_at).format('DD.MM.YYYY')} / {expiration_time ? dayjs(expiration_time).format('DD.MM.YYYY') : 'No expiration time added'}
							</p>
						</div>
						<div className="flex justify-end gap-3">
							{
								buttons.map((button) => (
									<Button key={button.id} variant={button.button_style === 'primary' ? 'default' : 'outline'}>
										{button.label}
									</Button>
								))
							}
						</div>
						<p className="w-full flex justify-center items-center">
							arrow up
						</p>
					</div>
				</div>
			</div>
		)
}

export default TimeToStartAucTech;