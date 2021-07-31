import {
  KoaContext,
} from './types';
import { helper } from '@axiosleo/cli-tool';

export const events: Record<string, any> = {};

export const AppLifecycle = {
  START: 'start',
  RECEIVE: 'receive',
  MIDDLEWARE: 'middleware',
  VALIDATE: 'validate',
  CONTROLLER: 'controller',
  RESPONSE: 'response',
  ERROR: 'error',
};

export const register = (
  name: string,
  listener: (context: KoaContext) => Promise<void>
): void => {
  if (!events[name]) {
    events[name] = [];
  }
  events[name].push(listener);
};

export const listen = async (
  name: string,
  context: KoaContext
): Promise<void> => {
  if (!events[name]) {
    return;
  }
  const listeners = events[name];
  await helper.cmd._sync_foreach(listeners, async (listener) => {
    await listener(context);
  });
};

export const trigger = async (name: string): Promise<void> => {
  if (!events[name]) {
    return;
  }
  const listeners = events[name];
  await helper.cmd._sync_foreach(listeners, async (listener) => {
    await listener();
  });
};
