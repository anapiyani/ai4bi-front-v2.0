interface JoinLeftMessageProps {
  type: 'auction' | 'technical_council';
  action: 'joined' | 'left' | 'active';
  participant_name: string;
  t: (key: string) => string;
}

const JoinLeftMessage = ({ type, action, participant_name, t }: JoinLeftMessageProps) => {
  if (action === 'active') return null;

  const messageKey = `${action}-${type}`;
  const commonClasses = 'text-sm text-secondary-foreground';

  return (
    <div className="flex w-full justify-center items-center">
      <div className="flex items-center gap-2">
        <p className={`${commonClasses} font-bold`}>{participant_name}</p>
        <p className={`${commonClasses} font-medium`}>
          {t(messageKey)}
        </p>
      </div>
    </div>
  );
};

export default JoinLeftMessage;