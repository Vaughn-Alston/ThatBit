import { Asset } from 'expo-asset';

export async function readMarkdownAsset(assetModule: number) {
  const asset = Asset.fromModule(assetModule);
  const response = await fetch(asset.uri);

  if (!response.ok) {
    throw new Error(`Could not load the bundled Markdown file (${response.status}).`);
  }

  return response.text();
}
