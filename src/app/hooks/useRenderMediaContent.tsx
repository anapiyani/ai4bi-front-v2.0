import React, { useEffect } from "react"
import Icons from '../components/Icons'
import { Media } from "../types/types"
import { ImageMedia } from './RenderMediaItems/Image'

import { Skeleton } from '@/components/ui/skeleton'
import toast from 'react-hot-toast'
import AudioMedia from './RenderMediaItems/Audio'
import { useDownloadMedia } from './useUploadMedia'
export function useRenderMediaContent(
  media: string[] | string | Media[] | Media | null | undefined,
  t: (key: string) => string,
  isUser: boolean,
  small?: boolean
) {
  const {mutate: downloadMedia, isPending: isDownloading} = useDownloadMedia();

  useEffect(() => {
    if (isDownloading) {
      toast.loading(t("downloading-media"));
    } else {
      toast.dismiss();
    }
  }, [isDownloading]);

  const renderSingleMedia = React.useCallback(
    (item: string | Media) => {
      if (typeof item === "string") {
        return (
          <div className='flex justify-center gap-2 items-center mb-2 rounded'>
            <Skeleton className='w-[300px] h-[300px] rounded-lg' />
          </div>
        )
      } else {
        const { media_id, media_type, name, size, type } = item;
        switch (media_type || type) {
          case "image":
            return <ImageMedia t={t} mediaId={media_id} name={name} small={small} />

          case "audio":
            return <AudioMedia name={name} small={small} isUser={isUser} t={t} mediaId={media_id} />
          case "file":
          case "video":
          default:
            return (
              <div className="flex justify-between gap-2 items-start mb-2 rounded-lg w-full">
								<button onClick={() => downloadMedia({uuid: media_id, name: name})} disabled={isDownloading} rel="noopener noreferrer" className="flex gap-2 h-full w-full">
									<div className='flex justify-center items-center bg-neutrals-secondary rounded px-3 py-3'>
										{media_type === "file" && <Icons.PDF className='w-6 h-6 text-neutrals-muted' />}
                    { type === "file" && <Icons.PDF className='w-6 h-6 text-neutrals-muted' />}
										{media_type === "video" && <Icons.Video className='w-6 h-6 text-neutrals-muted' fill='#0891b2' />}
									</div>
									<div className="flex flex-col gap-1 py-1">
											<p className={`${isUser ? "text-white" : "text-neutrals-muted"} text-sm`}>{name.length > 40 ? name.slice(0, 40) + "..." : name}</p>
											<p className={`${isUser ? "text-white" : "text-neutrals-muted"} text-xs`}>
												{size > 1024000 
													? `${(size / 1024 / 1024).toFixed(2)} mb`
													: `${(size / 1024).toFixed(2)} kb`
												}
											</p>
										</div>
									</button>
              </div>
            )
        }
      }
    },
    [t, isUser, small]
  )

  const renderMedia = React.useMemo(() => {
    if (!media) return null
    if (Array.isArray(media)) {
      return (
        <>
          {media.map((item, index) => (
            <React.Fragment key={index}>
              {renderSingleMedia(item)}
            </React.Fragment>
          ))}
        </>
      )
    }
    return renderSingleMedia(media)
  }, [media, renderSingleMedia])

  return renderMedia
}

export default useRenderMediaContent
