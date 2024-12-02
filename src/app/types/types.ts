export type HeaderType = "auction" | "technical-council" | "chat" | "auction-results"

export type PopUpHandlers = {
	stayButtonClick: () => void,
	exitButtonClick: () => void
}