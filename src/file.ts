import fs, { WriteFileOptions } from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import * as is from './is';

const _readFile = promisify(fs.readFile);
const _readdir = promisify(fs.readdir);
const _exists = promisify(fs.exists);
const _mkdir = promisify(fs.mkdir);
const _writeFile = promisify(fs.writeFile);
const _rename = promisify(fs.rename);
const _copyFile = promisify(fs.copyFile);
const _unlink = promisify(fs.unlink);
const _rmdir = promisify(fs.rmdir);

export const ext = (filename: string): string => {
  const tmp = path.extname(filename || '').split('.');
  let res = '';
  if (tmp.length > 1) {
    res = `${tmp.pop()}`;
  }
  return res;
};

export const read = async (filepath: string): Promise<string> => {
  return await _readFile(filepath, 'utf-8');
};

export const read_json = async (filepath: string): Promise<Record<string, unknown>> => {
  const content = await read(path.resolve(filepath));
  return JSON.parse(content);
};

export const mkdir = async (dir: string, recursive = true): Promise<void> => {
  const exist = await _exists(dir);
  if (!exist) {
    await _mkdir(dir, { recursive });
  }
};

export const write = async (filepath: string, content: string, options: WriteFileOptions = {}): Promise<void> => {
  await mkdir(path.dirname(filepath));
  await _writeFile(filepath, content, options);
};

export const append = async (filepath: string, content: string): Promise<void> => {
  await write(filepath, content, { flag: 'a' });
};

export const exists = async (filepath: string): Promise<boolean> => {
  return await _exists(filepath);
};

export const move = async (source: string, target: string): Promise<void> => {
  if (await exists(source)) {
    await mkdir(path.dirname(target));
    await _rename(source, target);
  }
};

export const remove = async (filepath: string, recur = true): Promise<void> => {
  if (filepath === path.sep) {
    throw new Error(`cannot delete root of system with : ${filepath}`);
  }
  if (await _exists(filepath)) {
    if (await is.file(filepath)) {
      await _unlink(filepath);
    } else {
      const dir = filepath;
      const files = await _readdir(dir);
      await Promise.all(files.map(async (filename) => {
        const full = path.join(dir, filename);
        await remove(full, recur);
      }));
      await _rmdir(filepath);
    }
  }
};

export const copy = async (source: string, target: string, recur = false): Promise<void> => {
  if (!await _exists(source)) {
    return;
  }
  if (!recur) {
    await _mkdir(path.dirname(target));
    await _copyFile(source, target);
    return;
  }
  if (await is.dir(source)) {
    const files = await _readdir(source);
    await Promise.all(files.map(async (filename) => {
      const full = path.join(source, filename);
      await copy(full, path.join(target, filename), recur);
    }));
  } else {
    await _mkdir(path.dirname(target));
    await copy(source, target);
  }
};

export const search = async (dir: string, extname = '*'): Promise<Array<string>> => {
  if (!await is.dir(dir)) {
    throw new Error('Only support dir path');
  }
  const files: Array<string> = [];
  const exts = extname && extname !== '*' ? extname.split('|') : [];
  const tmp = await _readdir(dir);
  await Promise.all(tmp.map(async (filename) => {
    const full = path.join(dir, filename);
    if (await is.file(full)) {
      const file_ext = ext(filename);
      if (!exts.length || exts.indexOf(file_ext) > -1) {
        files.push(full);
      }
    } else {
      (await search(full, extname)).forEach(item => files.push(item));
    }
  }));
  return files;
};

export const list = async (dir: string, full = false, extname = '*'): Promise<Array<string>> => {
  if (!await is.dir(dir)) {
    throw new Error('Only support dir path');
  }
  const tmp = await _readdir(dir);
  const files: Array<string> = [];
  const exts = extname.split('|');
  await Promise.all(tmp.map(async (filename) => {
    if (extname !== '*') {
      const fileext = path.extname(filename);
      if (exts.indexOf(fileext) < 0) {
        return;
      }
    }
    if (full) {
      const full_name = path.join(dir, filename);
      files.push(full_name);
    } else {
      files.push(filename);
    }
  }));
  return files;
};
