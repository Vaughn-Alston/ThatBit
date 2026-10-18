import * as DocumentPicker from 'expo-document-picker';
import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import type { PdfAttachmentInputProps } from '@/components/pdf-attachment-input.types';
import type { PickedPdf } from '@/utils/node-attachment';

export function PdfAttachmentInput({ disabled, onFiles, onError }: PdfAttachmentInputProps) {
  const [isPicking, setPicking] = useState(false);

  async function pickPdfs() {
    onError('');
    setPicking(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        multiple: true,
        copyToCacheDirectory: true,
        base64: false,
      });
      if (result.canceled) return;

      const pdfs = result.assets
        .filter((asset) => asset.mimeType?.toLowerCase() === 'application/pdf' || /\.pdf$/i.test(asset.name))
        .map((asset): PickedPdf => ({
          name: asset.name,
          uri: asset.uri,
          mimeType: 'application/pdf',
          size: asset.size,
        }));

      if (pdfs.length === 0) {
        onError('Choose a PDF file to attach to this node.');
        return;
      }

      onFiles(pdfs);
    } catch (error) {
      onError(error instanceof Error ? `Could not attach PDF: ${error.message}` : 'Could not attach PDF.');
    } finally {
      setPicking(false);
    }
  }

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || isPicking}
      onPress={pickPdfs}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <Text style={styles.label}>{isPicking ? 'Choosing…' : '+ Choose PDF'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: '#3e505d',
    borderRadius: 15,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  pressed: {
    opacity: 0.78,
  },
  label: {
    color: '#c1d8e6',
    fontSize: 10,
    fontWeight: '600',
  },
});
