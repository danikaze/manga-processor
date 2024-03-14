import sharp from 'sharp';
import { join } from 'path';
import { InputImageData, WriteOutput } from './config';
import { getDefaultOutputFilename } from './utils/get-default-output-path';

export async function outputBuffers(
  buffers: Buffer[],
  input: InputImageData,
  outputFolder: string,
  config: WriteOutput
): Promise<number> {
  const outputWritePromises = buffers
    .map((buffer, bufferIndex) => {
      if (skipBuffer(config, input.pageNumber, bufferIndex)) {
        return;
      }

      const getOutputFilename =
        config.outputFilename ||
        getDefaultOutputFilename(
          outputFolder,
          config.format === 'png' ? '.png' : '.jpg'
        );
      const outputFilename = getOutputFilename(bufferIndex, input);
      if (!outputFilename) return;

      const outputPath = join(outputFolder, outputFilename);
      console.log(`  - writing ${outputFilename}`);
      return getFormatBuffer(buffer, config).toFile(outputPath);
    })
    .filter(Boolean);

  return (await Promise.all(outputWritePromises)).length;
}

function skipBuffer(
  { skipOut, onlyOut }: WriteOutput,
  inputPageNumber: number | undefined,
  bufferIndex: number
): boolean {
  const skip = matchOutputDef(skipOut, inputPageNumber, bufferIndex);
  if (skip) return true;
  if (!onlyOut) return false;
  return !matchOutputDef(onlyOut, inputPageNumber, bufferIndex);
}

function matchOutputDef(
  def: { pageNumber: number; bufferIndex: number }[] | undefined,
  inputPageNumber: number | undefined,
  bufferIndex: number
): boolean {
  if (!def) return false;
  return (
    def.find(
      (item) =>
        item.pageNumber === inputPageNumber && item.bufferIndex === bufferIndex
    ) !== undefined
  );
}

function getFormatBuffer(buffer: Buffer, config: WriteOutput): sharp.Sharp {
  if (config.format === 'png') {
    return sharp(buffer).png({
      compressionLevel: 9,
      quality: 100,
      palette: true,
      force: true,
      ...config.outputOptions,
    });
  }

  return sharp(buffer).jpeg({ quality: 100, ...config.outputOptions });
}
