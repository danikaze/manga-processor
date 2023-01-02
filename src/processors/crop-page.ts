import sharp from 'sharp';
import { CropPage } from '@src/config';

export async function cropPage(
  input: Buffer[],
  config: CropPage
): Promise<Buffer[]> {
  console.log(`  - cropPage (${input.length})`);

  return Promise.all(
    input.map((buffer) => sharp(buffer).extract(config.region).toBuffer())
  );
}
