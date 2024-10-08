import { AsyncLocalStorage } from 'async_hooks'

type Context = Record<string, any>;

export class AppContext {
  private static asyncLocalStorage = new AsyncLocalStorage<Context>();

  public static current(): Context {
    const store = AppContext.asyncLocalStorage.getStore();
    if (!store) {
      throw new Error('No context available');
    }
    return store;
  }

  public static async run<T>(context: Context, fn: () => T | Promise<T>): Promise<T> {
    return AppContext.asyncLocalStorage.run(context, fn);
  }
}
