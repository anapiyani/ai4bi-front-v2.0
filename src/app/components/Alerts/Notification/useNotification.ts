import { post } from "@/src/app/api/service/api";
import { useMutation } from "@tanstack/react-query";

interface MuteChatEventPayload {
    chat_id: string;
    chat_name: string;
    event: string;
}

const muteChatEvent = (userId: string, payload: MuteChatEventPayload) => {
    return post(`/user-settings/${userId}/mute-chat-event`, payload);
};

export const useMuteChatEvent = (userId: string) => {
    return useMutation({
        mutationFn: (payload: MuteChatEventPayload) => muteChatEvent(userId, payload),
    });
};


interface UnmuteChatEventPayload {
    chat_id: string;
    event: string;
}

const unmuteChatEvent = (userId: string, payload: UnmuteChatEventPayload) => {
    return post(`/user-settings/${userId}/unmute-chat-event`, payload);
};

export const useUnmuteChatEvent = (userId: string) => {
    return useMutation({
        mutationFn: (payload: UnmuteChatEventPayload) => unmuteChatEvent(userId, payload),
    });
}