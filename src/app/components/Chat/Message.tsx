
type Sender = 'bot' | 'user' | string;

interface MessageProps {
  message: string;
  sender: Sender;
  t: (key: string) => string;
}

const Message = ({ message, sender, t }: MessageProps) => {
  const isBot = sender === 'bot';
  const isUser = sender === 'user';

  const avatarClasses = `w-6 h-6 rounded-full ${
    isBot ? 'bg-primary' : 'bg-input'
  } ${isUser ? 'ml-auto' : ''}`;

  const messageClasses = `flex flex-col p-2 rounded-lg w-fit max-w-[50%] ${
    isBot
      ? 'bg-gradient-to-r from-[#0284C7] to-[#77BAAA]'
      : isUser
      ? 'bg-input ml-auto'
      : 'bg-primary-foreground'
  }`;

  const textClasses = `text-sm font-normal px-2 text-start ${
    isBot ? 'text-white' : 'text-secondary-foreground'
  }`;

  const senderName = isBot ? t('aray-bot') : isUser ? t('you') : sender;

  const messageContent = (
    <>
      <div className="flex items-center gap-2">
        {!isUser && <div className={avatarClasses} />}
        <p className={`text-sm font-medium text-muted-foreground cursor-pointer ${isUser ? 'ml-auto' : ''}`}>{senderName}</p>
        {isUser && <div className={avatarClasses + `w-0`} />}
      </div>
      <div className={messageClasses}>
        <p className={textClasses}>{message}</p>
      </div>
    </>
  );

  return (
    <div
      className={`flex flex-col gap-2 ${
        isUser ? 'w-full flex justify-end' : ''
      }`}
    >
      {messageContent}
    </div>
  );
};

export default Message;