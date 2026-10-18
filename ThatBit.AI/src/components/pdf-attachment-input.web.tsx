import { useState } from 'react';
import type { ProjectFileInputProps } from '@/components/pdf-attachment-input.types';
import type { PickedAttachment } from '@/utils/node-attachment';

export function ProjectFileInput({ disabled, onFiles, onError }: ProjectFileInputProps) {
  const [isDragging, setDragging] = useState(false);

  function handleFiles(files: FileList | null) {
    onError('');
    if (!files?.length) return;

    const selectedFiles = Array.from(files);
    const attachments = selectedFiles
      .filter((file) =>
        file.type.toLowerCase() === 'application/pdf'
        || file.type.toLowerCase().startsWith('image/')
        || /\.(pdf|png|jpe?g|gif|webp|avif)$/i.test(file.name)
      )
      .map((file): PickedAttachment => ({
        name: file.name,
        uri: URL.createObjectURL(file),
        mimeType: file.type || (/\.(pdf)$/i.test(file.name) ? 'application/pdf' : 'image/*'),
        size: file.size,
      }));

    if (attachments.length === 0) {
      onError('Choose or drop an image or PDF file to attach to this node.');
      return;
    }

    onFiles(attachments);
  }

  return (
    <div
      onDragEnter={(event) => {
        event.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={(event) => {
        if (event.currentTarget === event.target) setDragging(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        if (!disabled) handleFiles(event.dataTransfer.files);
      }}
      style={{
        border: `1px dashed ${isDragging ? '#9fc4da' : '#3e505d'}`,
        borderRadius: 12,
        background: isDragging ? 'rgba(92, 132, 156, 0.14)' : '#101316',
        padding: '6px 8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 8,
        opacity: disabled ? 0.55 : 1,
      }}>
      <div style={{ color: '#aeb6bd', fontSize: 10 }}>
        Drop an image or PDF
      </div>
      <label
        style={{
          display: 'inline-block',
          border: '1px solid #3e505d',
          borderRadius: 15,
          color: '#c1d8e6',
          cursor: disabled ? 'default' : 'pointer',
          fontSize: 10,
          fontWeight: 600,
          padding: '6px 9px',
        }}>
        Add file
        <input
          accept="application/pdf,.pdf,image/*"
          disabled={disabled}
          multiple
          onChange={(event) => {
            handleFiles(event.currentTarget.files);
            event.currentTarget.value = '';
          }}
          style={{ display: 'none' }}
          type="file"
        />
      </label>
    </div>
  );
}
