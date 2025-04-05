import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useUploadMedia } from '@/src/app/hooks/useUploadMedia'
import { useState } from 'react'
import Icons from '../../Icons'
import Dropzone from './DropZone'

const DropZoneModal = ({
  open,
  setOpen,
  handleSendMedia,
  t,
  chatId,
  value,
  setNewMessage,
  filesUploaded,
  setFilesUploaded,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  handleSendMedia: (uuids: string[], message: string) => void
  t: any
  value: string,
  chatId: string,
  setNewMessage: (value: string) => void
  filesUploaded: File[];
  setFilesUploaded: React.Dispatch<React.SetStateAction<File[]>>;
}) => {
  const [message, setMessage] = useState<string>('')

  const {
    mutate: uploadMedia,
    isPending: uploadMediaPending,
  } = useUploadMedia()

  const handleUpload = () => {
    if (filesUploaded.length === 0) return

    uploadMedia({ chat_id: chatId, files: filesUploaded }, {
      onSuccess: (dataFromMutation) => {
        const uploadedIds = Array.isArray(dataFromMutation)
          ? dataFromMutation.map((item) => item.uuid)
          : [dataFromMutation.uuid]
        handleSendMedia(uploadedIds, message)
        setFilesUploaded([])
        setOpen(false)
        setNewMessage('')
      },
      onError: (error) => {
        console.error('Upload error:', error)
      },
    })
  }

  const deleteUploadedFile = (index: number) => {
    setFilesUploaded((prev) => [
      ...prev.slice(0, index),
      ...prev.slice(index + 1),
    ])
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }

  return (
    <Dialog open={open}
            onOpenChange={(open) => {
              setOpen(open);
              if (!open) setFilesUploaded([]);
            }}>
      <DialogContent className="w-full max-w-2xl bg-primary-foreground">
        <DialogHeader>
          <DialogTitle>{t("upload_files")}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <Dropzone
            filesUploaded={filesUploaded}
            setFilesUploaded={setFilesUploaded}
            showFilesList={true}
            showErrorMessage={true}
            onDrop={(acceptedFiles) => {
              setFilesUploaded((prev) => [...prev, ...acceptedFiles]);
            }}
          />

          {filesUploaded.length > 0 && (
            <div
              className={`flex flex-col gap-2 w-full ${
                filesUploaded.length > 2 ? 'h-48 overflow-auto' : 'h-fit'
              } mt-2 pb-2`}
            >
              {filesUploaded.map((fileUploaded, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center flex-row w-full h-16 mt-2 px-4 border-solid border-2 border-gray-200 rounded-lg shadow-sm"
                >
                  <div className="flex items-center flex-row gap-4 h-full">
                    {fileUploaded.type === 'application/pdf' ? (
                      <Icons.PDF className="text-rose-700 w-6 h-6" />
                    ) : (
                      <Icons.ImageIcon className="text-rose-700 w-6 h-6" />
                    )}
                    <div className="flex flex-col gap-0">
                      <div className="text-[0.85rem] font-medium leading-snug">
                        {fileUploaded.name.split('.').slice(0, -1).join('.').length > 30 
                          ? fileUploaded.name.split('.').slice(0, -1).join('.').substring(0, 30) + '...'
                          : fileUploaded.name.split('.').slice(0, -1).join('.')}
                      </div>
                      <div className="text-[0.7rem] text-gray-500 leading-tight">
                        .{fileUploaded.name.split('.').pop()} •{' '}
                        {(fileUploaded.size / (1024 * 1024)).toFixed(2)} MB
                      </div>
                    </div>
                  </div>
                  <div
                    className="p-2 rounded-full border-solid border-2 border-gray-100 shadow-sm hover:bg-accent transition-all select-none cursor-pointer"
                    onClick={() => deleteUploadedFile(index)}
                  >
                    <Icons.Trash className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          <Input
            type="text"
            value={message}
            onChange={handleChange}
            placeholder={t('type-your-message-here')}
            className="mt-2"
          />
        </DialogDescription>

        <DialogFooter>
          <Button onClick={handleUpload} disabled={uploadMediaPending}>
            {uploadMediaPending ? t('uploading') : t('upload')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DropZoneModal
