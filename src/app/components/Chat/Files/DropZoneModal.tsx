// DropZoneModal.tsx
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { useState } from 'react'
import truncate from 'truncate'
import Icons from '../../Icons'
import Dropzone from './Dropzone'; // Corrected import

const DropZoneModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
	const [filesUploaded, setFilesUploaded] = useState<File[]>([]);

  const handleUpload = () => {
    console.log('Uploaded Files:', filesUploaded);
    // Add your upload logic here
    // For example, you might send the files to a server
    // After upload, you might want to clear the files and close the modal
    // setFiles([]);
    // setOpen(false);
  };

	const deleteUploadedFile = (index: number) => {
    setFilesUploaded &&
      setFilesUploaded((prev) => [
        ...prev.slice(0, index),
        ...prev.slice(index + 1),
      ]);
  };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='w-full max-w-2xl bg-primary-foreground'>
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
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
										className='flex justify-between items-center flex-row w-full h-16 mt-2 px-4 border-solid border-2 border-gray-200 rounded-lg shadow-sm'
									>
										<div className='flex items-center flex-row gap-4 h-full'>
											{fileUploaded.type === 'application/pdf' ? (
												<Icons.PDF className='text-rose-700 w-6 h-6' />
											) : (
												<Icons.ImageIcon className='text-rose-700 w-6 h-6' />
											)}
											<div className='flex flex-col gap-0'>
												<div className='text-[0.85rem] font-medium leading-snug'>
													{truncate(fileUploaded.name.split('.').slice(0, -1).join('.'), 30)}
												</div>
												<div className='text-[0.7rem] text-gray-500 leading-tight'>
													.{fileUploaded.name.split('.').pop()} •{' '}
													{(fileUploaded.size / (1024 * 1024)).toFixed(2)} MB
												</div>
											</div>
										</div>
										<div
											className='p-2 rounded-full border-solid border-2 border-gray-100 shadow-sm hover:bg-accent transition-all select-none cursor-pointer'
											onClick={() => deleteUploadedFile(index)}
										>
											<Icons.Trash className='w-4 h-4' />
										</div>
									</div>
								))}
							</div>
						)}
        </DialogDescription>
        <DialogFooter>
          <Button onClick={handleUpload}>Upload</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DropZoneModal;
