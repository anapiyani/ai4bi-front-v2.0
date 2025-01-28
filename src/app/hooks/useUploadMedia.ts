"use client";

import { toast } from "@/components/ui/use-toast"
import { useMutation } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { post } from "../api/service/api"
import { createQueryKeys } from "../api/service/queryKeys"
import { UploadMediaResponse } from "../types/types"

// Create your query keys (optional pattern)
export const mediaKeys = createQueryKeys("media");

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
  const t = useTranslations("dashboard");

  // We return a React Query mutation
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
    onSuccess: (data) => data,
    onError: (error) => {
      toast({
        title: t("error"),
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
