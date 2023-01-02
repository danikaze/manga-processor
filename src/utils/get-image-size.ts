import sharp, { Sharp } from 'sharp';

export type ImageSize = Record<'width' | 'height', number>;

export async function getImageSize(
  image: string | Buffer | Sharp
): Promise<ImageSize> {
  const process =
    typeof image === 'string' || image instanceof Buffer ? sharp(image) : image;
  const metadata = await process.metadata();
  return {
    width: metadata.width as number,
    height: metadata.height as number,
  };
}
