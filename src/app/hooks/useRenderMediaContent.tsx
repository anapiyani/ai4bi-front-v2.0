import React from "react"
import Icons from '../components/Icons'
import Spinner from '../components/Spinner'

type MediaObject = {
  extension: string
  media_id: string
  media_type: "image" | "video" | "audio" | "file"
  mime_type: string
  name: string
  size: number
}

export function useRenderMediaContent(
  media: string[] | string | MediaObject[] | MediaObject | null | undefined,
  t: (key: string) => string,
  isUser: boolean
) {
  const renderSingleMedia = React.useCallback(
    (item: string | MediaObject) => {
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
							<Spinner className="w-16 h-16 text-foreground" />
						</div>
          </div>
        )
      } else {
        const { media_id, media_type, name, size } = item

        switch (media_type) {
          case "image":
            return (
              <div className="flex justify-center gap-2 items-center mb-2 px-2 rounded">
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
									<Spinner className="w-16 h-16 text-foreground" />
								</div>
              </div>
            )

          case "audio":
            return (
              <div className="flex justify-center gap-2 items-center mb-2 rounded-lg">
                <p>this is audio</p>
              </div>
            )

          case "file":
          case "video":
          default:
            // For any other file (PDF, DOC, XLS, etc.), just render a download link
            return (
              <div className="flex justify-between gap-2 items-start mb-2 rounded-lg w-full">
								<a href={`https://staging.ai4bi.kz/media/download/${media_id}`} rel="noopener noreferrer" className="flex gap-2 h-full w-full">
									<div className='flex justify-center items-center bg-[#F1F5F9] rounded px-3 py-3'>
										{media_type === "file" && <Icons.PDF className='w-8 h-8 text-primary' />}
										{media_type === "video" && <Icons.Video className='w-8 h-8 text-primary' fill='#0891b2' />}
									</div>
									<div className="flex flex-col gap-1 py-1">
											<p className={`${isUser ? "text-white" : "text-primary"} text-sm`}>{name.length > 40 ? name.slice(0, 40) + "..." : name}</p>
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
