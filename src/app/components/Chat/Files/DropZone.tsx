// Dropzone.tsx
import { cn } from '@/lib/utils'
import React from 'react'
import { useDropzone } from 'react-dropzone'

// Type Definitions
import { useTranslations } from 'next-intl'
import {
  type DropzoneProps as _DropzoneProps,
  type DropzoneState as _DropzoneState,
} from 'react-dropzone'
import Icons from '../../Icons'
export interface DropzoneState extends _DropzoneState {}

export interface DropzoneProps extends Omit<_DropzoneProps, 'children'> {
  containerClassName?: string;
  dropZoneClassName?: string;
  children?: (dropzone: DropzoneState) => React.ReactNode;
  showFilesList?: boolean;
  showErrorMessage?: boolean;
  filesUploaded?: File[];
  setFilesUploaded?: React.Dispatch<React.SetStateAction<File[]>>;
  errorMessage?: string;
  setErrorMessage?: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const DropzoneComponent = ({
  containerClassName,
  dropZoneClassName,
  children,
  showFilesList = true,
  showErrorMessage = true,
  filesUploaded = [],
  setFilesUploaded,
  errorMessage,
  setErrorMessage,
  ...props
}: DropzoneProps) => {
  const t = useTranslations("dropzone")
  const dropzone = useDropzone({
    ...props,
    onDrop: (acceptedFiles, fileRejections, event) => {
      if (props.onDrop) {
        props.onDrop(acceptedFiles, fileRejections, event);
      } else {
        setFilesUploaded && setFilesUploaded((prev) => [...prev, ...acceptedFiles]);
        if (fileRejections.length > 0) {
          let _errorMessage = `Could not upload ${fileRejections[0].file.name}`;
          if (fileRejections.length > 1) {
            _errorMessage += `, and ${fileRejections.length - 1} other file(s).`;
          }
          setErrorMessage && setErrorMessage(_errorMessage);
        } else {
          setErrorMessage && setErrorMessage('');
        }
      }
    },
  });
  return (
    <div className={cn('flex flex-col gap-2', containerClassName)}>
      {/* Dropzone Area */}
      <div
        {...dropzone.getRootProps()}
        className={cn(
          'flex justify-center items-center w-full h-32 border-dashed border-2 border-gray-200 rounded-lg hover:bg-accent hover:text-accent-foreground transition-all select-none cursor-pointer',
          dropZoneClassName
        )}
      >
        <input {...dropzone.getInputProps()} />
        {children ? (
          children(dropzone)
        ) : dropzone.isDragAccept ? (
          <div className='text-sm font-medium'>{t("drop_files_here")}</div>
        ) : (
          <div className='flex items-center flex-col gap-1.5'>
            <div className='flex items-center flex-row gap-0.5 text-sm font-medium'>
              <Icons.Upload className='mr-2 h-4 w-4' /> {t("upload_files")}
            </div>
            {props.maxSize && (
              <div className='text-xs text-gray-400 font-medium'>
                {t("max_file_size")}: {(props.maxSize / (1024 * 1024)).toFixed(2)} MB
              </div>
            )}
          </div>
        )}
      </div>

      {showErrorMessage && errorMessage && (
        <span className='text-xs text-red-600 mt-3'>{errorMessage}</span>
      )}
    </div>
  );
};

export default DropzoneComponent;
