
import { v4 as uuidv4 } from 'uuid'

const useUsers = (chat_id: string) => {
	const EXAMPLE_USERS = [
		{
			id: uuidv4(),
			name: 'Aray',
			// pfp: 'https://i.pravatar.cc/300',
			stream: null,
			isMicrophoneOn: false,
			isAbsent: false,
		},
		{
			id: uuidv4(),
			name: 'John Doe',
			stream: null,
			isMicrophoneOn: false,
			isAbsent: false,
		},
		{
			id: uuidv4(),
			name: "Alex Dumbster",
			pfp: 'https://i.pravatar.cc/200',
			stream: null,
			isMicrophoneOn: true,
			isAbsent: false,
		},
		{
			id: uuidv4(),
			name: "Lana Rhoades",
			pfp: 'https://i.pravatar.cc/100',
			stream: null,
			isMicrophoneOn: false,
			isAbsent: true,
		}
	]

	return EXAMPLE_USERS;
}

export default useUsers;