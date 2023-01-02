import { readdirSync } from 'fs';
import { join } from 'path';
import { getPageNumber } from './get-page-number';

export interface InputImageData {
  filename: string;
  filepath: string;
  pageNumber: number | undefined;
}

export function getInputImages(inputFolder: string): InputImageData[] {
  console.log(`Getting image list from ${inputFolder}`);

  const res: InputImageData[] = readdirSync(inputFolder).map((filename) => {
    const filepath = join(inputFolder, filename);
    return {
      filename,
      filepath,
      pageNumber: getPageNumber(filename),
    };
  });

  res.sort((a, b) => {
    const pa = a.pageNumber ?? Infinity;
    const pb = b.pageNumber ?? Infinity;
    return pa - pb;
  });

  const unknownPages = res.filter((i) => i.pageNumber === undefined).length;
  const unknownText =
    unknownPages > 0 ? ` (${unknownPages} without page number)` : '';
  console.log(`${res.length} images to process${unknownText}`);

  return res;
}
