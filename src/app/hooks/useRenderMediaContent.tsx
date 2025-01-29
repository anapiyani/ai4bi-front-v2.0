import React from "react"

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
  t: (key: string) => string
) {
  const renderSingleMedia = React.useCallback(
    (item: string | MediaObject) => {
      if (typeof item === "string") {
        return (
          <div className="flex justify-center gap-2 items-center mb-2">
            <img
              src={`https://staging.ai4bi.kz/media/show_inline/${item}`}
              alt="media"
              width={300}
              height={300}
            />
          </div>
        )
      } else {
        const { media_id, media_type, name } = item
        if (media_type === "image") {
          return (
            <div className="flex justify-center gap-2 items-center mb-2">
              <img
                src={`https://staging.ai4bi.kz/media/show_inline/${media_id}`}
                alt={name || "media"}
                width={300}
                height={300}
              />
            </div>
          )
        } else {
          return (
            <div className="flex flex-col justify-center gap-2 items-center mb-2">
              <a
                href={`https://staging.ai4bi.kz/media/download/${media_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-500"
              >
                {name || t("download-file")}
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
