
export type activity_status = "chat" | "technical-council" | "auction-results" | "auction";

export type ChatStatus = 'all' | 'active' | 'published' | 'in-progress' | 'completed'

export type BnectStatuses = "submission_of_applications" | "bid_submission" // more statuses could be added here

export type Sender = "bot" | "user" | string;

export type ChatListItemData = {
	active: boolean;
	status: Exclude<ChatStatus, 'all'>;
	bnect_status?: BnectStatuses;
	start_date: string;
	end_date?: string;
	title: string;
	id: string;
}

export type PopUpHandlers = {
	stayButtonClick: () => void,
	exitButtonClick: () => void
}

export type ChatIdStatuses = {
	planned_auction: string,
	planned_technical_council: string,
	time_to_start_auction: string, // for an admin
	time_to_start_technical_council: string, // for an admin
	auction_on_progress: string,
	technical_council_on_progress: string,
	auction_completed: string, 
	technical_council_completed: string, 
}

export type MyData = {
	created_at: string
	deleted_at: string | null
	email: string
	first_name: string
	last_name: string
	middle_name: string
	phone: string
	role: string
	updated_at: string
	uuid: string
}

export type Media = {
	extension: string;
	media_id: string;
	media_type: "image" | "video" | "audio" | "file";
	mime_type: string;
	name: string;
	type?: "image" | "file";
	size: number;
	media_metadata?: {
		original_filename: string;
	};
	message_id?: string;
}

export type LastMessage = {
	chat_id: string | null;
	content: string | null;
	counter: number | null;
	deleted_at: string | null;
	delivered_at: string | null;
	edited_at: string | null;
	is_deleted: boolean | null;
	is_edited: boolean | null;
	media_ids: string[] | null;
	message_id: string | null;
	reply_message_id: string | null;
	send_at: string | null;
	sender_first_name: string | null;
	sender_id: string | null;
	media: Media[] | null;	
	has_attachements: boolean | null;
	sender_last_name: string | null;
	type: string | null;
  is_pinned?: boolean | null;
} 
export type Conversation = {
  id: string;
  name: string;
  chat_type: "private" | "auction_chat";
  lastMessage: LastMessage | null | string;
	participants: ChatParticipants[]
}

export interface ReceivedChats extends Conversation {
	chat_id: string;
	created_at: string;
	participants: ChatParticipants[];
	last_message: LastMessage | null | string;
	unread_count: number;
	updated_at: string | null;
}

export type ChatParticipants = {
	chat_participant_id: string;
	user_id: string;
	role: string;
	created_at: string;
	removed_at: string | null;
	username: string;
}

export type ChatMessage = {
  id: string;
	sender_first_name: string;
	sender_last_name: string;
  content: string;
  timestamp: string;
  pending?: boolean;
	type?: string;
  authorId?: string | null;
	forwarded_from?: string | null;
	forwarded_from_first_name?: string | null;
	forwarded_from_last_name?: string | null;
  chat_id?: string;
	counter?: number | null;
	is_voice_message?: boolean;
	reply_to?: string | null;
  is_edited?: boolean;
	media?: Media[] | null | string[];
	has_attachements?: boolean;
  is_pinned?: boolean;
	// tagged_user_id?: string | null;
}

export type EditMessage = {
  id: string;
  content: string;
}

export type ChatContentProps = {
	chatId: string | null;
  selectedConversation: string | null;
  title: string;
	participants: ChatParticipants[];
  messages: ChatMessage[];
  isConnected: boolean;
  newMessage: string;
  setNewMessage: (message: string) => void;
  sendChatMessage: (reply?: ChatMessage | null, media?: string[] | null, is_voice_message?: boolean, type?: "audio") => void;
  handleOpenDeleteMessage: (messageId: string | string[]) => void;
  createPrivateChat: (userId: string) => void;
  sendEditMessage: (message: ChatMessage) => void;
  setOpenMenu: (open: boolean) => void;
	handleReadMessage: (counter: number) => void;
  openMenu: boolean;
  handlePinMessage: ({chat_id, message_id}: {chat_id: string, message_id: string}) => void;
  handleUnpinMessage: ({chat_id, message_id}: {chat_id: string, message_id: string}) => void;
	handleForwardMessage: (forwardData: ForwardData) => void;
  handleTyping: (status: "typing" | "recording" | "stopped", chat_id: string) => void;
	typingStatuses: TypingStatus[];
	conversations: Conversation[];
}

export type UploadMediaResponse = {
	bucket: string,
	compress_image: string | null,
	content_type: string,
	created_at: string,
	deleted_at: string | null,
	extension: string,
	materialized_name: string,
	materialized_path: string,
	real_path: string,
	restore_path: string | null,
	uuid: string,
}

export interface MessageProps {
  message: string;
  sender: Sender;
  t: (key: string) => string;
  sender_id: string | null;
  timestamp: string;
  showSender: boolean;
  handleOpenDeleteMessage: (messageId: string) => void;
  messageId: string;
	forwarded_from?: string | null;
	forwarded_from_first_name?: string | null;
	forwarded_from_last_name?: string | null;
  handleReplyClick?: () => void;
	type?: string;
  handleEditClick?: () => void;
	counter?: number | null;
  reply_message_id: string | null;
  goToMessage: (messageId: string) => void;
  replyToMessage?: ReplyToMessage;
  createPrivateChat: (userId: string) => void;
  isEdited: boolean;
  handlePin: (message_id: string) => void;
  handleUnpin: (message_id: string) => void;
	handleForward: () => void;
  isPinned: boolean;
  media: Media[] | string[] | null | undefined;
	handleSelectMessages: (action: SelectActions) => void;
	selectedMessages: string[];
}

export type ForwardData = {
	message_ids: string[];
	source_chat_id: string;
	target_chat_id: string;
}

export type AutoCompleteResponse = {
	created_at: string;
	deleted_at: string | null;
	email: string;
	first_name: string;
	last_name: string;
	middle_name: string;
	phone: string;
	role: string;
	updated_at: string | null;
	username: string;
	uuid: string;
}

export type TypingStatus = {
	chat_id: string;
	user_id: string;
	user_first_name: string;
	status: "typing" | "recording" | "stopped";
}


export type CreatePrivateChatResponse = {
  chat_id: string;
  name: string;
  chat_type: "private";
  created_at: string;
  updated_at: string;
  participants: {
    chat_participant_id: string;
    user_id: string;
    chat_id: string;
    role: string;
    created_at: string;
    username: string;
    removed_at: string | null;
  }[]
}

export type SelectActions = "select" | "unselect" | "select_all" | "unselect_all" | "delete_selected" | "forward_selected"

export type ReplyToMessage = {
    sender: string;
    content: string;
    has_attachments: boolean;
    media: string[] | null | {
      extension: string;
      media_id: string;
      media_type: "image" | "video" | "audio" | "file";
      mime_type: string;
      name: string;
    }[]
  } | null;

export type MessagesRecord = {
	[chatId: string]: ChatMessage[]
}

export type ChatPanelMedia = {
	total: number;
	media: Media[]
	type?: "image" | "file"
}

export type InterestsResponse = {
	interest_id: string;
	name: string;
	city: string;
}