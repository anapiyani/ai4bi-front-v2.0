
import { v4 as uuidv4 } from 'uuid'

const useUsers = (chat_id: string) => {
	const EXAMPLE_USERS = [
		{
			id: uuidv4(),
			name: 'Aray',
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
			stream: null,
			isMicrophoneOn: true,
			isAbsent: false,
		},
		{
			id: uuidv4(),
			name: "Lana Rhoades",
			stream: null,
			isMicrophoneOn: false,
			isAbsent: true,
		}
	]

	return EXAMPLE_USERS;
}

export default useUsers;