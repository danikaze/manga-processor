import { Config } from '@src/config';

const config: Config = {
  extensions: ['.jpg', '.jpeg', '.png'],
  inputFolder: 'PATH/TO/INPUT/IMAGES',
  outputFolder: 'PATH/TO/OUTPUT/FOLDER',
  log: 'manga-processor-config.json',
  actions: [
    // remove extra borders of every page
    {
      action: 'CROP',
      region: {
        left: 28,
        top: 0,
        width: 3048,
        height: 2160,
      },
    },
    // 1st page is just the cover centered, crop it
    {
      action: 'CROP',
      only: [1],
      region: {
        left: 762,
        top: 0,
        width: 1525,
        height: 2160,
      },
    },
    // split pages but skip panoramic ones
    { action: 'SPLIT', skip: [1, 13, 17, 22, 23, 34, 43, 56, 79, 101] },
    // write outputs but skip the filler page
    {
      action: 'WRITE',
      skipOut: [{ pageNumber: 2, bufferIndex: 0 }],
    },
  ],
};

export default config;
