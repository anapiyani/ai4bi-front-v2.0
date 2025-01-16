"use client"

import { useChatWebSocket } from './useChatWebSocket'

export const useChat = (chatId: string, type: "technical-council" | "auction" | "chat") => {
	const {
		selectedConversation,
		conversations,
		newMessage,
		setNewMessage,
		sendChatMessage,
		getChatMessages,
		addAuctionChatParticipant,
		scrollRef,
		messages,
	} = useChatWebSocket();

	return {
		conversations,
		selectedConversation,
		newMessage,
		setNewMessage,
		sendChatMessage,
		getChatMessages,
		addAuctionChatParticipant,
		scrollRef,
		messages
	}
}

