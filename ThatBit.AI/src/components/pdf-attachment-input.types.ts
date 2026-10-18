import type { PickedAttachment } from '@/utils/node-attachment';

export type ProjectFileInputProps = {
  disabled?: boolean;
  onFiles: (files: PickedAttachment[]) => void;
  onError: (message: string) => void;
};
