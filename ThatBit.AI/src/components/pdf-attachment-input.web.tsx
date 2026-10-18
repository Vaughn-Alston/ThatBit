import { useState } from 'react';
import type { PdfAttachmentInputProps } from '@/components/pdf-attachment-input.types';
import type { PickedPdf } from '@/utils/node-attachment';

export function PdfAttachmentInput({ disabled, onFiles, onError }: PdfAttachmentInputProps) {
  const [isDragging, setDragging] = useState(false);

  function handleFiles(files: FileList | null) {
    onError('');
    if (!files?.length) return;

    const selectedFiles = Array.from(files);
    const pdfs = selectedFiles
      .filter((file) => file.type.toLowerCase() === 'application/pdf' || /\.pdf$/i.test(file.name))
      .map((file): PickedPdf => ({
        name: file.name,
        uri: URL.createObjectURL(file),
        mimeType: 'application/pdf',
        size: file.size,
      }));

    if (pdfs.length === 0) {
      onError('Choose or drop a PDF file to attach to this node.');
      return;
    }

    onFiles(pdfs);
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
        padding: '14px 10px',
        textAlign: 'center',
        opacity: disabled ? 0.55 : 1,
      }}>
      <div style={{ color: '#aeb6bd', fontSize: 11, marginBottom: 8 }}>
        Drop PDF files here
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
          padding: '7px 11px',
        }}>
        Choose PDF
        <input
          accept="application/pdf,.pdf"
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
