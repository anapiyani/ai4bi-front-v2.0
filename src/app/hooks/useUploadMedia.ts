"use client";

import { toast } from "@/components/ui/use-toast"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { get, post } from "../api/service/api"
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
  const t = useTranslations("dashboard");
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
        description: t("error-uploading-media"),
        variant: "destructive",
      });
    },
  });
};

export const useShowInlineImage = (uuid: string) => {
  return useQuery({
    queryKey: ["media", uuid],
    queryFn: () => get<{ image: string }>(`/media/show_inline/${uuid}`),
    staleTime: Infinity,
    gcTime: 1000 * 60 * 5,
  });
};

export const useShowInlineAudio = (uuid: string) => {
  return useQuery({
    queryKey: ["media", uuid],
    queryFn: () =>
      get<Blob>(`/media/show_inline/${uuid}`, { responseType: "blob" }),
    staleTime: Infinity,
    gcTime: 1000 * 60 * 5,
  });
};


export const useDownloadMedia = () => {
  return useMutation({
    mutationFn: ({uuid, name}: {uuid: string, name: string}) => {
      return get(`/media/download/${uuid}`, { responseType: "blob" });
    },
    onSuccess: (data, {uuid, name}) => {
      const url = URL.createObjectURL(data as Blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Error downloading media",
      });
    },
  });
}