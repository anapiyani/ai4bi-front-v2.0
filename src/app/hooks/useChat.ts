

export const useChat = (chatId: string, type: "technical-council" | "auction" | "chat") => {
	// ! for now we just give some example data!
	// ? n the future we will get the data from the server and return it.
	if (chatId === "d7d69048-ed7e-49d2-adb8-fa3276e6ee2c") {
		if (type === "technical-council") {
			return {
				id: chatId,
				title: "Тендер на устройство слаботочных сетей по проекту NRG Maftun Makon Comfort 2",
				chat_status: "planned_auction",
				date: "12.12.2024",
				time: "12:00",
			}
		} else if (type === "chat") {
			return {
				id: chatId,
				title: "Тендер на устройство слаботочных сетей по проекту NRG Maftun Makon Comfort 2",
				chat_status: "planned_auction",
				date: "12.12.2024",
				time: "12:00",
			}
		}
	} else if (chatId === "d7123322-ed7e-123jk-adb8-ed7e123jk") {
		if (type === "technical-council") {
			return {
				id: chatId,
				title: "Открытый тендер (СМР) по СС проект Atamura Comfort 2",
				chat_status: "technical_council_on_progress",
				date: "23.12.2024",
				time: "12:00",
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
						message: "Bro, what the fuck is going on?",
						type: "technical_council",
						action: "active",
						id: "1",
					},
					{
						name: "User Name",
						message: "Fuck if I know, I'm just a user",
						type: "technical_council",
						action: "active",
						id: "2",
					},
					{
						name: "user",
						message: "Lmfao, you're right, i'ma just a json file and i don't know anything this nigga writing shit",
						type: "technical_council",
						action: "active",
						id: "3",
					},
					{
						name: "bot",
						message: "Ayy, what's going on my nigga? I'mma niggabot",
						type: "technical_council",
						action: "active",
						id: "4",
					}
				]
			}
		} else if (type === "chat") {
			return {
				id: chatId,
				title: "Открытый тендер (СМР) по СС проект Atamura Comfort 2",
				chat_status: "time_to_start_technical_council",
				date: "23.12.2024",
				time: "12:00",
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
}

