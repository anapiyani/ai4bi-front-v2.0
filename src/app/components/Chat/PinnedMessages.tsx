import { useEffect, useState } from 'react'
import { ChatMessage } from '../../types/types'
import Icons from '../Icons'

const PinnedMessages = ({ pinnedMessages, t, goToMessage, handleUnpinMessage }: { 
  pinnedMessages: ChatMessage[], 
  t: any, 
  goToMessage: (messageId: string, isPinned: boolean) => void,
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
    goToMessage(currentMessage.id, true);
    
    setCurrentIndex((prevIndex) => {
      if (prevIndex <= 0) {
        return pinnedMessages.length - 1;
      }
      return prevIndex - 1;
    });
  };

  return (
    <div 
      className="bg-white px-4 py-2 z-50" 
    >
      <div className="flex justify-between items-center">
        <div onClick={handleMessageClick} className="text-sm flex cursor-pointer flex-col gap-1">
        <div className="relative flex justify-center items-center">
          {pinnedMessages.map((_, index) => (
            <div
              key={index}
              className={`absolute left-0 w-[3px] mt-2 rounded-full ${
                index === currentIndex ? "bg-primary" : "bg-gray-300"
              } h-3`}
              style={{
                top: `${index * 18}px`,
                opacity: Math.max(0.3, 1 - Math.abs(index - currentIndex) * 0.3),
              }}
            />
          ))}
        </div>
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