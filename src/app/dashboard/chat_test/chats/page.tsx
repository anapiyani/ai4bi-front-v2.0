'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useWebSocket } from '@/src/app/api/service/useWebSocket'
import { MessageCircle, Search, Send, UserPlus } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Conversation {
  id: string
  name: string
  lastMessage: string
  avatar: string
}

interface Message {
  id: string
  sender: string
  content: string
  timestamp: string
}

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://0.0.0.0:8000/ws/';

export default function WebSocketChat() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const { sendMessage, isConnected, lastMessage } = useWebSocket(WS_URL);

  useEffect(() => {
    if (isConnected) {
      sendMessage({
        type: 'subscribe',
        channel: 'chat_updates',
      });
    }
  }, [isConnected, sendMessage]);

  useEffect(() => {
    if (lastMessage) {
      handleWebSocketMessage(lastMessage);
    }
  }, [lastMessage]);

 const handleWebSocketMessage = (message: any) => {
    console.log('Received message:', message);
    if (message.jsonrpc === "2.0" && message.result) {
      if (message.result.chat_id) {
        handleChatCreated(message.result);
      } else if (message.result.message_id) {
        handleMessageReceived(message.result);
      }
    } else if (message.type === 'message_received') {
      handleMessageReceived(message);
    } else {
      console.log('Unhandled message:', message);
    }
  };


  const handleChatCreated = (result: any) => {
    console.log('Chat created:', result);
    const newChat: Conversation = {
      id: result.chat_id,
      name: `chat id: ${result.chat_id}`,
      lastMessage: '',
      avatar: '/placeholder.svg?height=32&width=32'
    };
    setConversations(prev => {
      const updatedConversations = [...prev, newChat];
      console.log('Updated conversations:', updatedConversations);
      return updatedConversations;
    });
    setSelectedConversation(result.chat_id);
    console.log(result.chat_id + " this is the chat id")
    subscribeToChatRoom(result.chat_id);
  };

  const handleMessageReceived = (message: any) => {
    const newMessage: Message = {
      id: message.message_id,
      sender: message.sender,
      content: message.content,
      timestamp: message.timestamp
    };

    setMessages(prev => [...prev, newMessage]);
    setConversations(prev => prev.map(conv => 
      conv.id === message.chat_id 
        ? { ...conv, lastMessage: message.content } 
        : conv
    ));
  };

  const createPrivateChat = async (userId: string) => {
    const rpcId = Date.now().toString();
    const request = {
      jsonrpc: "2.0",
      method: "createPrivateChat",
      params: { user_id: userId },
      id: rpcId,
    };
    console.log('Sending createPrivateChat request:', request);
    sendMessage(request);
  };

  const sendChatMessage = () => {
    if (newMessage.trim() === '' || !selectedConversation) return;

    const rpcId = Date.now().toString();
    sendMessage({
      jsonrpc: "2.0",
      method: "sendMessage",
      params: {
        chat_id: selectedConversation,
        content: newMessage,
        media: []
      },
      id: rpcId,
    });

    setNewMessage('');
  };

  const subscribeToChatRoom = (chatId: string) => {
    sendMessage({
      type: "subscribe",
      channel: "chat_room",
      chat_id: chatId
    });
  };

  useEffect(() => {
    console.log('Conversations updated:', conversations);
  }, [conversations]);

  useEffect(() => {
    if (selectedConversation) {
      console.log(`Subscribing to chat room: ${selectedConversation}`);
      subscribeToChatRoom(selectedConversation);
    }
  }, [selectedConversation]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Card className="w-80 h-full rounded-none border-r">
        <CardHeader className="p-4">
          <CardTitle className="text-xl font-bold">Chats</CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search conversations" className="pl-8" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-180px)]">
            {conversations.map((conversation) => (
              <Button
                key={conversation.id}
                variant="ghost"
                className={`w-full justify-start px-4 py-3 ${
                  selectedConversation === conversation.id ? 'bg-muted' : ''
                }`}
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <div>
                  {conversation.name}
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-semibold">{conversation.name}</span>
                  <span className="text-sm text-muted-foreground">{conversation.lastMessage}</span>
                </div>
              </Button>
            ))}
          </ScrollArea>
        </CardContent>
        <CardFooter className="p-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              const userId = prompt("Enter the user ID to start a chat with:");
              if (userId) {
                createPrivateChat(userId);
              }
            }}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Start New Chat
          </Button>
        </CardFooter>
      </Card>
      <Card className="flex-1 rounded-none">
        {selectedConversation ? (
          <>
            <CardHeader className="border-b p-4">
              <CardTitle className="text-xl font-bold">
                {conversations.find(c => c.id === selectedConversation)?.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ScrollArea className="h-[calc(100vh-220px)]">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex mb-4 ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.sender !== 'You' && (
                      <div>
                        {message.sender}
                      </div>
                    )}
                    <div
                      className={`rounded-lg p-2 max-w-[70%] ${
                        message.sender === 'You' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}
                    >
                      <p>{message.content}</p>
                      <span className="text-xs text-muted-foreground block mt-1">{message.timestamp}</span>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
            <CardFooter className="border-t p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  sendChatMessage()
                }}
                className="flex w-full items-center space-x-2"
              >
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!isConnected}>
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </CardFooter>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-semibold">No Conversation Selected</h3>
              <p className="text-muted-foreground">Choose a conversation or start a new one</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

