export type NodeAttachment = {
  id: string;
  name: string;
  uri: string;
  mimeType: string;
  size?: number;
};

export type PickedPdf = Omit<NodeAttachment, 'id'>;
