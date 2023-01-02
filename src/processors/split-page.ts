import sharp from 'sharp';
import { SplitPage } from '@src/config';
import { getImageSize } from '../utils/get-image-size';

export async function splitPage(
  input: Buffer[],
  config: SplitPage
): Promise<Buffer[]> {
  console.log(`  - splitPage (${input.length})`);
  const res: Buffer[] = [];

  for (const buffer of input) {
    const { width, height } = await getImageSize(buffer);
    const left = sharp(buffer);
    const right = left.clone();
    const mid = Math.floor(width / 2);

    left.extract({
      height,
      top: 0,
      left: 0,
      width: mid,
    });
    right.extract({
      height,
      top: 0,
      left: mid,
      width: width - mid,
    });

    const outs = await Promise.all([left.toBuffer(), right.toBuffer()]);
    if ((config.direction || 'RTL') === 'RTL') {
      outs.reverse();
    }

    res.push(...outs);
  }

  return res;
}
