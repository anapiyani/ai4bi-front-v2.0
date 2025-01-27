import { useState } from 'react'
import { ChatMessage } from '../../types/types'
import Icons from '../Icons'

const PinnedMessages = ({ pinnedMessages, t, goToMessage }: { 
  pinnedMessages: ChatMessage[], 
  t: any, 
  goToMessage: (messageId: string) => void 
}) => {
  const [currentIndex, setCurrentIndex] = useState(Math.max(0, pinnedMessages.length));

  if (pinnedMessages.length === 0) return null;

  console.log(pinnedMessages[currentIndex]);

  const handleMessageClick = () => {
    const currentMessage = pinnedMessages[currentIndex];
    goToMessage(currentMessage.id);
    
    setCurrentIndex((prevIndex) => {
      if (prevIndex <= 0) {
        return pinnedMessages.length - 1;
      }
      return prevIndex - 1;
    });
  };

  return (
    <div 
      className="bg-white px-4 py-2 cursor-pointer" 
      onClick={handleMessageClick}
    >
      <div className="flex justify-between items-center">
        <div className="text-sm flex flex-col gap-1">
          <div className="absolute top-1/4 left-3 w-[3px] h-1/2 bg-primary rounded-full"></div>
          <div className="flex flex-col ml-2">
            <div className="flex flex-row items-center">
              <h3 className="text-sm font-medium text-primary">
                {t("pinned_message")}
              </h3>
            </div>
            <p className="text-xs text-gray-500">
              {pinnedMessages[currentIndex].content}
            </p>
          </div>
        </div>
        <div className="text-sm text-gray-500 cursor-pointer">
          <Icons.UnPin />
        </div>
      </div>
    </div>
  );
};

export default PinnedMessages;