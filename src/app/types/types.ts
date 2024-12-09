
export type activity_status = "chat" | "technical-council" | "auction-results" | "auction";

export type ChatStatus = 'all' | 'active' | 'published' | 'in-progress' | 'completed'

export type BnectStatuses = "submission_of_applications" | "bid_submission" // more statuses could be added here

export type ChatListItemData = {
	active: boolean;
	status: string;
	bnect_status: BnectStatuses;
	start_date: string;
	end_date: string;
	title: string;
	id: string;
}

export type PopUpHandlers = {
	stayButtonClick: () => void,
	exitButtonClick: () => void
}
export type ChatItem = {
  id: string
  title: string
  start_date: string
  end_date: string
  status: Exclude<ChatStatus, 'all'>
  active?: boolean
}

export type ChatListProps = {
  items: ChatItem[]
  status: ChatStatus
}