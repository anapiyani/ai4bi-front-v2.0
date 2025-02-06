import React from "react"
import Icons from '../components/Icons'
import Spinner from '../components/Spinner'
import { Media } from "../types/types"
import { AudioPlayer } from './useAudioPlayer'


export function useRenderMediaContent(
  media: string[] | string | Media[] | Media | null | undefined,
  t: (key: string) => string,
  isUser: boolean
) {
  const renderSingleMedia = React.useCallback(
    (item: string | Media) => {
      if (typeof item === "string") {
        return (
          <div className="flex justify-center gap-2 items-center mb-2 rounded-lg">
            <img
              src={`https://staging.ai4bi.kz/media/show_inline/${item}`}
              alt="media"
              width={300}
							className='rounded-lg'
              height={300}
							onLoad={(e) => {
								e.currentTarget.style.display = 'block';
								e.currentTarget.nextElementSibling?.remove();
							}}
							style={{ display: 'none' }}
						/>
						<div className="loading animate-pulse text-sm text-muted-foreground">
							<Spinner className="w-16 h-16 text-primary" />
						</div>
          </div>
        )
      } else {
        const { media_id, media_type, name, size } = item
        switch (media_type) {
          case "image":
            return (
              <div className="flex justify-center gap-2 items-center mb-2 rounded">
                <img
                  src={`https://staging.ai4bi.kz/media/show_inline/${media_id}`}
                  alt={name || "media"}
                  width={300}
                  height={300}
                  className='rounded-lg'
                  onLoad={(e) => {
                    e.currentTarget.style.display = 'block';
                    e.currentTarget.nextElementSibling?.remove();
                  }}
                  style={{ display: 'none' }}
                />
                <div className="loading animate-pulse text-sm text-muted-foreground">
									<Spinner className="w-16 h-16 text-primary" />
								</div>
              </div>
            )

          case "audio":
            const src = `https://staging.ai4bi.kz/media/show_inline/${media_id}`
            return (
              <div className="flex justify-center gap-2 items-center mb-2 rounded-lg">
                <AudioPlayer src={src} isUser={isUser} name={name} />
              </div>
            )

          case "file":
          case "video":
          default:
            return (
              <div className="flex justify-between gap-2 items-start mb-2 rounded-lg w-full">
								<a href={`https://staging.ai4bi.kz/media/download/${media_id}`} rel="noopener noreferrer" className="flex gap-2 h-full w-full">
									<div className='flex justify-center items-center bg-[#F1F5F9] rounded px-3 py-3'>
										{media_type === "file" && <Icons.PDF className='w-8 h-8 text-muted-foreground' />}
										{media_type === "video" && <Icons.Video className='w-8 h-8 text-muted-foreground' fill='#0891b2' />}
									</div>
									<div className="flex flex-col gap-1 py-1">
											<p className={`${isUser ? "text-white" : "text-muted-foreground"} text-sm`}>{name.length > 40 ? name.slice(0, 40) + "..." : name}</p>
											<p className={`${isUser ? "text-white" : "text-muted-foreground"} text-xs`}>
												{size > 1024000 
													? `${(size / 1024 / 1024).toFixed(2)} mb`
													: `${(size / 1024).toFixed(2)} kb`
												}
											</p>
										</div>
									</a>
              </div>
            )
        }
      }
    },
    [t]
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
