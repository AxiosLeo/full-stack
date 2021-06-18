import {
  KoaContext,
} from '../types';
import {
  helper
} from '../utils/helper';

export const events: Record<string, any> = {};

export const register = (
  name: string,
  listener: (context: KoaContext) => void
): void => {
  if (!events[name]) {
    events[name] = [];
  }
  events[name].push(listener);
};

export const trigger = async (
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
