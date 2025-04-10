import { getCookie } from '@/src/app/api/service/cookie'
import { ReceivedChats, TypingStatus } from '@/src/app/types/types'
import dayjs from 'dayjs'
import { motion } from "framer-motion"
import React from 'react'

type ChatListItemProps = {
  data: ReceivedChats; 
  onClick: () => void;
  isSelected: boolean;
  index: number;
  t: any;
  typingStatuses: TypingStatus[];
};

const ChatListItem = ({ data, onClick, isSelected, index, t, typingStatuses }: ChatListItemProps) => {
  const { name, lastMessage, chat_type } = data;
  const user_id = getCookie("user_id");
  const renderLastMessage = () => {
    if (typeof lastMessage === 'object') {
      return (
        <span className="text-[11px] lg:text-sm md:text-sm text-muted-foreground">
          {typingStatuses.some(status => status.chat_id === data.id) ? (
            <span className="ml-2 text-sm">
              {typingStatuses
                .filter(status => status.chat_id === data.id)
                .map((status) => status.user_first_name).join(", ")} {typingStatuses
                .filter(status => status.chat_id === data.id)
                .map((status) => status.status === "recording" ? t("isRecording") : t("isTyping")).join(", ")}
            </span>
          ) : (
            <>
              {
                lastMessage && (
                  <>
                    {lastMessage.sender_first_name && (
                      <span className="font-medium text-[11px] lg:text-sm md:text-sm">{lastMessage.sender_id === user_id ? t("you") : lastMessage.sender_first_name}: </span>
                    )}
                    {lastMessage?.content
                    ? lastMessage.content.length > 70
                      ? `${lastMessage.content.slice(0, 70)}...`
                      : lastMessage.content
                    : lastMessage?.has_attachements === true ? lastMessage?.media && lastMessage.media.length > 0 ? lastMessage.media.map((media) => t(media.media_type)).join(", ") : t("media") : t('no_messages_yet')}
                  {lastMessage?.send_at && (
                    <span className="ml-2 text-[11px] lg:text-sm md:text-sm opacity-70">
                      {dayjs(lastMessage.send_at).format("HH:mm")}
                    </span>
                    )}
                  </>
                )
              }
            </>
          )}
        </span>
      );
    } else if (typeof lastMessage === 'string') {
      return (
        <span className="text-sm text-muted-foreground">
          {lastMessage.length > 100 ? `${lastMessage.slice(0, 100)}...` : lastMessage || 'No messages yet'}
        </span>
      );
    } else {
      return <span className="text-sm text-muted-foreground">No messages yet</span>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.1 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex flex-col gap-2 hover:bg-secondary p-2 rounded-lg cursor-pointer relative ${
        isSelected ? "bg-accent" : ""
      }`}
    >
			{isSelected ? (
          <span className="absolute right-0 h-2/3 w-1 bg-primary rounded-full top-1/2 -translate-y-1/2"></span>
        ) : null}
      <div className="flex flex-row gap-2"> {/* Added 'relative' here */}
        {/* Badge's and date's of auction etc here but for now it's just a name and last message */}
        {/* <BnectBadge /> */}
        <div className="flex flex-col gap-1 w-full">
          <div className='flex items-center gap-2'>
             <p className={`text-sm lg:text-base md:text-base font-semibold break-words pr-2 ${isSelected ? "text-primary" : "text-sec-txt"}`}>
               {name}
             </p> 
            {
              data.unread_count > 0 && (
                <div className='text-xs bg-slate-200 rounded-full px-2 py-1'>
                  <p className='text-muted-foreground text-[10px] lg:text-sm md:text-sm'>{data.unread_count}</p>
                </div>
              )
            }
          </div>
          {renderLastMessage()}
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(ChatListItem);
