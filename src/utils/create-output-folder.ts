import { existsSync } from 'fs';
import { sync as mkdirpSync } from 'mkdirp';

export function createOutputFolder(outputFolder: string): void {
  if (!existsSync(outputFolder)) {
    console.log(`Creating output folder: ${outputFolder}`);
    mkdirpSync(outputFolder);
  }
}
