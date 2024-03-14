import sharp from 'sharp';
import { extname, join } from 'path';
import { writeFileSync } from 'fs';
import { name, version } from '../package.json';

import config from '../config';
import { createOutputFolder } from './utils/create-output-folder';
import { getInputImages } from './utils/get-input-images';
import { outputBuffers } from './output-buffers';
import { splitPage } from './processors/split-page';
import { cropPage } from './processors/crop-page';
import { trimPage } from './processors/trim-page';
import { Config, SingleFolderConfig } from './config';

async function run() {
  console.log(`Running ${name} v${version}...`);

  if (isSingleFolderConfig(config)) {
    await processFolder(config);
    return;
  }

  if (config.inputFolder.length !== config.outputFolder.length) {
    throw new Error(
      `When providing multiple folders, input and output lengths must match`
    );
  }

  const { basePath, inputFolder, outputFolder, parallel, ...baseConfig } =
    config;

  const startTime = Date.now();
  const promises: Promise<void>[] = [];
  for (let i = 0; i < inputFolder.length; i++) {
    const folderConfig: SingleFolderConfig = {
      ...baseConfig,
      inputFolder: basePath ? join(basePath, inputFolder[i]) : inputFolder[i],
      outputFolder: basePath
        ? join(basePath, outputFolder[i])
        : outputFolder[i],
    };
    const promise = processFolder(folderConfig);
    if (parallel) {
      promises.push(promise);
    } else {
      await promise;
    }
  }
  if (parallel) {
    await Promise.allSettled(promises);
  }
  const ellapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(
    `Finished processing ${inputFolder.length} folders in ${ellapsedTime} s.`
  );
}

async function processFolder(config: SingleFolderConfig): Promise<void> {
  const startTime = Date.now();
  const { actions } = config;
  const inputImages = getInputImages(config.inputFolder);
  createOutputFolder(config.outputFolder);

  if (config.log) {
    const logPath = join(config.outputFolder, config.log);
    console.log(` - Writing log to ${logPath}`);
    writeFileSync(logPath, JSON.stringify(config, null, 2));
  }

  for (const image of inputImages) {
    if (!config.extensions.includes(extname(image.filename))) {
      console.log(` - Skipping ${image.filename} by extension`);
      continue;
    }

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

      if (process.action === 'TRIM') {
        buffers = await trimPage(buffers, process);
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

function isSingleFolderConfig(config: Config): config is SingleFolderConfig {
  return !Array.isArray(config.inputFolder);
}

run();
