

export const useChat = (chatId: string) => {
	// for now we just give some example data.
	// in the future we will get the data from the server and return it.
	if (chatId === "1") {
		return {
			id: chatId,
			title: "Тендер на устройство слаботочных сетей по проекту NRG Maftun Makon Comfort 2",
			chat_status: "planned_auction",
			date: "12.12.2024",
			time: "12:00",
			// other data's: example: participants, messages, etc.
		}
	} else if (chatId === "2") {
		return {
			id: chatId,
			title: "Открытый тендер насосная станция пожаротушения по проекту Arena Light 1",
			chat_status: "time_to_start_technical_council",
			date: "12.12.2024",
			time: "12:00",
			// other data's: example: participants, messages, etc.
		}
	}
}

