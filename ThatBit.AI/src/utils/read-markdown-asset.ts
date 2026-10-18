import { Asset } from 'expo-asset';
import { File } from 'expo-file-system';

export async function readMarkdownAsset(assetModule: number) {
  const asset = Asset.fromModule(assetModule);
  await asset.downloadAsync();

  if (!asset.localUri) {
    throw new Error('The bundled Markdown file could not be loaded.');
  }

  return new File(asset.localUri).text();
}
