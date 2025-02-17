"use client";

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Input } from "@/components/ui/input"
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from "react"
import { useAudioRecorder } from '../../hooks/useAudioRecorder'
import { ChatMessage, ChatParticipants } from "../../types/types"
import BotVisualizer from '../Bot/BotVisualizer'
import Icons from '../Icons'
type MessageInputProps = {
  t: any;
  sendChatMessage: (reply?: ChatMessage | null, media?: string[] | null, is_voice_message?: boolean, type?: "audio") => void;
  isConnected: boolean;
  value: string;
  setNewMessage: (value: string) => void;
  replyTo: ChatMessage | null;
  setReplyTo: (message: ChatMessage | null) => void;
  editMessage: ChatMessage | null;
  setEditMessage: (message: ChatMessage | null) => void;
  handleEdit: (e: React.FormEvent<HTMLFormElement>) => void;
  openDropZoneModal: boolean;
  setOpenDropZoneModal: (open: boolean) => void;
  handleTypingChat: (status: "typing" | "recording" | "stopped") => void;
  chatId: string;
  participants: ChatParticipants[];
};

const MessageInput = ({
  t,
  sendChatMessage,
  isConnected,
  value,
  setNewMessage,
  replyTo,
  setReplyTo,
  editMessage,
  setEditMessage,
  participants,
  handleEdit,
  openDropZoneModal,
  handleTypingChat,
  setOpenDropZoneModal,
  chatId
}: MessageInputProps) => {
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const intervalId = useRef<NodeJS.Timeout | null>(null);
  const [suggestions, setSuggestions] = useState<ChatParticipants[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  let inputRef = useRef<HTMLInputElement>(null);
  const commandRef = useRef<HTMLDivElement>(null);
  const {
    isRecording,
    isPaused,
    handleStartRecording,
    handleStopAndSend,
    handlePauseResume,
    recordingDuration,
    mediaStream,
    handleStopRecording
  } = useAudioRecorder({ handleTypingChat,
    onSendAudio: (id, type) => {
      sendChatMessage(replyTo, [id], true, type);
    },
    chatId: chatId,
    outputFormat: "mp3"
   });

  const isSendMode = editMessage
    ? (!isConnected || !editMessage.content.trim()) === false
    : (!isConnected || !value.trim()) === false

  useEffect(() => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 200);
  }, [replyTo, editMessage]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      sendChatMessage(replyTo, null);
      setNewMessage("");
      setReplyTo(null);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editMessage) {
      setEditMessage({ ...editMessage, content: e.target.value });
    } else {
      const text = e.target.value;
      setNewMessage(text);
      const regex = /(?:^|\s)@([^\s]*)/g;
      const matches = Array.from(text.matchAll(regex));
      
      if (matches.length > 0) {
        const lastMatch = matches[matches.length - 1];
        const username = lastMatch[1];
        const filteredParticipants = username 
          ? participants.filter(p => 
              p.username.toLowerCase().includes(username.toLowerCase())
            )
          : participants;
        
        setSuggestions(filteredParticipants);
        setShowSuggestions(true);
        setHighlightedIndex(0);
      } else {
        setShowSuggestions(false);
      }
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      if (!intervalId.current) {
        handleTypingChat("typing");
        intervalId.current = setInterval(() => {
          handleTypingChat("typing");
        }, 3000);
      }
      timeoutId.current = setTimeout(() => { 
        if (intervalId.current) {
          clearInterval(intervalId.current);
          intervalId.current = null;
          handleTypingChat("stopped");
        }
      }, 3000);
    }
  };

  const ChooseFiles = () => {
    setOpenDropZoneModal(true);
  }

  const handleSelectParticipant = (participant: ChatParticipants) => {
    const currentValue = editMessage ? editMessage.content : value
    const mentionIndex = currentValue.lastIndexOf('@')
    const newValue = 
      currentValue.slice(0, mentionIndex) + 
      `@${participant.username} ` +
      currentValue.slice(mentionIndex + participant.username.length + 1)
    
    if (editMessage) {
      setEditMessage({ ...editMessage, content: newValue })
    } else {
      setNewMessage(newValue)
    }
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showSuggestions && suggestions.length > 0) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex(prev => (prev + 1) % suggestions.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex(prev => 
            prev === 0 ? suggestions.length - 1 : prev - 1
          );
          break;
        case "Enter":
        case "Tab":
          e.preventDefault();
          handleSelectParticipant(suggestions[highlightedIndex]);
          break;
        default:
          break;
      }
    } else {
      if (e.key === "Enter" && e.shiftKey) {
        e.preventDefault();
        if (value.trim() && isConnected) {
          sendChatMessage(replyTo); 
          setNewMessage("");
          setReplyTo(null);
        }
      } else if (e.key === "Escape") {
        setReplyTo(null);
        setEditMessage(null);
      }
    }
  };


  useEffect(() => {
    return () => {
      if (timeoutId.current) clearTimeout(timeoutId.current);
      if (intervalId.current) clearInterval(intervalId.current);
    };
  }, []);

  useEffect(() => {
    if (commandRef.current && showSuggestions) {
      commandRef.current.scrollTo({ top: highlightedIndex * 24, behavior: "smooth" });
    }
  }, [highlightedIndex, showSuggestions]);

  return (
    <div className="relative w-full"> 
      {replyTo && (
        <div className="absolute bottom-10 left-0 w-full bg-white p-2 text-sm text-gray-700 flex items-start justify-between rounded-t-lg z-10  border-primary">
          <div className="flex flex-col px-3 gap-1 py-1">
            <div className="flex items-center gap-2">
              <Icons.Reply_small_blue />
              <p className='text-sm font-bold text-primary'>{t("reply-to")} {replyTo.sender_first_name} {replyTo.sender_last_name}</p>
            </div>
            <div>
              <span className="text-sm">
                {replyTo.content.length > 100 ? `${replyTo.content.slice(0, 100)}…` : replyTo.content}
              </span>
            </div>
          </div>
          <button
            onClick={() => setReplyTo(null)}
            className="text-xs h-full"
          >
            <Icons.Close />
          </button>
        </div>
      )}
      {editMessage && (
          <div className="absolute bottom-10 left-0 w-full bg-white p-2 text-sm text-gray-700 flex items-start justify-between rounded-t-lg z-10  border-primary">
            <div className="flex flex-col px-3 gap-1 py-1">
              <div className="flex items-center gap-2">
                <Icons.Edit_small_blue />
                <p className='text-sm font-bold text-primary'>{t("edit-message")}</p>
              </div>
              <div>
                <span className="text-sm">
                  {editMessage.content.length > 100 ? `${editMessage.content.slice(0, 100)}…` : editMessage.content}
                </span>
              </div>
            </div>
            <button
              onClick={() => setEditMessage(null)}
              className="text-xs h-full"
            >
              <Icons.Close />
            </button>
        </div>
      )}
       <form
        onSubmit={(e) => {
          if (editMessage) {
            handleEdit(e);
          } else {
            handleSend(e);
          }
        }}
        className={`flex items-center gap-2 w-full pt-${
          replyTo ? "10" : "0"
        }`}
      >
        {
          isRecording ? (
            <div className="flex items-center gap-2 w-full">
              <Button onClick={() => {
                handleStopRecording();
              }} className="bg-white rounded-full border-none" variant="outline" size="icon">
                <Icons.Chat_Trash size={24} />
              </Button>
              {
                isPaused ? (
                  <BotVisualizer stream={mediaStream} type="user-paused" userSpeaking={true} recordingDuration={recordingDuration} />
                ) : (
                  <BotVisualizer stream={mediaStream} type="speaking" userSpeaking={true} recordingDuration={recordingDuration} />
                )
              }
            </div>
          ) : (
            <Input
              ChooseFiles={() => {
                ChooseFiles();
              }}
              ref={inputRef}
              placeholder={t("type-your-message-here")}
              onChange={handleEditChange}
              onKeyDown={handleKeyDown}
              value={editMessage ? editMessage.content : value}
              className="w-full focus:ring-0 focus:border-none border-none focus:outline-none"
              icon={<Icons.Choose_files />}
            />
          )
        }
        {
          showSuggestions && suggestions.length > 0 && (
            <Command ref={commandRef} className="absolute bottom-[40px] left-0 w-full max-w-[300px] rounded-lg border shadow-lg h-fit overflow-y-auto">
              <CommandList>
                <CommandGroup>
                  {suggestions.map((user, index) => (
                    <CommandItem
                      key={user.user_id}
                      value={user.username}
                      onSelect={() => handleSelectParticipant(user)}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelectParticipant(user);
                      }}
                      onKeyDown={handleKeyDown}
                      className={`
                        cursor-pointer gap-3 
                        ${highlightedIndex === index ? "bg-accent text-accent-foreground" : ""}
                      `}
                    >
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">
                          @{user.username}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandEmpty>{t("no-users-found")}</CommandEmpty>
              </CommandList>
            </Command>
          )
        }
        <AnimatePresence mode="wait">
          {isRecording ? (
            <motion.div
              key="recording-ui"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={handlePauseResume}
                className="bg-primary rounded-full p-2"
              >
                {isPaused ? (
                  <Icons.Play stroke="#ffff" size={24} />
                ) : (
                  <Icons.Pause stroke="#ffff" size={24} />
                )}
              </button>

              <button
                type="button"
                onClick={handleStopAndSend}
                className="bg-primary rounded-full p-2"
              >
                <Icons.Send size={24} />
              </button>
            </motion.div>
          ) : isSendMode ? (
            <motion.button
              key="send-icon"
              type="submit"
              className="bg-primary rounded-full p-2"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Icons.Send size={24} />
            </motion.button>
          ) : (
            <motion.button
              key="mic-icon"
              className="bg-primary rounded-full p-2"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleStartRecording}
              onTouchStart={handleStartRecording}
            >
              <Icons.ChatMicrophone size={24} />
            </motion.button>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

export default MessageInput;
