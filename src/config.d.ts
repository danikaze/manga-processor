import { JpegOptions, PngOptions } from 'sharp';
import { InputImageData } from './utils/get-input-images';
export { InputImageData };

export interface Config {
  /** Where read images from */
  inputFolder: string;
  /** Extensions of the files to process (including the dot) */
  extensions: string[];
  /** Base folder for output images */
  outputFolder: string;
  /** If defined, output will be written in this file, relative to outputFolder */
  log?: string;
  /** List of ProcessActions for EACH image (`skip` or `only` can be used) */
  actions: ProcessAction[];
}

export type ProcessAction =
  | SkipPage
  | SplitPage
  | CropPage
  | TrimPage
  | WriteOutput;

type Action<T extends string, Data extends {} = {}> = {
  action: T;
  /** List of input pages (as input.pageNumber) to skip this action */
  skip?: number[];
  /** List of the only pages (as input.pageNumber) to process with this action */
  only?: number[];
} & Data;

/**
 * Stops processing rules for the given image
 */
export type SkipPage = Action<'SKIP'>;

/**
 * Split a page in two (left|right)
 * By default uses Japanese manga `direction` (`RTL`)
 * Set it to `LTR` for occidental comics, as it defines the order of the output
 */
export type SplitPage = Action<
  'SPLIT',
  {
    direction?: 'LTR' | 'RTL';
  }
>;

/**
 * Crop the image page to the specified region
 */
export type CropPage = Action<
  'CROP',
  {
    region: {
      left: number;
      top: number;
      width: number;
      height: number;
    };
  }
>;

/**
 * Trim the image from the borders the specified quantity
 */
export type TrimPage = Action<
  'TRIM',
  {
    trim: {
      left?: number;
      right?: number;
      top?: number;
      bottom?: number;
    };
  }
>;

/**
 * Write the processed buffer in disk
 */
export type WriteOutput = Action<
  'WRITE',
  WriteOutputJpgOptions | WriteOutputPngOptions
>;

interface WriteOutputBaseOptions {
  skipOut?: { pageNumber: number; bufferIndex: number }[];
  onlyOut?: { pageNumber: number; bufferIndex: number }[];
  /**
   * Filename to use for the written file.
   * Defaults to `###.jpg` (and `unknown-###.jpg` for inputs without `pageNumber`)
   *
   * It will not output anything if the returned value is `undefined`
   */
  outputFilename?: (
    bufferIndex: number,
    input: InputImageData
  ) => string | undefined;
}

interface WriteOutputJpgOptions extends WriteOutputBaseOptions {
  format?: 'jpg' | 'jpeg';
  /**
   * Output options to use when writting the buffer to disk
   * Defaults to quality 100
   */
  outputOptions?: JpegOptions;
}

interface WriteOutputPngOptions extends WriteOutputBaseOptions {
  format: 'png';
  /**
   * Output options to use when writting the buffer to disk
   * Defaults to quality 100
   */
  outputOptions?: PngOptions;
}
