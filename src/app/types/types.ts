
export type activity_status = "chat" | "technical-council" | "auction-results" | "auction";

export type ChatStatus = 'all' | 'active' | 'published' | 'in-progress' | 'completed'

export type BnectStatuses = "submission_of_applications" | "bid_submission" // more statuses could be added here

export type ChatListItemData = {
	active: boolean;
	status: Exclude<ChatStatus, 'all'>;
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