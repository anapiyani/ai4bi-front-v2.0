"use client";

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from "react"
import { useAudioRecorder } from '../../hooks/useAudioRecorder'
import { ChatMessage, ChatParticipants } from "../../types/types"
import BotVisualizer from '../Bot/BotVisualizer'
import Icons from '../Icons'

type MessageInputProps = {
  t: any;
  sendChatMessage: (
    message: string,
    reply?: ChatMessage | null,
    media?: string[] | null,
    is_voice_message?: boolean,
    type?: "audio"
  ) => void;
  isConnected: boolean;
  value: string;
  setNewMessage: (value: string) => void;
  replyTo: ChatMessage | null;
  setReplyTo: (message: ChatMessage | null) => void;
  editMessage: ChatMessage | null;
  setEditMessage: (message: ChatMessage | null) => void;
  // Note: updated handleEdit signature to accept the new edited text
  handleEdit: (e: React.FormEvent<HTMLFormElement>, newContent: string) => void;
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
  const [message, setMessage] = useState<string>("");
  
  // Local state for the text that will go into the Input if editing:
  const [editText, setEditText] = useState<string>("");

  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const intervalId = useRef<NodeJS.Timeout | null>(null);

  const [suggestions, setSuggestions] = useState<ChatParticipants[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  const [showMicButton, setShowMicButton] = useState<boolean>(true);
  
  const inputRef = useRef<HTMLInputElement>(null);
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
  } = useAudioRecorder({
    handleTypingChat,
    onSendAudio: (id, type) => {
      sendChatMessage(message, replyTo, [id], true, type);
    },
    chatId: chatId,
    outputFormat: "mp3"
  });

  /**
   * Decide whether we show the "Send" icon or "Mic" icon.
   */
  const isSendMode = editMessage
    ? (!isConnected || !editText.trim()) === false
    : (!isConnected || !message.trim()) === false

  useEffect(() => {
    if (editMessage) {
      setEditText(editMessage.content);
    } else {
      setEditText("");
    }
  }, [editMessage]);

  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [replyTo, editMessage]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendChatMessage(message, replyTo, null);
      setMessage("");
      setReplyTo(null);

      setShowMicButton(false);
      setTimeout(() => {
        setShowMicButton(true);
      }, 500);
    }
  };

  const handleNewMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setMessage(text);
    handleMentions(text);
    trackUserTyping();
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setEditText(text);
    handleMentions(text);
    trackUserTyping();
  };

  const handleMentions = (text: string) => {
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
  };

  const trackUserTyping = () => {
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
  };

  const handleSelectParticipant = (participant: ChatParticipants) => {
    // If editing, update editText; otherwise update message
    if (editMessage) {
      const mentionIndex = editText.lastIndexOf('@');
      const newValue =
        editText.slice(0, mentionIndex) +
        `@${participant.username} ` +
        editText.slice(mentionIndex + participant.username.length + 1);
      setEditText(newValue);
    } else {
      const mentionIndex = message.lastIndexOf('@');
      const newValue =
        message.slice(0, mentionIndex) +
        `@${participant.username} ` +
        message.slice(mentionIndex + participant.username.length + 1);
      setMessage(newValue);
    }
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

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
        if (editMessage) {
          if (editText.trim() && isConnected) {
            handleEdit(e as unknown as React.FormEvent<HTMLFormElement>, editText);
          }
        } else {
          if (message.trim() && isConnected) {
            sendChatMessage(message, replyTo);
            setMessage("");
            setReplyTo(null);

            setShowMicButton(false);
            setTimeout(() => {
              setShowMicButton(true);
            }, 500);
          }
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
      // Attempt to scroll to the highlighted suggestion
      commandRef.current.scrollTo({
        top: highlightedIndex * 24,
        behavior: "smooth"
      });
    }
  }, [highlightedIndex, showSuggestions]);

  const ChooseFiles = () => {
    setOpenDropZoneModal(true);
  };

  /**
   * Handle the main form onSubmit – if editing, finalize the edit;
   * if not editing, send a new message.
   */
  const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editMessage) {
      // finalize edit with new text
      handleEdit(e, editText);
    } else {
      // send brand-new message
      handleSend(e);
    }
  };

  return (
    <div className="relative w-full">
      {replyTo && (
        <div className="absolute bottom-10 left-0 w-full bg-white p-2 text-sm text-gray-700 flex items-start justify-between rounded-t-lg z-10 border-primary">
          <div className="flex flex-col px-3 gap-1 py-1">
            <div className="flex items-center gap-2">
              <Icons.Reply_small_blue />
              <p className='text-sm font-bold text-primary'>
                {t("reply-to")} {replyTo.sender_first_name} {replyTo.sender_last_name}
              </p>
            </div>
            <div>
              <span className="text-sm">
                {replyTo.content.length > 100
                  ? `${replyTo.content.slice(0, 100)}…`
                  : replyTo.content}
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
        <div className="absolute bottom-10 left-0 w-full bg-white p-2 text-sm text-gray-700 flex items-start justify-between rounded-t-lg z-10 border-primary">
          <div className="flex flex-col px-3 gap-1 py-1">
            <div className="flex items-center gap-2">
              <Icons.Edit_small_blue />
              <p className='text-sm font-bold text-primary'>
                {t("edit-message")}
              </p>
            </div>
            <div>
              {/* IMPORTANT: This shows the original message, not the live edit */}
              <span className="text-sm">
                {editMessage.content.length > 100
                  ? `${editMessage.content.slice(0, 100)}…`
                  : editMessage.content}
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
        onSubmit={onSubmitForm}
        className={`flex items-center gap-2 w-full pt-${replyTo ? "10" : "0"}`}
      >
        {isRecording ? (
          <div className="flex items-center gap-2 w-full">
            <Button
              onClick={() => {
                handleStopRecording();
              }}
              className="bg-white rounded-full border-none"
              variant="outline"
              size="icon"
            >
              <Icons.Chat_Trash size={24} />
            </Button>
            {isPaused ? (
              <BotVisualizer
                stream={mediaStream}
                type="user-paused"
                userSpeaking={true}
                recordingDuration={recordingDuration}
              />
            ) : (
              <BotVisualizer
                stream={mediaStream}
                type="speaking"
                userSpeaking={true}
                recordingDuration={recordingDuration}
              />
            )}
          </div>
        ) : (
          <div className='w-full'>
            <Input
              ChooseFiles={() => {
                ChooseFiles();
              }}
              ref={inputRef}
              placeholder={t("type-your-message-here")}
              // If editing, use editText; else use message
              value={editMessage ? editText : message}
              onChange={editMessage ? handleEditChange : handleNewMessageChange}
              onKeyDown={handleKeyDown}
              className="w-full focus:ring-0 focus:border-none border-none focus:outline-none"
              icon={<Icons.Choose_files />}
            />
          </div>
        )}

        {showSuggestions && suggestions.length > 0 && (
          <Command
            ref={commandRef}
            className="absolute bottom-[40px] left-0 w-full max-w-[300px] rounded-lg border shadow-lg h-fit overflow-y-auto"
          >
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
        )}

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
          ) : showMicButton ? (
            <motion.button
              key="mic-icon"
              type="button"
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
          ) : (
            <div className="w-10 h-10"></div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

export default MessageInput;
