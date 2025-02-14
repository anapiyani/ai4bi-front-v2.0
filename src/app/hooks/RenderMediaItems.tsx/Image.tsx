import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useShowInlineImage } from '../useUploadMedia'


export const ImageMedia = ({ mediaId, name, small, t }: { mediaId: string; name?: string; small?: boolean, t: (key: string) => string }) => {
  const { data: picture, isLoading, isError, refetch } = useShowInlineImage(mediaId);

  return (
    <div className="flex justify-center gap-2 items-center mb-2 rounded">
      <img
        src={`data:image/png;base64,${picture?.image}`}
        alt={name || "media"}
        width={small ? 100 : 300}
        height={small ? 100 : 300}
        className="rounded-lg"
        style={{ display: "none" }}
        onLoad={(e) => {
          e.currentTarget.style.display = "block";
          e.currentTarget.nextElementSibling?.remove();
        }}
      />
      {
        isLoading && (
          <div className="flex justify-center items-center">
            <Skeleton className={`w-[${small ? 100 : 300}px] h-[${small ? 100 : 300}px] rounded-lg`} />
          </div>
        )
      }
      {
        isError && (
          <div className="flex justify-center items-center">
            <Skeleton className={`w-[${small ? 100 : 300}px] h-[${small ? 100 : 300}px] rounded-lg`} />
            <Button variant="ghost" className='text-primary' onClick={() => {
              refetch();
            }}>
              {t("try-again")}
            </Button>
          </div>
        )
      }
    </div>
  );
}