
export type activity_status = "chat" | "technical-council" | "auction-results" | "auction";

export type ChatStatus = 'all' | 'active' | 'published' | 'in-progress' | 'completed'

export type BnectStatuses = "submission_of_applications" | "bid_submission" // more statuses could be added here

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

export type Conversation = {
  id: string;
  name: string;
  lastMessage: {
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
		sender_last_name: string | null;
		type: string | null;
	} | null | string;
}

export type ChatMessage = {
  id: string;
	sender_first_name: string;
	sender_last_name: string;
  content: string;
  timestamp: string;
  pending?: boolean;
  authorId?: string | null;
  chat_id?: string;
}