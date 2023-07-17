import sharp, { Region } from 'sharp';
import { TrimPage } from '@src/config';

export async function trimPage(
  input: Buffer[],
  config: TrimPage
): Promise<Buffer[]> {
  console.log(`  - trimPage (${input.length})`);
  const left = config.trim.left || 0;
  const right = config.trim.right || 0;
  const top = config.trim.top || 0;
  const bottom = config.trim.bottom || 0;

  return Promise.all(
    input.map(async (buffer) => {
      const process = sharp(buffer);
      const metadata = await process.metadata();
      if (metadata.width === undefined || metadata.height === undefined) {
        return Promise.resolve(buffer);
      }

      const region: Region = {
        left,
        top,
        width: metadata.width - left - right,
        height: metadata.height - top - bottom,
      };

      return process.extract(region).toBuffer();
    })
  );
}
