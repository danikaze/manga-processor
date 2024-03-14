import { WriteOutput } from '@src/config';
import { InputImageData } from './get-input-images';

type Fn = Exclude<WriteOutput['outputFilename'], undefined>;

// A map per path is required, in case multiple folders are processed in parallel
const fnByPath = new Map<string, Fn>();

export function getDefaultOutputFilename(path: string, ext: string): Fn {
  let fn = fnByPath.get(path);
  if (fn) return fn;

  fn = (() => {
    let outputPage = 1;
    let unknownImages = 0;
    return (bufferIndex: number, input: InputImageData) => {
      if (input.pageNumber === undefined) {
        return `unknown-${(unknownImages++).toString().padStart(3, '0')}${ext}`;
      }
      return `${(outputPage++).toString().padStart(3, '0')}${ext}`;
    };
  })();

  fnByPath.set(path, fn);
  return fn;
}
