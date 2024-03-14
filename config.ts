import { Config } from '@src/config';

const config: Config = {
  parallel: true,
  extensions: ['.jpg', '.jpeg', '.png'],
  basePath: 'PATH/TO/INPUT/PARENT/FOLDER',
  inputFolder: ['IMAGES_FOLDER_1', 'IMAGES_FOLDER_2', 'IMAGES_FOLDER_3'],
  outputFolder: ['OUTPUT_FOLDER_1', 'OUTPUT_FOLDER_2', 'OUTPUT_FOLDER_3'],
  log: 'manga-processor-config.json',
  actions: [
    // 1st page is just the cover centered, crop it
    {
      action: 'CROP',
      region: {
        left: 28,
        top: 0,
        width: 3048,
        height: 2160,
      },
      only: [1],
    },
    // remove extra borders of every page
    {
      action: 'TRIM',
      trim: {
        left: 201,
        right: 201,
      },
      skip: [1],
    },
    // split pages but skip panoramic ones
    { action: 'SPLIT', skip: [1, 4, 8] },
    // write outputs but skip the filler page
    {
      action: 'WRITE',
      // skipOut: [{ pageNumber: 2, bufferIndex: 0 }],
    },
  ],
};

export default config;
