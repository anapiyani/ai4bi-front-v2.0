"use client";

import { toast } from "@/components/ui/use-toast"
import { useMutation, useQuery } from "@tanstack/react-query"

import { get, post } from "../api/service/api"
import { createQueryKeys } from "../api/service/queryKeys"
import { UploadMediaResponse } from "../types/types"

const uploadSingleMedia = (chat_id: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return post(`/chats/${chat_id}/media`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const uploadMultipleMedia = (chat_id: string, files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });
  return post(`/chats/${chat_id}/media/batch`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const useUploadMedia = () => {
  // const t = useTranslations("dashboard");

  return useMutation<
    UploadMediaResponse | UploadMediaResponse[],
    Error,
    { chat_id: string; files: File[] }
  >({
    mutationFn: async ({ chat_id, files }) => {
      if (files.length === 1) {
        return uploadSingleMedia(chat_id, files[0]) as Promise<UploadMediaResponse>;
      } else {
        return uploadMultipleMedia(chat_id, files) as Promise<UploadMediaResponse[]>;
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const getMediaKeys = createQueryKeys("getMedia");

const getSignleMediaData = (uuid: string) => {
	return get(`/media/show_inline/${uuid}`)
}

const getMultipleMediaData = (uuids: string[]) => {
	return get(`/media/show_inline/${uuids}`)
}

export const useGetMedia = (uuids: string | string[]) => {
	return useQuery({
		queryKey: getMediaKeys.all,
		queryFn: () => {
			if (Array.isArray(uuids)) {
				return getMultipleMediaData(uuids)
			} else {
				return getSignleMediaData(uuids)
			}
		},
	})
}