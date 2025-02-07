import { ReplyToMessage } from '@/src/app/types/types'
import Icons from '../../Icons'

const ReplyToMessageContent = ({
	reply_message_id,
	goToMessage,
	isUser,
	replyToMessage,
	t
}: {
	reply_message_id: string;
	goToMessage: (messageId: string) => void;
	isUser: boolean;
	replyToMessage: ReplyToMessage;
	t: any;
}) => {
	return (
		<div	
			onClick={(e) => {
        	e.stopPropagation();
					reply_message_id && goToMessage(reply_message_id)
      	}
    	}
                className={`mb-1 gap-2 border-l-2 pl-2 py-1 text-sm text-bi cursor-pointer ${
                  isUser
                    ? "bg-[#F1F5F933] border-secondary"
                    : "bg-[#F1F5F9] border-primary"
                }`}
              >
                <p
                  className={`${isUser ? "text-white" : "text-primary"}`}
                >
                  {replyToMessage?.sender}
                </p>
                {replyToMessage?.has_attachments
                  ? (
                      <div className="py-1 flex items-center gap-1">
                        {replyToMessage.media && typeof replyToMessage.media[0] === "object" && (
                          <>
                            {replyToMessage.media[0]?.media_type === "file" && (
                              <Icons.PDF
                                className={
                                  isUser ? "text-white" : "text-muted-foreground"
                                }
                                size={16}
                              />
                            )}
                            {replyToMessage.media[0].media_type === "image" && (
                              <Icons.Image_Small
                                fill={isUser ? "#ffffff" : "#64748B"}
                              />
                            )}
                            {replyToMessage.media[0].media_type === "video" && (
                              <Icons.Video
                                fill={isUser ? "#ffffff" : "#64748B"}
                                size={16}
                              />
                            )}
                            {replyToMessage.media[0].media_type === "audio" && (
                              <Icons.HeadPhones
                                fill={isUser ? "#ffffff" : "#64748B"}
                                size={16}
                              />
                            )}
                            <p>
                              {replyToMessage.media.length > 1 
                                ? `${replyToMessage.media.length} ${t(replyToMessage.media[0].media_type + "s")}` 
                                : t(replyToMessage.media[0].media_type)}
                            </p>
                          </>
                        )}
                      </div>
                    )
                  : null}
          <p className="text-bi pr-2">
						{replyToMessage?.content && replyToMessage?.content?.length > 60
            ? `${replyToMessage?.content?.slice(0, 40)}…`
            : replyToMessage?.content}
          </p>
      </div>
	)
}

export default ReplyToMessageContent