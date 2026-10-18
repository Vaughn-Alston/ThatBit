import * as DocumentPicker from 'expo-document-picker';
import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import type { ProjectFileInputProps } from '@/components/pdf-attachment-input.types';
import type { PickedAttachment } from '@/utils/node-attachment';

export function ProjectFileInput({ disabled, onFiles, onError }: ProjectFileInputProps) {
  const [isPicking, setPicking] = useState(false);

  async function pickFiles() {
    onError('');
    setPicking(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        multiple: true,
        copyToCacheDirectory: true,
        base64: false,
      });
      if (result.canceled) return;

      const attachments = result.assets
        .filter((asset) =>
          asset.mimeType?.toLowerCase() === 'application/pdf'
          || asset.mimeType?.toLowerCase().startsWith('image/')
          || /\.(pdf|png|jpe?g|gif|webp|avif)$/i.test(asset.name)
        )
        .map((asset): PickedAttachment => ({
          name: asset.name,
          uri: asset.uri,
          mimeType: asset.mimeType ?? (/\.(pdf)$/i.test(asset.name) ? 'application/pdf' : 'image/*'),
          size: asset.size,
        }));

      if (attachments.length === 0) {
        onError('Choose an image or PDF file to attach to this node.');
        return;
      }

      onFiles(attachments);
    } catch (error) {
      onError(error instanceof Error ? `Could not attach files: ${error.message}` : 'Could not attach files.');
    } finally {
      setPicking(false);
    }
  }

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || isPicking}
      onPress={pickFiles}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <Text style={styles.label}>{isPicking ? 'Choosing…' : '+ Add image or document'}</Text>
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
