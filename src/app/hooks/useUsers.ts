// hooks/useUsers.ts
import { useRef, useState } from 'react'
import { TechCouncilUser } from '../types/types'
export const useUsers = () => {
  const [users, setUsers] = useState<TechCouncilUser[]>([]);
  const speakingUsers = useRef<Map<string, boolean>>(new Map());
  const connectedUsers = useRef<Map<string, any>>(new Map());

  const updateConnectedUsers = (userId: string, isConnected: boolean) => {
    if (isConnected) {
      connectedUsers.current.set(userId, true);
    } else {
      connectedUsers.current.delete(userId);
    }
    updateUsers();
  };

  const updateSpeakingUsers = (userId: string, isSpeaking: boolean) => {
    speakingUsers.current.set(userId, isSpeaking);
    updateUsers();
  };

  const updateUsers = () => {
    setUsers(prevUsers =>
      prevUsers.map(user => ({
        ...user,
        is_connected: connectedUsers.current.has(user.user_id),
        is_speaking: speakingUsers.current.get(user.user_id) || false
      }))
    );
  };

  return {
    users,
    setUsers,
    connectedUsers,
    speakingUsers,
    updateConnectedUsers,
    updateSpeakingUsers
  };
};
