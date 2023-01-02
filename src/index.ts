import sharp from 'sharp';
import { name, version } from '../package.json';
import config from '../config';
import { createOutputFolder } from './utils/create-output-folder';
import { getInputImages } from './utils/get-input-images';
import { splitPage } from './processors/split-page';
import { outputBuffers } from './output-buffers';
import { cropPage } from './processors/crop-page';
import { writeFileSync } from 'fs';
import { join } from 'path';

async function run() {
  console.log(`Running ${name} v${version}...`);
  const startTime = Date.now();
  const { actions } = config;

  createOutputFolder(config.outputFolder);

  const inputImages = getInputImages(config.inputFolder);

  if (config.log) {
    const logPath = join(config.outputFolder, config.log);
    console.log(` - Writing log to ${logPath}`);
    writeFileSync(logPath, JSON.stringify(config, null, 2));
  }

  for (const image of inputImages) {
    console.log(` - Processing ${image.filename}`);
    let buffers = [await sharp(image.filepath).toBuffer()];

    for (const process of actions) {
      if (process.skip?.includes(image.pageNumber as number)) {
        continue;
      }
      if (process.only && !process.only.includes(image.pageNumber as number)) {
        continue;
      }

      if (process.action === 'SKIP') break;

      if (process.action === 'SPLIT') {
        buffers = await splitPage(buffers, process);
        continue;
      }

      if (process.action === 'CROP') {
        buffers = await cropPage(buffers, process);
        continue;
      }

      if (process.action === 'WRITE') {
        await outputBuffers(buffers, image, config.outputFolder, process);
        continue;
      }

      console.log(` ! Unknown action: ${(process as any).action}`);
    }
  }

  const ellapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(
    `Finished processing ${inputImages.length} images in ${ellapsedTime} s.`
  );
}

run();
