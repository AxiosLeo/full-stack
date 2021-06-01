
import fs from 'fs';
import { promisify } from 'util';

const _stat = promisify(fs.stat);

export const file = async (filepath: string): Promise<boolean> => {
  const status = await _stat(filepath);
  return status.isFile();
};

export const dir = async (filepath: string): Promise<boolean> => {
  const status = await _stat(filepath);
  return status.isDirectory();
};
