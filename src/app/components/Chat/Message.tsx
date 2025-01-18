"use client"

import React from 'react'

type Sender = 'bot' | 'user' | string;

interface MessageProps {
  message: string;
  sender: Sender;
  t: (key: string) => string; // i18n translator
  timestamp: string;
  showSender: boolean; // New prop to control sender visibility
}

const Message = ({ message, sender, t, timestamp, showSender }: MessageProps) => {
  const isBot = sender === 'bot';
  const isUser = sender === 'user';

  // 1) Make a short text for the avatar
  const avatarText = React.useMemo(() => {
    if (isBot) {
      return t('aray-bot').slice(0, 2).toUpperCase();
    } else if (isUser) {
      return t('you').slice(0, 2).toUpperCase();
    } else if (typeof sender === 'string') {
      const nameParts = sender.split(' ');
      const initials = nameParts.length >= 2 
        ? `${nameParts[0][0]}${nameParts[1][0]}`
        : `${nameParts[0][0]}`;
      return initials.toUpperCase();
    }
    return '?';
  }, [sender, t, isBot, isUser]);

  // 2) Full name label
  const senderName = isBot ? t('aray-bot') : isUser ? t('you') : sender;

  // 3) Avatar styles
  const avatarClasses = `w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
    isBot ? 'bg-primary text-white' : 'bg-input text-secondary-foreground'
  }`;

  // 4) Bubble classes
  const messageClasses = `flex flex-col p-2 rounded-lg w-fit max-w-md ${
    isBot
      ? 'bg-gradient-to-r from-[#0284C7] to-[#77BAAA]'
      : isUser
      ? 'bg-input ml-auto'
      : 'bg-primary-foreground'
  }`;  

  const textClasses = `text-sm font-normal px-2 text-start text-wrap break-words ${
    isBot ? 'text-white' : 'text-secondary-foreground'
  }`;

  return (
    <div className={`flex flex-col gap-2 ${isUser ? 'w-full flex justify-end' : ''}`}>
      {showSender && (
        <div className="flex items-center gap-2">
          {!isUser && (
            <div className={avatarClasses}>
              {avatarText}
            </div>
          )}
          <p
            className={`text-sm font-medium text-muted-foreground cursor-pointer ${
              isUser ? 'ml-auto' : ''
            }`}
          >
            {senderName}
          </p>
          {isUser && (
            // optional alignment dummy
            <div className={avatarClasses + ' w-0'} />
          )}
        </div>
      )}

      <div className={messageClasses}>
        <p className={textClasses}>
          {message}
        </p>
        {/* Timestamp in bottom-right corner, Telegram style */}
        <div className="flex justify-end">
          <p className="text-[10px] text-muted-foreground">
            {timestamp}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Message;
