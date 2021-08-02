import { helper } from '@axiosleo/cli-tool';

export const events: Record<string, any> = {};

export const register = (
  name: string,
  listener: unknown
): void => {
  if (!events[name]) {
    events[name] = [];
  }
  events[name].push(listener);
};

export const listen = async (name: string, ...ctx: unknown[]): Promise<void> => {
  if (!events[name]) {
    return;
  }
  const listeners = events[name];
  await helper.cmd._sync_foreach(listeners, async (listener) => {
    await listener(...ctx);
  });
};
