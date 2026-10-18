import type { PickedPdf } from '@/utils/node-attachment';

export type PdfAttachmentInputProps = {
  disabled?: boolean;
  onFiles: (files: PickedPdf[]) => void;
  onError: (message: string) => void;
};
