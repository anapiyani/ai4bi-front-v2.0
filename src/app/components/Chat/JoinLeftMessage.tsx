
type JoinLeftMessageProps = {
  type: 'auction' | 'technical_council';
	action: 'joined' | 'left';
  participant_name: string;
  t: any;
}

const JoinLeftMessage = ({type, action, participant_name, t}: JoinLeftMessageProps) => {
  return (
    <div className='flex w-full justify-center items-center'>
			{
				action === 'joined' ? (
					<p>{participant_name} {type === 'auction' ? t('joined-auction') : t('joined-technical-council')}</p>
				) : (
					<p>{participant_name} {type === 'auction' ? t('left-auction') : t('left-technical-council')}</p>
				)
			}
    </div>
  )
}