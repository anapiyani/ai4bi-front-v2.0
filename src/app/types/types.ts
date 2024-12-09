export type activity_status = "chat" | "technical-council" | "auction-results" | "auction";

export type PopUpHandlers = {
	stayButtonClick: () => void,
	exitButtonClick: () => void
}