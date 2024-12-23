

export const useChat = (chatId: string) => {
	// ! for now we just give some example data!
	// ? n the future we will get the data from the server and return it.
	if (chatId === "d7d69048-ed7e-49d2-adb8-fa3276e6ee2c") {
		return {
			id: chatId,
			title: "Тендер на устройство слаботочных сетей по проекту NRG Maftun Makon Comfort 2",
			chat_status: "planned_auction",
			date: "12.12.2024",
			time: "12:00",
			// ! other data's: example: participants, messages, etc.
		}
	} else if (chatId === "d7123322-ed7e-123jk-adb8-ed7e123jk") {
		return {
			id: chatId,
			title: "Открытый тендер (СМР) по СС проект Atamura Comfort 2",
			chat_status: "time_to_start_technical_council",
			date: "23.12.2024",
			time: "12:00",
			// ! other data's: example: participants, messages, etc.
			participant_actions: [
				{
					id: "1",
					name: "John Doe",
					type: "technical_council",
					action: "joined",
				},
				{
					id: "2",
					name: "User Name",
					type: "technical_council",
					action: "left",
				},
			],
			messages: [
				{
					name: "John Doe",
					message: "Hello, how are you? Are you ready for the auction?",
					type: "technical_council",
					action: "active",
					id: "1",
				}
			]
		}
	}
}

