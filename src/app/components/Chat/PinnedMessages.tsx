import { useEffect, useState } from 'react'
import { ChatMessage } from '../../types/types'
import Icons from '../Icons'

const PinnedMessages = ({ pinnedMessages, t, goToMessage, handleUnpinMessage }: { 
  pinnedMessages: ChatMessage[], 
  t: any, 
  goToMessage: (messageId: string) => void,
	handleUnpinMessage: (messageId: string) => void
}) => {
	const [currentIndex, setCurrentIndex] = useState(
		pinnedMessages.length > 0 ? pinnedMessages.length - 1 : 0
	);
	
	useEffect(() => {
    if (pinnedMessages.length === 0) {
      setCurrentIndex(0);
    } else if (currentIndex >= pinnedMessages.length) {
      setCurrentIndex(pinnedMessages.length - 1);
    }
  }, [pinnedMessages, currentIndex]);

  if (pinnedMessages.length === 0) return null;

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
      className="bg-white px-4 py-2 " 
    >
      <div className="flex justify-between items-center">
        <div onClick={handleMessageClick} className="text-sm flex cursor-pointer flex-col gap-1">
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
        <div onClick={() => handleUnpinMessage(pinnedMessages[currentIndex].id)} className="text-sm text-gray-500 cursor-pointer">
          <Icons.UnPin />
        </div>
      </div>
    </div>
  );
};

export default PinnedMessages;